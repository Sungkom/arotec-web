"""Build the additive SEO pilot from reviewed, rendered existing-language snapshots.

Run from the project: python tools/build-multilingual-seo.py
Inputs live in seo/. The output manifest only owns generated pilot files;
original website documents and the existing pending circle repair are untouched.
"""
from pathlib import Path, PurePosixPath
from html.parser import HTMLParser
from urllib.parse import urlsplit, urlunsplit, unquote
import copy, hashlib, html, json, posixpath, re
ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads((ROOT/'seo/localized-seo.json').read_text(encoding='utf-8'))
POLICY=json.loads((ROOT/'seo/cookie-policies.json').read_text(encoding='utf-8'))
BASE=CONFIG['canonicalBase'].rstrip('/')+'/'
assert BASE.startswith('https://') and urlsplit(BASE).netloc and BASE.endswith('/')
LOCALES=CONFIG['locales']; PAGES=CONFIG['pages']; OUTPUT={}
if (ROOT/'index.html').exists():
 for row in json.loads((ROOT/'seo/source-input-hashes.json').read_text(encoding='utf-8'))['files']:
  p=ROOT/row['path'];assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],'Source changed; recapture/review before rebuilding: '+row['path']
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Node:
 def __init__(self,tag='',attrs=None,parent=None):self.tag=tag;self.attrs=dict(attrs or []);self.children=[];self.parent=parent
 def append(self,n):
  if isinstance(n,Node):n.parent=self
  self.children.append(n);return n
 def remove(self):
  if self.parent:self.parent.children.remove(self);self.parent=None
 def all(self,tag=None):
  for c in self.children:
   if isinstance(c,Node):
    if tag is None or c.tag==tag:yield c
    yield from c.all(tag)
 def find(self,tag):return next(self.all(tag),None)
 def render(self):
  if not self.tag:return ''.join(c.render() if isinstance(c,Node) else c for c in self.children)
  attrs=''.join(' '+k+('="'+html.escape(str(v),quote=True)+'"' if v is not None else '') for k,v in self.attrs.items())
  return '<'+self.tag+attrs+'>'+('' if self.tag in VOID else ''.join(c.render() if isinstance(c,Node) else c for c in self.children)+'</'+self.tag+'>')
class Parser(HTMLParser):
 def __init__(self,s):super().__init__(convert_charrefs=False);self.root=Node();self.stack=[self.root];self.feed(s)
 def handle_starttag(self,t,a):
  n=self.stack[-1].append(Node(t,a))
  if t not in VOID:self.stack.append(n)
 def handle_startendtag(self,t,a):self.stack[-1].append(Node(t,a))
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,s):self.stack[-1].append(s)
 def handle_entityref(self,s):self.stack[-1].append('&'+s+';')
 def handle_charref(self,s):self.stack[-1].append('&#'+s+';')
 def handle_comment(self,s):pass
def fragment(s):return Parser(s).root.children
def add(parent,s):
 for n in fragment(s):parent.append(n)
def esc(s):return html.escape(str(s),quote=True)
def rel(target,dest):return posixpath.relpath(target,posixpath.dirname(dest) or '.')
def route(locale,page):return locale+'/'+PAGES[page]['routePath']
def href(locale,page,dest):return rel(route(locale,page),dest)
SOURCE_MAP={p['sourcePath']:k for k,p in PAGES.items()};SOURCE_MAP['Neuro-Skin-Science.html']='neuroSkin'
def local_url(value,source,dest,is_link=False):
 if not value or value.startswith(('#','data:','mailto:','tel:','javascript:','blob:')):return value
 u=urlsplit(value)
 if u.netloc:
  if u.hostname in ('localhost','127.0.0.1'):p=unquote(u.path.lstrip('/'))
  elif u.netloc==urlsplit(BASE).netloc and u.path.startswith(urlsplit(BASE).path):p=unquote(u.path[len(urlsplit(BASE).path):])
  else:return value
 elif u.path.startswith('/'):
  p=unquote(u.path.lstrip('/'))
  prefix=urlsplit(BASE).path.strip('/')+'/'
  if p.startswith(prefix):p=p[len(prefix):]
 else:p=posixpath.normpath(posixpath.join(posixpath.dirname(source),unquote(u.path)))
 if p in ('','.'):p='index.html'
 if p.startswith('../'):raise ValueError('Outside source root: '+value)
 if is_link and p in SOURCE_MAP:p=route(dest.split('/')[0],SOURCE_MAP[p])
 result=rel(p,dest)
 return urlunsplit(('', '',result,u.query,u.fragment))
