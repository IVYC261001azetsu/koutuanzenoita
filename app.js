const $=s=>document.querySelector(s);
const areas=[
{name:"大分市周辺",region:"中部",lat:33.2382,lng:131.6126,risk:"高",causes:["高齢者","交差点","夜間"],note:"市街地の交差点・横断箇所では歩行者や自転車に注意。"},
{name:"別府市周辺",region:"中部",lat:33.2795,lng:131.4970,risk:"高",causes:["交差点","速度","夜間"],note:"市街地・観光地周辺。交差点進入前の減速を意識。"},
{name:"杵築市周辺",region:"北部",lat:33.4195,lng:131.6160,risk:"注意",causes:["死角","高齢者"],note:"生活道路や見通しの悪い交差点を現地確認したいエリア。"},
{name:"中津市周辺",region:"北部",lat:33.5980,lng:131.1880,risk:"注意",causes:["交差点","速度"],note:"幹線道路と市街地の交差部で安全確認を。"},
{name:"日田市周辺",region:"西部",lat:33.3213,lng:130.9409,risk:"注意",causes:["速度","高齢者"],note:"郊外・山間部を含む。道路状況に応じた速度管理を。"},
{name:"佐伯市周辺",region:"南部",lat:32.9590,lng:131.8990,risk:"注意",causes:["高齢者","死角","夜間"],note:"生活道路・地域の移動経路で歩行者の見落としに注意。"}
];
let mainMap,miniMap,mainMarkers=[];
function mapIcon(r){let c=r==="高"?"#d94b45":"#df8b3d";return L.divIcon({className:"",html:`<div style="width:25px;height:25px;background:${c};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 7px #0003"></div>`,iconSize:[25,25],iconAnchor:[12,25]})}
function initMap(id,z){
 let m=L.map(id,{scrollWheelZoom:false,zoomControl:true}).setView([33.35,131.45],z);
 // 日本語地名が表示される国土地理院の淡色地図を使用
 L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",{
  attribution:'地図：<a href="https://maps.gsi.go.jp/development/ichiran.html#pale">国土地理院・淡色地図</a>',
  maxZoom:18,
  errorTileUrl:""
 }).addTo(m);
 return m;
}
function placeMarkers(m,list){return list.map(a=>{let x=L.marker([a.lat,a.lng],{icon:mapIcon(a.risk)}).addTo(m);x.bindPopup(`<b>${a.name}</b><br><small>${a.region}・地域位置のデモ表示</small><p>${a.note}</p><b>参考表示：${a.risk}</b><br><small>実際の事故地点・公式危険判定ではありません</small>`);return x})}
function renderCards(list){$("#resultCount").textContent=list.length+"エリア";$("#areaCards").innerHTML=list.map(a=>`<div class="area-card"><h4>${a.name}</h4><p>${a.note}</p><span class="risk-pill ${a.risk==="高"?"high":"mid"}">${a.risk}</span> <button data-focus="${a.name}">地図で見る</button></div>`).join("")||"<p>該当エリアはありません。</p>";document.querySelectorAll("[data-focus]").forEach(b=>b.onclick=()=>{let a=areas.find(v=>v.name===b.dataset.focus);showView("map");mainMap.setView([a.lat,a.lng],13);mainMarkers[areas.indexOf(a)].openPopup()})}
function filter(){let r=$("#areaFilter").value,k=$("#riskFilter").value,c=$("#causeFilter").value;let out=areas.filter(a=>(r==="all"||a.region===r)&&(k==="all"||a.risk===k)&&(c==="all"||a.causes.includes(c)));mainMarkers.forEach((m,i)=>out.includes(areas[i])?m.addTo(mainMap):mainMap.removeLayer(m));renderCards(out)}
function showView(v){document.querySelectorAll(".page-view").forEach(x=>x.classList.toggle("active",x.id==="view-"+v));document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.view===v));$(".main-nav").classList.remove("open");setTimeout(()=>{if(v==="map"&&mainMap)mainMap.invalidateSize();if(v==="home"&&miniMap)miniMap.invalidateSize()},100);window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showView(b.dataset.go));$("#menuToggle").onclick=()=>$(".main-nav").classList.toggle("open");["areaFilter","riskFilter","causeFilter"].forEach(id=>$("#"+id).onchange=filter);
$("#resetFilters").onclick=()=>{ $("#areaFilter").value="all"; $("#riskFilter").value="all"; $("#causeFilter").value="all"; filter(); };
if(window.L){mainMap=initMap("mainMap",8);mainMarkers=placeMarkers(mainMap,areas);miniMap=initMap("miniMap",7);placeMarkers(miniMap,areas);renderCards(areas)}else{$("#mainMap").textContent="地図を読み込めません。ネット接続を確認してください。"}
if(window.Chart){Chart.defaults.font.family="'Noto Sans JP',sans-serif";Chart.defaults.color="#687982";
new Chart($("#yearChart"),{type:"bar",data:{labels:["令和6年","令和7年"],datasets:[{label:"事故件数",data:[2125,1993],backgroundColor:"#8ab7a5",yAxisID:"y"},{label:"死者数",data:[28,41],backgroundColor:"#d96a5e",yAxisID:"y1"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom"}},scales:{y:{beginAtZero:true},y1:{beginAtZero:true,position:"right",grid:{drawOnChartArea:false}}}}});
new Chart($("#deathTimeChart"),{type:"bar",data:{labels:["4-6","6-8","8-10","10-12","12-14","14-16","16-18","18-20","20-22","22-24","0-4"],datasets:[{label:"死者数（人）",data:[7,3,8,2,3,5,4,2,2,3,2],backgroundColor:"#d96a5e",borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}});
new Chart($("#dayNightChart"),{type:"bar",data:{labels:["昼間","夜間"],datasets:[{label:"事故件数",data:[1534,459],backgroundColor:["#8ab7a5","#e2a45d"],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
new Chart($("#causeChart"),{type:"bar",data:{labels:["前方不注意","安全不確認","動静不注視","交差点安全進行","徐行・一時不停止","安全速度違反"],datasets:[{label:"件数",data:[589,522,210,162,52,13],backgroundColor:"#7ba994",borderRadius:5}]},options:{indexAxis:"y",responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{beginAtZero:true}}}});
}
