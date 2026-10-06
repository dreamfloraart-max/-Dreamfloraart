const defaultProducts = [
  {id:"1",name:"Moonlit Lagoon",category:"original",price:250,size:"",description:"A dreamy moonlit fantasy lagoon.",featured:true,image:"",emoji:"🌙"},
  {id:"2",name:"The Royal Library",category:"original",price:220,size:"",description:"An enchanted library filled with vines and stories.",featured:true,image:"",emoji:"📚"},
  {id:"3",name:"Dragon's Keep",category:"original",price:280,size:"",description:"A moonlit royal castle guarded by dragons.",featured:true,image:"",emoji:"🐉"},
  {id:"4",name:"The Garden Café",category:"original",price:195,size:"",description:"A magical garden café in full bloom.",featured:true,image:"",emoji:"🌿"}
];
let products=JSON.parse(localStorage.getItem("dfa_products")||"null")||defaultProducts;
let settings=JSON.parse(localStorage.getItem("dfa_settings")||"{}");
const $=id=>document.getElementById(id);

function saveProducts(){localStorage.setItem("dfa_products",JSON.stringify(products));renderList()}
function renderList(){
  $("productCount").textContent=`${products.length} artwork${products.length===1?"":"s"}`;
  $("adminProducts").innerHTML=products.map(p=>`<div class="admin-product">
    ${p.image?`<img src="${p.image}" alt="">`:`<div class="admin-image-preview" style="height:70px">${p.emoji||"✿"}</div>`}
    <div><h3>${escapeHtml(p.name)}</h3><p>${p.category==="original"?"Original":"Print"} · €${Number(p.price).toFixed(2)}${p.size?" · "+p.size:""}</p></div>
    <div class="admin-product-actions"><button onclick="editProduct('${p.id}')">Edit</button><button onclick="deleteProduct('${p.id}')">Delete</button></div>
  </div>`).join("");
}
$("imageFile").addEventListener("change",e=>{
  const file=e.target.files[0]; if(!file)return;
  const r=new FileReader();r.onload=()=>{$("imagePreview").innerHTML=`<img src="${r.result}" alt="">`;};r.readAsDataURL(file);
});
$("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const editId=$("editId").value;
  const old=products.find(p=>p.id===editId);
  const file=$("imageFile").files[0];
  const saveProduct=(image)=>{
    const p={id:editId||Date.now().toString(),name:$("name").value.trim(),category:$("category").value,price:Number($("price").value),size:$("size").value,description:$("description").value.trim(),featured:$("featured").checked,image:image||old?.image||"",emoji:old?.emoji||"✿"};
    if(editId){products=products.map(x=>x.id===editId?p:x)}else products.push(p);
    saveProducts();resetForm();
  };
  if(file){const r=new FileReader();r.onload=()=>saveProduct(r.result);r.readAsDataURL(file)}else saveProduct("");
});
function editProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  $("editId").value=p.id;$("name").value=p.name;$("category").value=p.category;$("price").value=p.price;$("size").value=p.size||"";$("description").value=p.description||"";$("featured").checked=!!p.featured;$("formTitle").textContent="Edit Artwork";
  $("imagePreview").innerHTML=p.image?`<img src="${p.image}" alt="">`:`${p.emoji||"✿"} Current image`;
  window.scrollTo({top:0,behavior:"smooth"});
}
function deleteProduct(id){if(confirm("Delete this artwork?")){products=products.filter(p=>p.id!==id);saveProducts()}}
function resetForm(){$("productForm").reset();$("editId").value="";$("formTitle").textContent="Add Artwork";$("imagePreview").textContent="Image preview"}
function saveSettings(){
  settings={email:$("settingEmail").value,whatsapp:$("settingWhatsapp").value,instagram:$("settingInstagram").value,tiktok:$("settingTiktok").value,youtube:$("settingYoutube").value,pinterest:$("settingPinterest").value};
  localStorage.setItem("dfa_settings",JSON.stringify(settings));alert("Settings saved on this browser.");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function loadSettings(){if(!settings)return;$("settingEmail").value=settings.email||"";$("settingWhatsapp").value=settings.whatsapp||"";$("settingInstagram").value=settings.instagram||"";$("settingTiktok").value=settings.tiktok||"";$("settingYoutube").value=settings.youtube||"";$("settingPinterest").value=settings.pinterest||""}
renderList();loadSettings();
