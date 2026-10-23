
document.addEventListener('DOMContentLoaded',async()=>{
 const loginForm=document.getElementById('loginForm');
 if(loginForm){ loginForm.onsubmit=async(e)=>{e.preventDefault(); const email=document.getElementById('email').value.trim(); const pass=document.getElementById('password').value;
   if(email==='admin@cafesierra.com'&&pass==='demo123'){ localStorage.setItem('sierra_admin','demo'); location.href='admin-dashboard.html'; return;}
   try{ const {error}=await sb.auth.signInWithPassword({email,password:pass}); if(error) throw error; location.href='admin-dashboard.html'; }catch(err){ document.getElementById('loginMsg').textContent='Login failed: '+err.message+' (Demo: admin@cafesierra.com / demo123)'; } }; }
 if(document.getElementById('stats')){
   if(!localStorage.getItem('sierra_admin')){ try{ const {data}=await sb.auth.getSession(); if(!data.session){ /* allow demo view but warn */ document.getElementById('demoNote').style.display='block'; } }catch(e){} }
   let items=[]; try{ const {data}=await sb.from('menu_items').select('*').order('id'); if(data) items=data; }catch(e){}
   document.getElementById('statMenu').textContent=items.length||'20';
   try{ const m=await sb.from('messages').select('*',{count:'exact'}); document.getElementById('statMsg').textContent=m.count??0; const o=await sb.from('orders').select('*',{count:'exact'}); document.getElementById('statOrders').textContent=o.count??0; }catch(e){document.getElementById('statMsg').textContent='0';document.getElementById('statOrders').textContent='0';}
   const tbody=document.getElementById('menuTable'); if(tbody) tbody.innerHTML=items.map(x=>`<tr><td>${x.name}</td><td>${x.category}</td><td>Rs ${x.price}</td><td>${x.is_available?'Available':'Hidden'}</td><td><button onclick="delItem(${x.id})">Delete</button></td></tr>`).join('');
   const mf=document.getElementById('addForm'); if(mf) mf.onsubmit=async(e)=>{e.preventDefault(); const fd=new FormData(mf); const payload={name:fd.get('name'),category:fd.get('category'),price:parseFloat(fd.get('price')),description:fd.get('description'),image_url:fd.get('image_url'),is_available:true}; const {error}=await sb.from('menu_items').insert(payload); alert(error?'Error: '+error.message+' (RLS: login via Supabase Auth for full access)':'Item added!'); location.reload(); };
 }
});
async function delItem(id){ if(!confirm('Delete this item?'))return; const {error}=await sb.from('menu_items').delete().eq('id',id); alert(error?'Error: '+error.message:'Deleted'); location.reload(); }
async function logout(){ try{await sb.auth.signOut()}catch(e){} localStorage.removeItem('sierra_admin'); location.href='admin-login.html'; }
