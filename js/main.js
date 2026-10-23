
const FALLBACK=[
{n:"Sierra Signature Latte",c:"Coffee",p:650,d:"Double espresso & velvety steamed milk",i:"https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80"},
{n:"Cappuccino Classic",c:"Coffee",p:600,d:"Rich espresso, thick foam, cocoa dust",i:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80"},
{n:"Mint Margarita",c:"Beverages",p:345,d:"Foodpanda favourite — mint, lemon, soda",i:"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80"},
{n:"Fettuccine Alfredo Pasta",c:"Pasta",p:1395,d:"Creamy Alfredo, grilled chicken, parmesan",i:"https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80"},
{n:"Tarragon Chicken Steak",c:"Mains",p:1425,d:"Most-reviewed! Tarragon sauce & mashed potato",i:"https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80"},
{n:"Chicken Tikka Pizza",c:"Pizza",p:1295,d:"Wood-fired desi tikka pizza",i:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"},
{n:"New York Cheesecake",c:"Desserts",p:650,d:"Baked cheesecake, berry compote",i:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80"},
{n:"Full English Breakfast",c:"Breakfast",p:1195,d:"Eggs, sausages, toast, beans",i:"https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80"}];
async function loadMenu(cat='All'){
 const el=document.getElementById('menuGrid'); if(!el) return; el.innerHTML='<p style="text-align:center">☕ Loading fresh menu...</p>';
 let items=FALLBACK;
 try{ if(sb){ const {data,error}=await sb.from('menu_items').select('*').eq('is_available',true).order('id'); if(!error&&data&&data.length) items=data.map(x=>({n:x.name,c:x.category,p:x.price,d:x.description,i:x.image_url})); } }catch(e){}
 const f=cat==='All'?items:items.filter(x=>x.c===cat);
 el.innerHTML=f.map(x=>`<article class="card"><img src="${x.i}" alt="${x.n}" loading="lazy"><div><h3>${x.n}</h3><p>${x.d||''}</p><p class="price">Rs. ${x.p}</p><a class="btn" target="_blank" href="https://wa.me/923215096969?text=${encodeURIComponent('Assalam-o-Alaikum Cafe Sierra! I want to order: '+x.n+' (Rs '+x.p+')')}">Order on WhatsApp</a></div></article>`).join('')||'<p>No items in this category yet.</p>';
}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');loadMenu(b.dataset.cat)});
 if(document.getElementById('menuGrid')) loadMenu();
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12}); document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
 const form=document.getElementById('contactForm'); if(form) form.onsubmit=async(e)=>{e.preventDefault(); const fd=new FormData(form); const payload={name:fd.get('name'),phone:fd.get('phone'),message:fd.get('message')}; try{ if(sb) await sb.from('messages').insert(payload);}catch(err){} alert('Shukriya! Your message has been received. Cafe Sierra will contact you soon.'); form.reset();};
});
