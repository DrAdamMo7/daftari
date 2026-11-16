const $=s=>document.querySelector(s),E=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P=t=>String(t||'').split(/\n+/).filter(Boolean).map(p=>`<p>${E(p)}</p>`).join('');
const U=u=>/^(https?:|tel:|mailto:)/.test(u)?E(u):'#';
const PG=document.body.dataset.page;
const NAV=[['index','الرئيسية'],['features','المزايا'],['download','التحميل'],['reviews','الآراء'],['about','من نحن'],['contact','تواصل']];
const stars=n=>'<span class="st">'+'★'.repeat(n)+'<i>'+'★'.repeat(5-n)+'</i></span>';
let D,S,L,RV=[];
const FBC=()=>D.firebase&&D.firebase.projectId&&D.firebase.apiKey?D.firebase:null;
async function fsRev(){const c=FBC(),r=await fetch(`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents:runQuery?key=${c.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{from:[{collectionId:'reviews'}],where:{fieldFilter:{field:{fieldPath:'approved'},op:'EQUAL',value:{booleanValue:true}}},limit:100}})});
 const j=await r.json(),v=(f,k)=>f[k]?.stringValue??f[k]?.integerValue??'';
 return j.filter(x=>x.document).map(x=>{const f=x.document.fields||{};return{name:v(f,'name'),rating:+v(f,'rating')||0,text:v(f,'text'),t:f.createdAt?.timestampValue||''}}).sort((a,b)=>b.t.localeCompare(a.t))}
fetch('data.json?'+Date.now()).then(r=>r.json()).then(d=>{D=d;S=d.site||{};L=(d.versions||[]).find(v=>v.version==d.latest);boot()}).catch(()=>{$('#main').innerHTML='<p>تعذر تحميل البيانات</p>'});

const feats=l=>`<div class="grid">${l.map(f=>`<div class="paper reveal"><h3>${E(f.title)}</h3><p>${E(f.text)}</p></div>`).join('')}</div>`;
const revs=l=>l.length?`<div class="grid">${l.map(r=>`<div class="paper gold reveal">${r.rating?stars(r.rating):''}<p>${E(r.text)}</p><div class="who">${E(r.name||'مستخدم دفتري')}</div></div>`).join('')}</div>`:'<p class="lead">لا توجد آراء منشورة بعد، كن أول من يكتب رأيه.</p>';
const gal=()=>(D.images||[]).length?`<div class="shots reveal">${D.images.map(i=>`<img src="${E(i.src)}" alt="${E(i.cap)}">`).join('')}</div>`:'';
const board=()=>`<section class="reveal"><h2 class="t"><span>${E(S.boardTitle)}</span></h2><p class="lead">${E(S.boardText)}</p>
<div class="boardbox"><div class="tools"><button data-c="#0e7490" class="on"><i style="background:#0e7490"></i>أزرق</button><button data-c="#111"><i style="background:#111"></i>أسود</button><button data-c="#dc2626"><i style="background:#dc2626"></i>أحمر</button><button data-c="#16a34a"><i style="background:#16a34a"></i>أخضر</button><button id="bc" style="margin-inline-start:auto">مسح السبورة</button></div><canvas id="cv"></canvas></div></section>`;
const form=()=>`<form id="fb"><div class="starin" role="radiogroup" aria-label="التقييم">${[5,4,3,2,1].map(n=>`<input type="radio" name="r" id="s${n}" value="${n}"><label for="s${n}">★</label>`).join('')}</div>
<input name="n" placeholder="الاسم (اختياري)" maxlength="40"><input name="web" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
<textarea name="m" rows="4" maxlength="600" placeholder="اكتب رأيك هنا" required></textarea><button class="btn" type="submit">إرسال</button><div id="fm" style="color:var(--gold)"></div></form>`;
const head=(t,s)=>`<div class="ph"><h1><span>${E(t)}</span></h1>${s?`<p class="lead">${E(s)}</p>`:''}</div>`;
const doc=(t,x)=>head(t)+`<div class="paper prose">${P(x)}</div>`;
const dl=()=>L?E(L.url):'download.html';

const R={
index(){const h=S.hero||(D.images[0]||{}).src;const of=(D.offers||[]).filter(o=>o.active&&(!o.ends||new Date(o.ends)>=new Date(new Date().toDateString())));
 const rv=RV.slice(0,3);
 $('#main').innerHTML=`<div class="hero"><div><h1>${E(S.tagline1)}<br><span>${E(S.tagline2)}</span></h1><p>${E(S.subtitle)}</p>
 <p><a class="btn" href="${dl()}" ${L?'download':''}>${L?'تحميل النسخة '+E(L.version):'التحميل'}</a> <a class="btn ghost" href="features.html">المزايا</a></p></div>${h?`<img class="shot" src="${E(h)}" alt="">`:''}</div>
 ${of.length?`<section><h2 class="t"><span>العروض والأخبار</span></h2><br><div class="grid">${of.map(o=>`<div class="paper gold reveal"><h3>${E(o.title)}</h3><p>${E(o.text)}</p>${o.ends?`<p class="who">ينتهي: ${E(o.ends)}</p>`:''}</div>`).join('')}</div></section>`:''}
 <section><h2 class="t"><span>المزايا</span></h2><br>${feats((D.features||[]).slice(0,6))}</section>
 ${board()}
 ${(D.images||[]).length?`<section><h2 class="t"><span>صور من التطبيق</span></h2><br>${gal()}</section>`:''}
 <section><h2 class="t"><span>آراء المستخدمين</span></h2><br>${revs(rv)}<p><a class="btn ghost" href="reviews.html">كل الآراء</a></p></section>`},
features(){$('#main').innerHTML=head('المزايا',S.intro)+feats(D.features||[])+board()},
download(){$('#main').innerHTML=head('التحميل',S.install)+(D.versions||[]).map(v=>`<div class="paper ver reveal"><div><b>النسخة ${E(v.version)}</b>${v.version==D.latest?'<span class="tag">الأحدث</span>':''}<br><small>${E(v.date)}${v.size?' - '+E(v.size):''}</small><p>${E(v.notes)}</p></div><a class="btn ${v.version==D.latest?'':'ghost'}" href="${E(v.url)}" download>تحميل</a></div>`).join('')},
reviews(){$('#main').innerHTML=head('آراء المستخدمين')+revs(RV)+`<section><h2 class="t"><span>رأيك يهمنا</span></h2><br>${form()}</section>`;fb()},
about(){$('#main').innerHTML=doc('من نحن',S.about)+`<div class="paper prose"><h3>ما هو دفتري؟</h3>${P(S.intro)}</div>`},
contact(){const O=D.owner||{};$('#main').innerHTML=head('تواصل معنا')+`<div class="grid"><div class="paper"><h3>${E(O.name)}</h3><p><a href="tel:${E(O.phone)}">${E(O.phone)}</a></p><p><a href="https://instagram.com/${E(O.instagram)}" target="_blank" rel="noopener">انستغرام: ${E(O.instagram)}</a></p></div>
 ${(D.accounts||[]).map(a=>`<div class="paper"><h3>${E(a.label)}</h3><p><a href="${U(a.url)}" target="_blank" rel="noopener">${E(a.url)}</a></p></div>`).join('')}
 <div class="paper"><h3>رأي أو مشكلة؟</h3><p><a href="reviews.html">اكتب لنا من صفحة الآراء</a></p></div></div>`},
privacy(){$('#main').innerHTML=doc('سياسة الخصوصية',S.privacy)},
terms(){$('#main').innerHTML=doc('الشروط والأحكام',S.terms)}
};

async function boot(){const O=D.owner||{},A=D.accounts||[];
 $('#hd').innerHTML=`<header><div class="wrap"><a class="brand" href="index.html"><img src="assets/logo.svg" alt=""><b>${E(S.name)}</b></a><nav>${NAV.map(([p,t])=>`<a href="${p}.html"${p==PG?' class="on"':''}>${t}</a>`).join('')}</nav></div></header>`;
 $('#ft').innerHTML=`<footer><div class="wrap fg"><div><h4>${E(S.name)}</h4><p>${E(S.footer)}</p></div>
 <div><h4>حساباتي</h4><p>${E(O.name)}</p><p><a href="tel:${E(O.phone)}">${E(O.phone)}</a></p><p><a href="https://instagram.com/${E(O.instagram)}" target="_blank" rel="noopener">انستغرام: ${E(O.instagram)}</a></p></div>
 <div><h4>حسابات دفتري</h4>${A.map(a=>`<p><a href="${U(a.url)}" target="_blank" rel="noopener">${E(a.label)}</a></p>`).join('')||'<p>قريباً</p>'}</div>
 <div><h4>روابط</h4><p><a href="about.html">من نحن</a></p><p><a href="privacy.html">سياسة الخصوصية</a></p><p><a href="terms.html">الشروط والأحكام</a></p></div></div>
 <div class="wrap cp">${E(S.rights)}</div></footer>`;
 RV=(D.reviews||[]).filter(r=>r.show!==false);if(FBC()&&(PG=='index'||PG=='reviews')){try{RV=RV.concat(await fsRev())}catch(e){}}
 R[PG]&&R[PG]();initBoard();
 const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
 if(PG=='index')intro()}
function intro(){if(sessionStorage.getItem('i')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;sessionStorage.setItem('i',1);
 const d=document.createElement('div');d.id='intro';d.innerHTML=`<div class="scene"><div class="book"><div class="pg"><img src="assets/logo.svg" alt=""><h2>${E(S.name)}</h2><p>${E(S.tagline1)}</p></div><div class="cover"><img src="assets/logo.svg" alt=""></div></div></div><button id="skip">تخطي</button>`;
 document.body.append(d);document.body.style.overflow='hidden';const end=()=>{d.classList.add('done');document.body.style.overflow=''};setTimeout(end,3600);$('#skip').onclick=end}
function initBoard(){const cv=$('#cv');if(!cv)return;const x=cv.getContext('2d');let col='#0e7490',dr=0,lx,ly;
 const fit=()=>{const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;x.setTransform(d,0,0,d,0,0);x.lineCap=x.lineJoin='round';x.lineWidth=3};fit();
 const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 cv.onpointerdown=e=>{dr=1;[lx,ly]=pos(e);cv.setPointerCapture(e.pointerId)};
 cv.onpointermove=e=>{if(!dr)return;const[p,q]=pos(e);x.strokeStyle=col;x.beginPath();x.moveTo(lx,ly);x.lineTo(p,q);x.stroke();lx=p;ly=q};
 cv.onpointerup=cv.onpointercancel=()=>dr=0;
 document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;document.querySelectorAll('[data-c]').forEach(z=>z.classList.toggle('on',z==b))});
 $('#bc').onclick=()=>{x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.restore()}}
function fb(){const f=$('#fb');if(!f)return;const m=$('#fm');f.onsubmit=async e=>{e.preventDefault();const d=new FormData(f),g=D.github||{},c=FBC();if(d.get('web'))return;
 const r=+d.get('r')||0;if(!r){m.textContent='اختر التقييم بالنجوم أولاً';return}
 const nm=(d.get('n')||'').trim().slice(0,40),tx=(d.get('m')||'').trim().slice(0,600);
 if(c){let last=0;try{last=+localStorage.getItem('lr')||0}catch(_){}if(Date.now()-last<60000){m.textContent='استنى دقيقة قبل إرسال رأي جديد';return}
  try{const res=await fetch(`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/reviews?key=${c.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{name:{stringValue:nm},rating:{integerValue:String(r)},text:{stringValue:tx},approved:{booleanValue:false},createdAt:{timestampValue:new Date().toISOString()}}})});
   if(!res.ok)throw 0;try{localStorage.setItem('lr',Date.now())}catch(_){}f.reset();m.textContent='وصل رأيك، شكراً لك. بينشر في الموقع بعد المراجعة.'}catch(_){m.textContent='تعذر الإرسال، جرب مرة تانية'}return}
 const body=`التقييم: ${r} / 5\nالاسم: ${nm||'-'}\nالنوع: رأي\n\n${tx}`;
 open(`https://github.com/${g.owner}/${g.repo}/issues/new?labels=feedback&title=${encodeURIComponent('[رأي] رأي')}&body=${encodeURIComponent(body)}`,'_blank')}}
document.addEventListener('click',e=>{const i=e.target.closest('.shots img');if(i){$('#lb img').src=i.src;$('#lb').style.display='grid'}else if(e.target.closest('#lb'))$('#lb').style.display='none'});
