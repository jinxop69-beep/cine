/* === OLLADA VISUAL FINAL PATCH: web/app split + mobile native polish === */
(function(){
  const mqMobile = () => window.innerWidth <= 880;
  const pathIsApp = () => (location.pathname||'').toLowerCase().endsWith('/app.html');
  const isStandalone = () => (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
  window.aplicarModoOllada = window.aplicarModoCineCircle = function(){
    try{
      const qs=new URLSearchParams(location.search);
      const app = qs.get('modo')==='web' ? false : (pathIsApp() || qs.get('modo')==='app' || isStandalone() || mqMobile());
      document.documentElement.classList.toggle('app-mode', app);
      document.documentElement.classList.toggle('web-mode', !app);
      document.documentElement.setAttribute('data-mode', app?'app':'web');
      document.body.classList.toggle('ollada-mobile-ui', app);
      const btn=document.getElementById('mode-toggle'); if(btn) btn.textContent=app?'🌐 Web':'📱 App';
    }catch(e){}
  };
  const esc = window.esc || function(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')};
  const safeOpen = window.openPayload || function(item){return JSON.stringify(JSON.stringify(item));};
  function st(){
    const lst=Object.values((window.S&&S.titulos)||{});
    const vst=lst.filter(e=>e.estado==='visto');
    const m=vst.filter(e=>e.media_type==='movie').length;
    const s=vst.filter(e=>e.media_type==='tv').length;
    const h=Math.max(0,Math.round(m*2+s*8));
    const pns=lst.filter(e=>e.puntuacion>0).map(e=>Number(e.puntuacion));
    const med=pns.length?(pns.reduce((a,b)=>a+b,0)/pns.length).toFixed(1):'—';
    return {lst,vst,m,s,h,med};
  }
  function av(cls){
    const p=(window.S&&S.perfil)||{};
    if(p.avatar_url) return `<div class="${cls}"><img src="${esc(p.avatar_url)}" alt="avatar"></div>`;
    return `<div class="${cls}"><span>${esc(p.avatar||'🎬')}</span></div>`;
  }
  function reify(e){return {id:e.tmdb_id,media_type:e.media_type||'movie',title:e.titulo,name:e.titulo,poster_path:e.poster_path,backdrop_path:e.backdrop_path,overview:e.descripcion,release_date:e.fecha,first_air_date:e.fecha,genre_ids:e.genre_ids,vote_average:e.vote_average};}
  function posterRow(items, max=6){
    const arr=(items||[]).slice(0,max);
    if(!arr.length) return '<div class="of-empty">Añade favoritos para verlos aquí.</div>';
    return arr.map(e=>{const src=IMG(e.poster_path,'w342');return `<button class="of-poster" onclick='abrir(${safeOpen(reify(e))})'>${src?`<img src="${src}" alt="${esc(e.titulo)}">`:'<div class="cph">🎬</div>'}<b>${esc(e.titulo||'Título')}</b>${e.puntuacion?`<span>⭐ ${e.puntuacion}</span>`:''}</button>`}).join('');
  }

  // Hard mode on first paint and after resize
  aplicarModoOllada();
  window.addEventListener('resize', ()=>{clearTimeout(window.__olladaFinalResize); window.__olladaFinalResize=setTimeout(()=>{aplicarModoOllada(); try{ if(window.vistaActual==='inicio') rinicio(); if(window.vistaActual==='perfil') rperfil(); }catch(e){}},120)}, {passive:true});

  const previousRinicio = window.rinicio;
  window.rinicio = async function(){
    aplicarModoOllada();
    if(!document.documentElement.classList.contains('app-mode')){
      if(previousRinicio) return previousRinicio();
    }
    const root=document.getElementById('v-inicio'); if(!root) return;
    const p=(S&&S.perfil)||{}; const stats=st();
    root.innerHTML = `<div class="om-home">
      <section class="om-hero-card">
        <div class="om-hero-glow"></div>
        <div class="om-kicker">👁️ Tu mirada al cine y las series</div>
        <h1>Ollada</h1>
        <p>Registra lo que ves, comparte tu perfil y decide qué ver con amigos o pareja.</p>
        <div class="om-search"><span>🔍</span><input id="h-sinp" placeholder="Busca Hamnet, Cumbre borrascosa…" onkeydown="if(event.key==='Enter')hbuscarFinal('h-sinp')"><button onclick="hbuscarFinal('h-sinp')">Buscar</button></div>
        <div class="om-stats"><div><b>${stats.m}</b><span>Películas</span></div><div><b>${stats.s}</b><span>Series</span></div><div><b>${stats.h}h</b><span>Horas</span></div><div><b>${stats.med}</b><span>Media</span></div></div>
      </section>
      <section class="om-card om-tonight"><div><div class="om-title">🤝 Qué vemos esta noche</div><p>El acceso a Juntos está aquí para que nadie se pierda.</p></div><button onclick="ir('conjunto')">Abrir Juntos</button></section>
      <section class="om-section"><div class="om-section-head"><h2>🔥 Tendencias</h2><button onclick="ir('buscar')">Ver más</button></div><div class="om-row" id="trend-row"></div></section>
      <section class="om-section"><div class="om-section-head"><h2>📈 Actividad reciente</h2><button onclick="ir('amigos')">Ver feed</button></div><div id="om-feed" class="om-feed"><div class="of-empty">Cargando actividad…</div></div></section>
    </div>`;
    const row=document.getElementById('trend-row');
    if(row){row.innerHTML=Array(6).fill('<div class="om-poster-skel"></div>').join(''); try{const d=await tmdb('/trending/all/week'); row.innerHTML=(d.results||[]).slice(0,10).map(i=>`<div class="om-poster-wrap">${tarjeta({...i,media_type:i.media_type||'movie'},true)}</div>`).join('');}catch(e){row.innerHTML='<div class="of-empty">No se pudieron cargar tendencias.</div>';}}
    loadMobileFeed();
  };
  async function loadMobileFeed(){
    const el=document.getElementById('om-feed'); if(!el) return;
    if(!window.supabaseClient){el.innerHTML='<div class="of-empty">Conecta Supabase para ver actividad.</div>'; return;}
    try{const acts=await sb('activity.mobile', supabaseClient.from('activity_feed').select('*').order('created_at',{ascending:false}).limit(4)); el.innerHTML=(acts||[]).length?(acts||[]).map(a=>{const d=a.data||{};return `<div class="om-feed-item"><div class="ofi-av">${d.avatar||'🎬'}</div><div><b>@${esc(d.username||'usuario')}</b><span>${textoActividad(a).replace(/<[^>]+>/g,'')}</span>${d.text?`<p>“${esc(String(d.text).slice(0,90))}”</p>`:''}</div></div>`}).join(''):'<div class="of-empty">Tu actividad y la de tus amigos aparecerá aquí.</div>'; }catch(e){el.innerHTML='<div class="of-empty">No se pudo cargar actividad.</div>';}
  }

  const previousRperfil = window.rperfil;
  window.rperfil = function(){
    aplicarModoOllada();
    const root=document.getElementById('v-perfil'); if(!root) return;
    const p=(S&&S.perfil)||{}; const stats=st();
    const favs=stats.lst.filter(e=>e.favorito).sort((a,b)=>(b.puntuacion||0)-(a.puntuacion||0));
    const reviews=stats.lst.filter(e=>(e.resena||'').trim()).slice(0,4);
    root.innerHTML = `<div class="of-profile">
      <section class="of-hero" style="${p.banner_url?`background-image:linear-gradient(180deg,rgba(0,0,0,.08),#08080a 92%),url('${esc(p.banner_url)}')`:''}">
        <div class="of-orb one"></div><div class="of-orb two"></div>
        ${av('of-avatar')}
        <h1>@${esc(p.usuario||'cinephile')}</h1>
        <p>${esc(p.bio||'Viviendo fotograma a fotograma.')}</p>
        <div class="of-actions"><button class="primary" onclick="compartirPerfil()">📸 Compartir perfil</button><button onclick="oedit()">✏️ Editar</button><button onclick="abrirMiPerfilPublico()">👁️ Público</button><button onclick="cerrarSesion()">🚪 Salir</button></div>
      </section>
      <section class="of-stats"><div><b>${stats.m}</b><span>Películas</span></div><div><b>${stats.s}</b><span>Series</span></div><div><b>${stats.h}h</b><span>Horas</span></div><div><b>${stats.med}</b><span>Media</span></div></section>
      <section class="of-card"><div class="of-head"><h2>🏆 Top favoritos</h2><button onclick="ir('buscar')">Añadir</button></div><div class="of-posters">${posterRow(favs,6)}</div></section>
      <section class="of-card"><div class="of-head"><h2>🎬 Biblioteca</h2><button onclick="ir('buscar')">Buscar</button></div><div class="of-tabs"><button class="ptab on" data-tab="todo" onclick="setTabPerfil('todo')">Todo <span id="tc-todo">${stats.lst.length}</span></button><button class="ptab" data-tab="viendo" onclick="setTabPerfil('viendo')">▶️ Viendo <span id="tc-viendo">${stats.lst.filter(e=>e.estado==='viendo').length}</span></button><button class="ptab" data-tab="visto" onclick="setTabPerfil('visto')">✅ Vistos <span id="tc-visto">${stats.vst.length}</span></button><button class="ptab" data-tab="pendiente" onclick="setTabPerfil('pendiente')">📌 Pend. <span id="tc-pendiente">${stats.lst.filter(e=>e.estado==='pendiente').length}</span></button><button class="ptab" data-tab="abandonado" onclick="setTabPerfil('abandonado')">❌ Aband. <span id="tc-abandonado">${stats.lst.filter(e=>e.estado==='abandonado').length}</span></button></div><div class="of-library" id="wgrd"></div></section>
      <section class="of-card"><div class="of-head"><h2>⚡ Accesos</h2></div><div class="of-menu"><button onclick="ir('conjunto')"><span>🤝</span>Juntos</button><button onclick="ir('ia')"><span>✨</span>IA</button><button onclick="ir('wrapped')"><span>🏆</span>Wrapped</button><button onclick="ir('listas')"><span>📋</span>Listas</button><button onclick="mostrarStatsAvanzadas()"><span>📊</span>Stats</button><button onclick="abrirNotificaciones()"><span>🔔</span>Notifs</button></div></section>
      <section class="of-card"><div class="of-head"><h2>💬 Reseñas recientes</h2></div>${reviews.length?reviews.map(r=>`<div class="of-review"><b>${esc(r.titulo)}</b><p>${esc(String(r.resena).slice(0,160))}${String(r.resena).length>160?'…':''}</p></div>`).join(''):'<div class="of-empty">Escribe una reseña y aparecerá aquí.</div>'}</section>
      <section class="of-card"><div class="of-head"><h2>🏅 Logros</h2></div><div class="of-badges"><div><b>🎬</b><span>Primera vez</span><small>${stats.lst.length?'Obtenido ✓':'Bloqueado'}</small></div><div><b>🔟</b><span>Diez títulos</span><small>${stats.lst.length>=10?'Obtenido ✓':'Bloqueado'}</small></div><div><b>✍️</b><span>Crítico/a</span><small>${reviews.length>=3?'Obtenido ✓':'Bloqueado'}</small></div></div></section>
    </div>`;
    try{ tabPerfilActual=tabPerfilActual||'todo'; setTabPerfil(tabPerfilActual); }catch(e){}
  };

  window.renderTabPerfil = function(){
    const stats=st(); const items=tabPerfilActual==='todo'?stats.lst:stats.lst.filter(e=>e.estado===tabPerfilActual); const grid=document.getElementById('wgrd'); if(!grid) return;
    document.querySelectorAll('.ptab').forEach(b=>b.classList.toggle('on',b.dataset.tab===tabPerfilActual));
    if(!items.length){grid.innerHTML='<div class="of-empty">Nada por aquí todavía.</div>'; return;}
    grid.innerHTML=items.slice(0,30).map(e=>`<div class="of-library-item">${tarjeta(reify(e),true)}</div>`).join('');
  };

  // Make view changes reapply final mode and renderers.
  const oldIr = window.ir;
  if(oldIr){
    window.ir=function(v){ aplicarModoOllada(); oldIr(v); setTimeout(()=>{try{aplicarModoOllada(); if(v==='inicio') rinicio(); if(v==='perfil') rperfil(); if(v==='buscar') rsr&&rsr();}catch(e){}},20); };
  }
  setTimeout(()=>{try{aplicarModoOllada(); if((window.vistaActual||'inicio')==='inicio') rinicio();}catch(e){}},60);
})();
