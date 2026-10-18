const CACHE='lnd-demo-dev-v16.5.9-dev.5';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./logo-horizontal.png','./logo-mascot.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('lnd-demo-v16.5.')||k.startsWith('lnd-demo-dev-v16.5.'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==self.location.origin)return;
  const isNavigation=e.request.mode==='navigate'||e.request.destination==='document';
  if(isNavigation){
    e.respondWith(fetch(e.request).then(resp=>{
      if(resp&&resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));}
      return resp;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
  })));
});
