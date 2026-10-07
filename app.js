const Z={North:[5,1],Central:[5,5],East:[9,5],West:[1,5],South:[5,9]};
const NG=[{n:"Seva Sadan Trust",p:[2,3],cap:150,nv:0},{n:"Community Kitchen Hub",p:[8,3],cap:90,nv:1},{n:"Asha Shelter Home",p:[4,8],cap:60,nv:0},{n:"Bal Kalyan Anathalaya",p:[9,7],cap:120,nv:0},{n:"Night Shelter Collective",p:[5,5],cap:100,nv:1}];
let D=[{d:"Campus Mess",f:"Dal, rice",q:120,k:"Seva Sadan Trust",m:22,s:"Delivered"},{d:"City Caterers",f:"Veg pulao",q:60,k:"Asha Shelter Home",m:18,s:"Delivered"},{d:"Hotel Residency",f:"Chicken curry, roti",q:45,k:"Community Kitchen Hub",m:15,s:"Delivered"}];
const $=i=>document.getElementById(i),dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
$("zn").innerHTML=Object.keys(Z).map(z=>`<option>${z}</option>`).join("");
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("on",x==b));["t1","t2","t3"].forEach(t=>$(t).hidden=t!=b.dataset.t);draw()});
$("ex").onclick=()=>{$("dn").value="Hotel Residency";$("fd").value="Chicken curry and roti, buffet leftovers";$("pq").value=40;$("ch").value=1;$("zn").value="East"};
$("ex2").onclick=()=>{$("dn").value="Event Caterer";$("fd").value="Rice and dal from afternoon function";$("pq").value=50;$("ch").value=6;$("zn").value="West"};
const S=["Intake Agent","Safety Agent","Matching Agent","Dispatch Agent","Impact Agent"];
function resetSteps(){$("steps").innerHTML=S.map((s,i)=>`<div class="st" id="s${i}"><span class="dot">${i+1}</span><div><b>${s}</b><small id="m${i}">Waiting</small></div></div>`).join("");$("out").innerHTML=""}
resetSteps();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function step(i,txt,bad){await wait(700);const e=$("s"+i);e.classList.add("on");if(bad)e.classList.add("bad");$("m"+i).textContent=txt}
$("go").onclick=async()=>{
 const b=$("go");b.disabled=true;resetSteps();
 const d=$("dn").value||"Donor",f=$("fd").value,q=Math.max(1,+$("pq").value||1),h=+$("ch").value||0,z=$("zn").value;
 const nv=/chicken|mutton|egg|fish|non.?veg/i.test(f),wet=/rice|dal|curry|paneer|biryani|pulao|sabzi|raita|milk/i.test(f);
 const win=nv?3:wet?4:8,left=Math.max(0,win-h);
 await step(0,`${q} portions, ${nv?"non-veg":"veg"}, ${wet?"moist/perishable":"dry/packed"} food, pickup from ${z}`);
 if(left<=0){await step(1,`Cooked ${h}h ago exceeds safe window of ${win}h. Rejected for human consumption; routed to compost/biogas partner.`,1);b.disabled=false;$("out").innerHTML='<div class="msg">Donation not dispatched for safety. Suggested route: compost / biogas.</div>';return}
 await step(1,`Safe. About ${left.toFixed(1)}h of safe window left (limit ${win}h). Urgency: ${left<2?"HIGH":"normal"}.`);
 const sc=NG.filter(n=>n.cap>=q&&(!nv||n.nv)).map(n=>({...n,d:dist(n.p,Z[z]),s:100-dist(n.p,Z[z])*8+(n.cap-q)/10})).sort((a,b)=>b.s-a.s);
 if(!sc.length){await step(2,"No NGO has enough capacity or accepts this food type.",1);b.disabled=false;return}
 const t=sc[0],eta=Math.round(t.d*3+10);
 await step(2,`Ranked ${sc.length} NGOs. Best: ${t.n} (distance ${t.d.toFixed(1)} units, capacity ${t.cap}, score ${t.s.toFixed(0)}).`);
 const msg=`AnnaDoot alert: ${q} portions of ${nv?"non-veg":"veg"} food from ${d} ready for pickup (${z}). Safe for ${left.toFixed(1)} more hours. Reply YES to accept.`;
 await step(3,`WhatsApp + email sent to ${t.n}. Accepted. Volunteer ETA ${eta} min.`);
 $("out").innerHTML=`<div class="msg">${msg}</div>`;
 await step(4,`+${q} meals, ~${(q*.4).toFixed(0)} kg food saved, ~${(q*.4*2.5).toFixed(0)} kg CO2e avoided.`);
 D.push({d,f,q,k:t.n,m:eta,s:"Delivered"});b.disabled=false};
function draw(){const M=D.reduce((a,x)=>a+x.q,0),kg=M*.4;
 $("stats").innerHTML=[[M,"Meals saved"],[kg.toFixed(0),"Kg food diverted"],[(kg*2.5).toFixed(0),"Kg CO2e avoided"],[D.length,"Donations"],[Math.round(D.reduce((a,x)=>a+x.m,0)/D.length)+" min","Avg donation-to-pickup"]].map(s=>`<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");
 const by={};D.forEach(x=>by[x.k]=(by[x.k]||0)+x.q);const mx=Math.max(...Object.values(by));
 $("bars").innerHTML=Object.entries(by).map(([k,v])=>`<small>${k} - ${v} meals</small><div class="bar" style="width:${v/mx*100}%"></div>`).join("");
 $("log").innerHTML="<table><tr><th>Donor</th><th>Food</th><th>Qty</th><th>NGO</th><th>Pickup</th></tr>"+D.slice().reverse().map(x=>`<tr><td>${x.d}</td><td>${x.f}</td><td>${x.q}</td><td>${x.k}</td><td><span class="pill">${x.m} min</span></td></tr>`).join("")+"</table>";
 $("ngos").innerHTML=NG.map(n=>`<p><b>${n.n}</b><br><small>Capacity ${n.cap} portions/day - ${n.nv?"accepts veg and non-veg":"veg only"}</small></p>`).join("");
 $("map").innerHTML=NG.map(n=>`<span class="pin" style="left:${n.p[0]*10}%;top:${n.p[1]*10}%">${n.n.split(" ")[0]}</span>`).join("")+Object.entries(Z).map(([k,v])=>`<span class="pin d" style="left:${v[0]*10}%;top:${v[1]*10}%">${k}</span>`).join("")}
draw();
