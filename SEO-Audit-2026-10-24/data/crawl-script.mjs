import fs from 'fs';
const base='https://thezcs.com';
const sm=await (await fetch(base+'/sitemap.xml')).text();
const urls=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
console.log('sitemap urls',urls.length, 'unique', new Set(urls).size);
const out=[];
const g=(h,re)=>{const m=h.match(re);return m?m[1].trim():null};
for(const u of urls){
  const r=await fetch(u,{redirect:'manual',headers:{'user-agent':'Mozilla/5.0 (compatible; Googlebot/2.1)'}});
  const h=await r.text();
  const body=h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  const h1=[...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>strip(m[1]));
  const h2=[...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m=>strip(m[1]));
  const ld=[...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>{try{const j=JSON.parse(m[1]);return (j['@graph']||[j]).map(x=>x['@type']).flat().join('+')}catch(e){return 'INVALID'}});
  const imgs=[...h.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
  const links=[...h.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g)].map(m=>m[1]);
  out.push({u,status:r.status,loc:r.headers.get('location'),xrobots:r.headers.get('x-robots-tag'),
   title:g(h,/<title[^>]*>([\s\S]*?)<\/title>/),desc:g(h,/<meta name="description" content="([^"]*)"/),
   canon:g(h,/<link rel="canonical" href="([^"]*)"/),robots:g(h,/<meta name="robots" content="([^"]*)"/),
   ogimg:g(h,/<meta property="og:image" content="([^"]*)"/),h1,h2n:h2.length,h2:h2.slice(0,12),ld,
   words:body.split(' ').length,imgs:imgs.length,noalt:imgs.filter(i=>!/alt="[^"]+"/.test(i)).length,links:[...new Set(links)]});
}
fs.writeFileSync('crawl.json',JSON.stringify(out,null,1));
for(const o of out)console.log(o.status,o.u.replace(base,''),'|T',o.title?.length,'|D',o.desc?.length,'|H1',o.h1.length,'|W',o.words,'|LD',o.ld.join(','),'|canon',o.canon===o.u?'ok':o.canon,'|noalt',o.noalt+'/'+o.imgs,o.robots||'');
