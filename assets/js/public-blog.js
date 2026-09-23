(async()=>{"use strict";
const db=window.filings4uPublicSupabase,$=s=>document.querySelector(s);
let posts=[];
const staticSlugs=new Set(["how-to-form-an-llc-filing-compliance-roadmap", "ein-basics-federal-tax-id-business", "annual-reports-good-standing-compliance-calendar", "starting-interstate-trucking-usdot-authority-boc3-ucr-roadmap", "new-entrant-audit-readiness-safety-record"]);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const date=v=>v?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(v)):"";
const urlFor=x=>staticSlugs.has(x.slug)?`blog/${encodeURIComponent(x.slug)}.html`:`blog.html?slug=${encodeURIComponent(x.slug)}`;
const r=await db.from("filings4u_blog").select("*").eq("status","published").order("published_at",{ascending:false});
if(r.error){$("#blogGrid").innerHTML='<div class="content-loading">Articles could not be loaded.</div>';return}
posts=r.data||[];
const cats=[...new Set(posts.map(x=>x.category).filter(Boolean))].sort();
$("#blogCategory").innerHTML='<option value="">All categories</option>'+cats.map(x=>`<option>${esc(x)}</option>`).join("");
function render(){
 const q=$("#blogSearch").value.toLowerCase(),cat=$("#blogCategory").value;
 const a=posts.filter(x=>(!cat||x.category===cat)&&(!q||[x.title,x.excerpt,x.category].join(" ").toLowerCase().includes(q)));
 $("#blogGrid").innerHTML=a.length?a.map(x=>`<a class="blog-card" href="${urlFor(x)}"><img src="${esc(x.featured_image_url||"images/llc-formation-hero.jpg")}" alt="${esc(x.title)}"><div class="blog-card__body"><div class="blog-card__meta"><span>${esc(x.category||"Insights")}</span><span>${date(x.published_at)}</span></div><h2>${esc(x.title)}</h2><p>${esc(x.excerpt||"")}</p><b>Read article →</b></div></a>`).join(""):'<div class="content-loading">No articles found.</div>';
}
function open(slug){
 const x=posts.find(p=>p.slug===slug);if(!x)return;
 if(staticSlugs.has(slug)){location.replace(urlFor(x));return}
 $("#articleHero").innerHTML=`<header class="article-header"><img src="${esc(x.featured_image_url||"")}" alt="${esc(x.title)}"><div class="article-header__copy"><span>${esc(x.category||"Insights")}</span><h1>${esc(x.title)}</h1><p>${esc(x.excerpt||"")}</p></div></header>`;
 $("#articleBody").innerHTML=x.content||"";
 document.querySelector(".content-hero").hidden=true;document.querySelector(".content-section").hidden=true;$("#articleView").hidden=false;
 history.replaceState({slug},"",`blog.html?slug=${encodeURIComponent(slug)}`);
 document.title=`${x.title} | filings4u`;
 const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=x.excerpt||"";
 scrollTo({top:0,behavior:"smooth"});
}
$("#backToBlog").onclick=()=>location.href="blog.html";
$("#blogSearch").oninput=render;$("#blogCategory").onchange=render;render();
const slug=new URLSearchParams(location.search).get("slug");if(slug)open(slug);
})();