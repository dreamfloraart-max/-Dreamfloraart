const defaultProducts = [
  {id:"1",name:"Moonlit Lagoon",category:"original",price:250,size:"",description:"A dreamy moonlit fantasy lagoon.",featured:true,image:"",emoji:"🌙"},
  {id:"2",name:"The Royal Library",category:"original",price:220,size:"",description:"An enchanted library filled with vines and stories.",featured:true,image:"",emoji:"📚"},
  {id:"3",name:"Dragon's Keep",category:"original",price:280,size:"",description:"A moonlit royal castle guarded by dragons.",featured:true,image:"",emoji:"🐉"},
  {id:"4",name:"The Garden Café",category:"original",price:195,size:"",description:"A magical garden café in full bloom.",featured:true,image:"",emoji:"🌿"}
];
let products = JSON.parse(localStorage.getItem("dfa_products") || "null") || defaultProducts;
let currentCategory="all";
let cart = JSON.parse(localStorage.getItem("dfa_cart") || "[]");

function money(v){
  try{
    const c=(navigator.language||"en-GB").toLowerCase();
    const map={it:"EUR",de:"EUR",fr:"EUR",es:"EUR",pt:"EUR",nl:"EUR",en:"GBP",us:"USD"};
    let currency="EUR";
    if(c.startsWith("en-us")) currency="USD";
    else if(c.startsWith("en-gb")) currency="GBP";
    else if(c.startsWith("en-ca")) currency="CAD";
    return new Intl.NumberFormat(navigator.language,{style:"currency",currency}).format(v);
  }catch(e){return "€"+Number(v).toFixed(2)}
}
function save(){localStorage.setItem("dfa_products",JSON.stringify(products))}
function card(p){
  const image=p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}">` : `<div class="art-placeholder">${p.emoji||"✿"}</div>`;
  return `<article class="product-card">
    <div class="product-image">${image}</div>
    <div class="product-info">
      <h3>${escapeHtml(p.name)}</h3>
      <p>${p.category==="original"?"Original Painting":"Art Print"}${p.size?" · "+escapeHtml(p.size):""}</p>
      <p class="product-price">${money(p.price)}</p>
      <div class="product-actions">
        <button class="mini-btn primary" onclick="addToCart('${p.id}')">Add to Bag</button>
        <button class="mini-btn" onclick="viewProduct('${p.id}')">View</button>
      </div>
    </div>
  </article>`;
}
function renderProducts(){
  const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
  const filtered=products.filter(p=>(currentCategory==="all"||p.category===currentCategory)&&p.name.toLowerCase().includes(q));
  document.getElementById("shopProducts").innerHTML=filtered.length?filtered.map(card).join(""):`<p style="grid-column:1/-1;text-align:center">No artworks found.</p>`;
  const featured=products.filter(p=>p.featured).slice(0,4);
  document.getElementById("featuredProducts").innerHTML=featured.map(card).join("");
}
function setCategory(c,el){
  currentCategory=c;
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  if(el)el.classList.add("active");
  renderProducts();
  document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});
}
function addToCart(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  cart.push({id:p.id,name:p.name,price:p.price,image:p.image,emoji:p.emoji});
  localStorage.setItem("dfa_cart",JSON.stringify(cart)); updateCartCount(); openCart();
}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.length}
function openCart(){
  const modal=document.getElementById("cartModal"); modal.classList.add("open");
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML="<p>Your bag is waiting for a little magic. ✦</p>";document.getElementById("cartTotal").textContent=money(0);return}
  box.innerHTML=cart.map((p,i)=>`<div class="cart-row"><div>${p.image?`<img src="${p.image}" alt="">`:`<div style="font-size:30px">${p.emoji||"✿"}</div>`}</div><div><strong>${escapeHtml(p.name)}</strong><br><small>${money(p.price)}</small></div><button class="mini-btn" onclick="removeCart(${i})">Remove</button></div>`).join("");
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,p)=>s+Number(p.price),0));
}
function closeCart(){document.getElementById("cartModal").classList.remove("open")}
function removeCart(i){cart.splice(i,1);localStorage.setItem("dfa_cart",JSON.stringify(cart));updateCartCount();openCart()}
function viewProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  alert(`${p.name}\n\n${p.description||""}\n\nPrice: ${money(p.price)}\n\nA full product page and secure checkout will be connected in the backend phase.`);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
renderProducts();updateCartCount();
