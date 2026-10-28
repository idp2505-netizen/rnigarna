const $=s=>document.querySelector(s),page=document.body.dataset.page;
const L=[["index.html","Головна"],["gallery.html","Галерея"],["contacts.html","Контакти"]];
document.body.insertAdjacentHTML("afterbegin",`<header><div class="wrap"><a class="logo" href="index.html">Аркуш<small>Книгарня · Канцелярія</small></a><nav>${L.map(l=>`<a href="${l[0]}" class="${l[0]==page?'on':''}">${l[1]}</a>`).join("")}</nav><a class="btn s" href="index.html#catalog">Замовити ↗</a></div></header>`);
document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap"><div><div class="logo">Аркуш</div><p style="margin-top:14px">Незалежна книгарня та крамниця канцелярії. Обираємо книжки руками й загортаємо подарунки в крафт.</p></div><div><h5>НАВІГАЦІЯ</h5><ul>${L.map(l=>`<li><a href="${l[0]}">${l[1]}</a></li>`).join("")}</ul></div><div><h5>КРАМНИЦЯ</h5><p>вул. Рейтарська, 12, Київ, 01034<br>+380 44 123 45 67<br>hello@arkush.kyiv.ua</p></div></div></footer><div class="toast" id="toast"></div>`);
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
const fmt=n=>n.toLocaleString("uk-UA")+" ₴";
if($("#grid")){
let cat="Усі";const cv=p=>p.img?`<div class="cover pic"><img src="${p.img}" alt="${p.t} — ${p.a}" loading="lazy"></div>`:`<div class="cover c${p.c=="Книги"?p.id%3:3}"><small>${p.c}</small><h3>${p.t}</h3><i>${p.a}</i></div>`;
function render(){
const q=$("#q").value.trim().toLowerCase(),s=$("#sort").value;
let a=PRODUCTS.filter(p=>(cat=="Усі"||p.c==cat)&&(p.t+" "+p.a).toLowerCase().includes(q));
({pa:()=>a.sort((x,y)=>x.p-y.p),pd:()=>a.sort((x,y)=>y.p-x.p),az:()=>a.sort((x,y)=>x.t.localeCompare(y.t,"uk")),new:()=>a.sort((x,y)=>y.y-x.y||y.id-x.id),rate:()=>a.sort((x,y)=>y.r-x.r),def:()=>0})[s]();
$("#grid").innerHTML=a.map(p=>`<div class="card" data-id="${p.id}">${p.b?`<span class="badge">${p.b}</span>`:""}${cv(p)}<div class="cm"><h4>${p.t}</h4></div><div class="cm"><small>${p.a}</small><span class="price">${p.old?`<s>${p.old}</s>`:""}${fmt(p.p)}</span></div></div>`).join("");
$("#empty").style.display=a.length?"none":"block";$("#count").textContent=`Знайдено: ${a.length} з ${PRODUCTS.length}`}
$("#chips").onclick=e=>{if(!e.target.dataset.c)return;cat=e.target.dataset.c;document.querySelectorAll("#chips .chip").forEach(c=>c.classList.toggle("on",c==e.target));render()};
$("#q").oninput=$("#sort").onchange=render;
$("#grid").onclick=e=>{const c=e.target.closest(".card");if(!c)return;const p=PRODUCTS.find(x=>x.id==c.dataset.id);
$("#mc").innerHTML=cv(p);$("#mb").innerHTML=`<span class="eyebrow">${p.c}</span><h2>${p.t}</h2><b>${p.a}</b><p>${p.d}</p><p>★ ${p.r} · ${p.y} р.</p><h3 class="serif" style="font-size:36px;margin-bottom:18px">${p.old?`<s style="font-size:22px;color:#999">${p.old}</s> `:""}${fmt(p.p)}</h3><button class="btn d" id="res">Забронювати на 3 дні</button>`;
$("#modal").classList.add("open2");$("#res").onclick=()=>{const r=JSON.parse(localStorage.getItem("reserved")||"[]");r.push({id:p.id,t:p.t,time:new Date().toISOString()});localStorage.setItem("reserved",JSON.stringify(r));$("#modal").classList.remove("open2");toast(`«${p.t}» заброньовано`)}};
$("#modal").onclick=e=>{if(e.target.id=="modal"||e.target.classList.contains("x"))$("#modal").classList.remove("open2")};
render()}
if($("#gal")){let f="Усі",cur=0,list=[];
const draw=()=>{list=GALLERY.filter(g=>f=="Усі"||g.c==f);$("#gal").innerHTML=list.map((g,i)=>`<div class="gi" data-i="${i}"><div class="im"><span class="badge">${g.c}</span><img src="${g.img}" alt="${g.t}" loading="lazy"></div><h3>${g.t}<small>0${i+1}</small></h3><p>${g.d}</p></div>`).join("")};
const show=()=>{const g=list[cur];$("#lbi").src=g.img;$("#lbt").textContent=g.t+" — "+g.d};
$("#chips").onclick=e=>{if(!e.target.dataset.c)return;f=e.target.dataset.c;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c==e.target));draw()};
$("#gal").onclick=e=>{const c=e.target.closest(".gi");if(!c)return;cur=+c.dataset.i;show();$("#lb").classList.add("open2")};
const step=d=>{cur=(cur+d+list.length)%list.length;show()};
$("#prev").onclick=()=>step(-1);$("#next").onclick=()=>step(1);
$("#lb").onclick=e=>{if(e.target.id=="lb"||e.target.classList.contains("x"))$("#lb").classList.remove("open2")};
document.onkeydown=e=>{if(!$("#lb").classList.contains("open2"))return;if(e.key=="Escape")$("#lb").classList.remove("open2");if(e.key=="ArrowLeft")step(-1);if(e.key=="ArrowRight")step(1)};draw()}
if($("#form")){const m=$("#msg");m.oninput=()=>$("#cnt").textContent=m.value.length+" / 600";
$("#form").onsubmit=e=>{e.preventDefault();let ok=true;const n=$("#name"),em=$("#email");
const chk=(el,good,txt)=>{el.nextElementSibling.textContent=good?"":txt;if(!good)ok=false};
chk(n,n.value.trim().length>=2,"Введіть ім'я (мінімум 2 символи)");chk(em,/^\S+@\S+\.\S+$/.test(em.value),"Введіть коректний email");chk(m,m.value.trim().length>=5,"Напишіть повідомлення");
if(!ok)return;const a=JSON.parse(localStorage.getItem("messages")||"[]");a.push({name:n.value,email:em.value,text:m.value,time:new Date().toISOString()});localStorage.setItem("messages",JSON.stringify(a));
e.target.reset();$("#cnt").textContent="0 / 600";toast("Дякуємо! Повідомлення надіслано.")}}