URL_RX=re.compile(r'url\(\s*([\"\x27]?)([^\"\x27)]+)\1\s*\)',re.I)
def css_urls(value,source,dest):return URL_RX.sub(lambda m:'url("'+local_url(m.group(2),source,dest)+'")',value)
def metadata(head,locale,page,dest,title,description,policy=False):
 for n in list(head.all()):
  if n.tag=='title' or (n.tag=='meta' and (n.attrs.get('name') in ('description','robots') or n.attrs.get('property','').startswith('og:') or n.attrs.get('http-equiv','').lower()=='refresh')) or (n.tag=='link' and n.attrs.get('rel') in ('canonical','alternate')):n.remove()
 url=BASE+dest
 add(head,'<title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+esc(url)+'"><meta property="og:type" content="website"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+esc(url)+'">')
 for other,info in LOCALES.items():
  target=other+'/cookie-policy.html' if policy else route(other,page)
  add(head,'<link rel="alternate" hreflang="'+esc(info['hreflang'])+'" href="'+esc(BASE+target)+'">')
 target=CONFIG['defaultLocale']+'/cookie-policy.html' if policy else route(CONFIG['defaultLocale'],page)
 add(head,'<link rel="alternate" hreflang="x-default" href="'+esc(BASE+target)+'">')
def language_nav(locale,page,dest,policy=False,css_class='pilot-languages'):
 s=CONFIG['strings'][locale]; links=[]
 for other,info in LOCALES.items():
  target=other+'/cookie-policy.html' if policy else route(other,page)
  links.append('<a class="language-chip" data-pilot-locale="'+other+'" hreflang="'+esc(info['hreflang'])+'" lang="'+esc(info['htmlLang'])+'" href="'+esc(rel(target,dest))+'"'+(' aria-current="page"' if other==locale else '')+'>'+esc(info['label'])+'</a>')
 return '<nav class="'+css_class+'" aria-label="'+esc(s['languageNavigation'])+'">'+''.join(links)+'</nav>'
def common(doc,locale,page,source,dest,policy=False):
 root=doc.find('html');head=doc.find('head');body=doc.find('body');s=CONFIG['strings'][locale]
 root.attrs['lang']=LOCALES[locale]['htmlLang'];root.attrs['data-seo-pilot']='true';root.attrs['data-pilot-locale']=locale
 body.attrs['data-root']=rel('index.html',dest).removesuffix('index.html');body.attrs['data-pilot-page']=page
 for n in list(doc.all()):
  if n.tag=='template':n.remove();continue
  if n.tag=='script':
   src=n.attrs.get('src','');deny=(not src or 'site.min.js' in src or '/site.js' in src or 'content-localization' in src or '/i18n/' in src or 'get-in-touch.js' in src or 'applied-solutions-navigation' in src or 'kobayashi-navigation' in src or urlsplit(src).netloc or posixpath.basename(urlsplit(src).path)=='script.js')
   if deny:n.remove();continue
  for k in list(n.attrs):
   if k.startswith('on') or k.startswith('data-arotec-i18n'):del n.attrs[k]
  if n.attrs.get('lang')==LOCALES[locale]['catalogLocale']:n.attrs['lang']=LOCALES[locale]['htmlLang']
  if 'class' in n.attrs:
   classes=n.attrs['class'].split();classes=[x for x in classes if x not in ('js-reveal-ready','menu-open')]
   if any(x in classes for x in ('fw-reveal','story-heading-reveal','story-text-reveal','story-image-reveal','story-section-frame','reveal')):classes+=['is-visible','is-story-visible','revealed']
   n.attrs['class']=' '.join(dict.fromkeys(classes))
  if 'style' in n.attrs:
   n.attrs['style']=re.sub(r'--(?:arotec-foreground-shift-x|home-hero-copy-offset|detail-header-space|wellbeing-[\w-]+|story-[\w-]+|scroll-[\w-]+|parallax-[\w-]+)\s*:[^;]+;?','',n.attrs['style'])
   n.attrs['style']=css_urls(n.attrs['style'],source,dest)
  for key in ('src','href','poster','action','data-src'):
   if key in n.attrs:n.attrs[key]=local_url(n.attrs[key],source,dest,is_link=key=='href' and n.tag=='a')
  if 'srcset' in n.attrs:
   n.attrs['srcset']=','.join(local_url(v.strip().split()[0],source,dest)+' '+ ' '.join(v.strip().split()[1:]) for v in n.attrs['srcset'].split(','))
  if n.tag=='style':n.children=[css_urls(''.join(c for c in n.children if isinstance(c,str)),source,dest)]
  if n.tag=='select' and n.attrs.get('id')=='languageSelect':
   new=fragment('<details class="pilot-language-select"><summary>'+esc(LOCALES[locale]['label'])+'</summary>'+language_nav(locale,page,dest,policy)+'</details>')[0];i=n.parent.children.index(n);n.parent.children[i]=new;new.parent=n.parent;continue
  if n.tag=='button' and n.attrs.get('data-lang-chip'):
   catalog=n.attrs['data-lang-chip'];other=next((l for l,inf in LOCALES.items() if inf['catalogLocale']==catalog),None)
   if other:
    n.tag='a';n.attrs.pop('type',None);n.attrs.pop('data-lang-chip',None);n.attrs['data-pilot-locale']=other;n.attrs['href']=rel(other+'/cookie-policy.html' if policy else route(other,page),dest);n.attrs['hreflang']=LOCALES[other]['hreflang']
  if n.tag=='form':
   n.tag='div';n.attrs.pop('action',None);n.attrs.pop('method',None);n.attrs['role']='group';n.attrs['data-static-form']='true';note_id='pilot-form-note-'+str(len(list(doc.all('form'))))
   for control in n.all('button'):
    if control.attrs.get('type','submit')=='submit':control.attrs['disabled']='';control.attrs['aria-describedby']=note_id
   add(n,'<p class="pilot-form-note" id="'+note_id+'">'+esc(s['contactFormUnavailable'])+' <a href="mailto:arotec@arotec-group.com">'+esc(s['emailContactAction'])+'</a></p>')
 add(head,'<link rel="stylesheet" href="'+rel('assets/css/seo-pilot.css',dest)+'"><link rel="stylesheet" href="'+rel('assets/css/cookie-preferences.css',dest)+'">')
 nav='<nav class="pilot-route-links" aria-label="'+esc(s['primaryNavigation'])+'">'+''.join('<a href="'+esc(href(locale,k,dest))+'">'+esc(s[k])+'</a>' for k in PAGES)+'</nav>'
 add(body,'<footer class="pilot-footer">'+nav+language_nav(locale,page,dest,policy)+'<a href="'+esc(rel(locale+'/cookie-policy.html',dest))+'">'+esc(s['cookiePolicy'])+'</a><button type="button" data-arotec-storage-open>'+esc(s['storageSettings'])+'</button></footer><div data-arotec-storage-mount></div><noscript><p class="pilot-noscript">'+esc(s['languageStorageExplanation'])+' <a href="'+esc(rel(locale+'/cookie-policy.html',dest))+'">'+esc(s['cookiePolicy'])+'</a></p></noscript>')
 storage={'locale':locale,'locales':list(LOCALES),'strings':s,'policyHref':rel(locale+'/cookie-policy.html',dest),'landing':False,'localeHomeHrefs':{l:rel(route(l,'home'),dest) for l in LOCALES}}
 search={'search':[{'title':PAGES[k]['localized'][locale]['title'],'description':PAGES[k]['localized'][locale]['description'],'href':href(locale,k,dest)} for k in PAGES],'strings':s}
 for ident,data in [('arotec-storage-config',storage),('seo-pilot-config',search)]:
  n=Node('script',[('type','application/json'),('id',ident)]);n.append(json.dumps(data,ensure_ascii=False).replace('<','\\u003c'));body.append(n)
 for file in ('assets/js/seo-pilot.js','assets/js/cookie-preferences.js'):add(body,'<script src="'+rel(file,dest)+'" defer></script>')
 return head,body
for locale in LOCALES:
 for page,info in PAGES.items():
  snap=json.loads((ROOT/'seo/source-snapshots'/f'{page}-{locale}.json').read_text(encoding='utf-8'));assert snap['locale']==locale and snap['source']==info['sourcePath']
  dest=route(locale,page);doc=Parser(snap['html']).root;head,body=common(doc,locale,page,info['sourcePath'],dest)
  localized=info['localized'][locale];metadata(head,locale,page,dest,localized['title'],localized['description'])
  image_css=snap.get('localeImageCSS','')
  if image_css:
   cssdest=f'assets/css/seo-localized-images/{page}-{locale}.css';OUTPUT[cssdest]=css_urls(image_css,info['sourcePath'],cssdest).encode();add(head,'<link rel="stylesheet" href="'+rel(cssdest,dest)+'">')
  OUTPUT[dest]=('<!doctype html>\n'+doc.render()).encode('utf-8')
for locale in LOCALES:
 p=POLICY['locales'][locale];dest=locale+'/cookie-policy.html';snap=json.loads((ROOT/'seo/source-snapshots'/f'home-{locale}.json').read_text(encoding='utf-8'));doc=Parser(snap['html']).root
 body=doc.find('body');body.children=[n for n in body.children if isinstance(n,Node) and (n.tag=='a' and n.attrs.get('class')=='skip-link' or n.attrs.get('id')=='site-shell' or n.attrs.get('id')=='site-footer-shell')]
 shell=next((n for n in body.all() if n.attrs.get('id')=='site-shell'),None)
 if shell:
  shell.children=[n for n in shell.children if isinstance(n,Node) and n.tag=='header']
 body.attrs={'class':'pilot-policy-page','data-root':'../'}
 main=Node('main',[('id','main'),('class','pilot-policy-main')]);body.children.insert(2,main);main.parent=body
 add(main,'<h1>'+esc(p['heading'])+'</h1><p>'+esc(p['dateLabel'])+'</p><p>'+esc(p['intro'])+'</p>')
 for section in p['sections']:add(main,'<section id="'+esc(section['id'])+'"><h2>'+esc(section['heading'])+'</h2>'+''.join('<p>'+esc(x)+'</p>' for x in section['paragraphs'])+'</section>')
 table=p['storageTable'];add(main,'<div class="pilot-table-scroll"><table><thead><tr>'+''.join('<th scope="col">'+esc(x)+'</th>' for x in table['columns'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+esc(x)+'</td>' for x in row)+'</tr>' for row in table['rows'])+'</tbody></table></div>')
 add(main,'<section><h2>'+esc(p['ownerReview']['heading'])+'</h2><ul>'+''.join('<li>'+esc(x)+'</li>' for x in p['ownerReview']['items'])+'</ul></section><p><a href="mailto:arotec@arotec-group.com">arotec@arotec-group.com</a></p>')
 head,body=common(doc,locale,'home','index.html',dest,policy=True);metadata(head,locale,'home',dest,p['title'],p['description'],policy=True)
 OUTPUT[dest]=('<!doctype html>\n'+doc.render()).encode('utf-8')
# Neutral chooser: it can honor an explicitly saved preference; locale URLs never redirect.
locale=CONFIG['defaultLocale'];s=CONFIG['strings'][locale];dest='languages.html';links=''.join('<li><a data-pilot-locale="'+l+'" lang="'+inf['htmlLang']+'" href="'+route(l,'home')+'">'+esc(inf['label'])+'</a></li>' for l,inf in LOCALES.items())
data={'locale':locale,'locales':list(LOCALES),'strings':s,'policyHref':'en/cookie-policy.html','landing':True,'localeHomeHrefs':{l:route(l,'home') for l in LOCALES}}
OUTPUT[dest]=('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Choose a language | Arotec</title><link rel="stylesheet" href="assets/css/site-typography.css"><link rel="stylesheet" href="assets/css/seo-pilot.css"><link rel="stylesheet" href="assets/css/cookie-preferences.css"></head><body class="pilot-policy-page"><main id="main" class="pilot-policy-main"><h1>Choose a language</h1><ul>'+links+'</ul><a href="en/cookie-policy.html">'+esc(s['cookiePolicy'])+'</a><button data-arotec-storage-open type="button">'+esc(s['storageSettings'])+'</button></main><div data-arotec-storage-mount></div><script type="application/json" id="arotec-storage-config">'+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+'</script><script src="assets/js/cookie-preferences.js" defer></script></body></html>').encode()
urls=[BASE+p for p in OUTPUT if p.endswith('.html') and p!='languages.html'];assert len(urls)==25
OUTPUT['sitemap.xml']=('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+esc(u)+'</loc></url>' for u in urls)+'</urlset>\n').encode()
manifest_path=ROOT/'seo/generated-manifest.json';old=json.loads(manifest_path.read_text()) if manifest_path.exists() else None
if old:
 for row in old['files']:
  p=ROOT/row['path'];assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],'Generated file edited; preserve/review before rebuilding: '+row['path']
else:
 for target in OUTPUT:assert not (ROOT/target).exists(),'Refusing to overwrite existing file: '+target
for target,b in OUTPUT.items():
 p=ROOT/target;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
manifest={'canonicalBase':BASE,'locales':list(LOCALES),'pilotPages':20,'policyPages':5,'files':[{'path':p,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()} for p,b in sorted(OUTPUT.items())],'originalDocumentsModified':False}
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps({'generatedFiles':len(OUTPUT),'pilotPages':20,'policyPages':5,'canonicalBase':BASE}))
