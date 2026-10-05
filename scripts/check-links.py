"""Check generated HTML. Uses only the Python standard library."""
import argparse
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://wickisport.ch'
parser = argparse.ArgumentParser()
parser.add_argument('--asset-inventory', type=Path, help='Optional verified repository asset paths when binary files are not materialized.')
args = parser.parse_args()
assets = set(json.loads(args.asset_inventory.read_text())) if args.asset_inventory else set()
manifest = json.loads((ROOT/'scripts/generated-files.json').read_text())
errors = []
voids = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = []
        self.references = []
        self.h1 = 0
        self.canonical = []
        self.stack = []
        self.title = []
        self.images = 0
        self.feed((ROOT/path).read_text())
        self.close()
    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag not in voids: self.stack.append(tag)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical.append(attrs.get('href'))
        if tag == 'img':
            self.images += 1
            if not all(attrs.get(k) for k in ['alt', 'width', 'height']): errors.append(f'{self.path}: incomplete image attributes')
        if tag == 'a' and attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', ''):
            errors.append(f'{self.path}: external tab link without noopener')
        for key in ['href', 'src']:
            if attrs.get(key): self.references.append(attrs[key])
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            errors.append(f'{self.path}: unexpected closing tag {tag}')
        else: self.stack.pop()
    def handle_data(self, data):
        if self.stack and self.stack[-1] == 'title': self.title.append(data)

pages = {path: Page(path) for path in manifest if path.endswith('.html')}
seen_titles = set()
reference_count = 0
for path, page in pages.items():
    route = '/' + path.removesuffix('index.html')
    if page.stack: errors.append(f'{path}: unclosed tags {page.stack}')
    if page.h1 != 1: errors.append(f'{path}: expected one H1, got {page.h1}')
    if page.canonical != [SITE + route]: errors.append(f'{path}: wrong canonical {page.canonical}')
    for identifier, count in Counter(page.ids).items():
        if count > 1: errors.append(f'{path}: duplicate id {identifier}')
    title = ''.join(page.title).strip()
    if not title or title in seen_titles: errors.append(f'{path}: missing or duplicate title')
    seen_titles.add(title)
    for ref in page.references:
        target = urlparse(urljoin(SITE + route, ref))
        if target.scheme not in ['http', 'https'] or target.netloc != 'wickisport.ch': continue
        reference_count += 1
        target_path = unquote(target.path).lstrip('/')
        if target.path.endswith('/'): target_path += 'index.html'
        if not (ROOT/target_path).is_file() and target_path not in assets:
            errors.append(f'{path}: missing {target_path}')
        if target.fragment and target_path in pages and unquote(target.fragment) not in pages[target_path].ids:
            errors.append(f'{path}: missing anchor {ref}')

sitemap = ET.parse(ROOT/'sitemap.xml')
urls = [node.text for node in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
expected = {SITE + '/' + path.removesuffix('index.html') for path in pages}
if len(urls) != len(set(urls)) or set(urls) != expected: errors.append('Sitemap and generated pages do not match.')
if (ROOT/'CNAME').read_text().strip() != 'wickisport.ch': errors.append('CNAME changed.')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(pages)} pages, {reference_count} internal references, unique titles/H1/IDs, image attributes, canonical URLs, sitemap and CNAME.')
if assets: print('Existing binary asset paths verified against the supplied repository inventory; no visual image check.')
