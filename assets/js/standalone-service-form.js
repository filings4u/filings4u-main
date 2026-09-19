(() => {
  "use strict";
  const config=window.FILINGS4U_STANDALONE_SERVICE||{};
  const registry=window.FILINGS4U_SERVICE_REGISTRY||{};
  const root=document.getElementById("standaloneServiceMount");
  const serviceKey=document.body.dataset.serviceKey||"";
  const service=registry[serviceKey];
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]||c));
  if(!root||!service){if(root)root.innerHTML='<div class="form-alert form-alert--warn">This service form is not configured.</div>';return;}

  const field=(name,label,type="text",required=false,extra="")=>({name,label,type,required,extra});
  const commonContact=[
    field("full_name","Contact full name","text",true),field("email","Email address","email",true),
    field("phone","Phone number","tel",true),field("contact_title","Title / role")
  ];
  const business=[
    field("business_legal_name","Legal business / entity name","text",true),field("dba_name","DBA / trade name"),
    field("entity_type","Entity type","select",false,["LLC","Corporation","Partnership","Sole proprietor","Nonprofit","Other"]),
    field("formation_state","Formation / home state"),field("ein","EIN / federal tax ID"),field("business_address","Principal business address","textarea")
  ];
  const acknowledgement=[field("additional_notes","Additional instructions or details","textarea"),field("acknowledgement","I confirm the information provided is accurate and I am authorized to submit it for this service.","checkbox",true)];

  const categorySchemas={
    "Business Formation":[
      ["Business to form",[field("proposed_name","Proposed business name","text",true),field("alternate_name","Alternate business name"),field("formation_state","Formation state","text",true),field("business_purpose","Business purpose","textarea",true),field("requested_effective_date","Requested effective date","date")]],
      ["Ownership & management",[field("owners_managers","Owners, members, directors, or managers","textarea",true),field("management_structure","Management structure / roles","textarea"),field("registered_agent_plan","Registered agent plan","select",false,["Use Filings4u / arranged service","I will provide a registered agent","Not sure"])]],
      ["Contact",commonContact]
    ],
    "Compliance":[
      ["Business record",business],["Filing request",[field("jurisdiction","State / jurisdiction involved","text",true),field("entity_file_number","State entity / file number"),field("current_status","Current status or standing"),field("filing_period","Filing year / period"),field("deadline","Known deadline","date"),field("requested_action","What do you need Filings4u to complete?","textarea",true)]],["Contact",commonContact]
    ],
    "DOT & Fleet":[
      ["Company & authority",business.concat([field("usdot_number","USDOT number"),field("mc_ff_mx_number","MC / FF / MX number"),field("fmcsa_status","Current FMCSA / authority status"),field("fleet_size","Number of vehicles / power units","number")])],
      ["Service request",[field("operating_states","Operating states / jurisdictions"),field("request_summary","Describe what you need completed or corrected","textarea",true),field("known_deadline","Known deadline","date"),field("prior_filing_reference","Prior filing / confirmation / reference number")]],
      ["Contact",commonContact]
    ],
    "Tax & Regulatory":[
      ["Taxpayer / business",business],["Filing details",[field("tax_jurisdiction","Tax agency / state / jurisdiction","text",true),field("tax_period","Tax year / quarter / period","text",true),field("notice_number","Notice / account / reference number"),field("filing_status","Current filing status"),field("deadline","Due date / response deadline","date"),field("request_summary","Describe the filing or regulatory work needed","textarea",true)]],["Contact",commonContact]
    ],
    "Registrations & Certifications":[
      ["Applicant business",business],["Registration / certification",[field("agency_program","Agency or certification program"),field("existing_number","Existing registration / certification number"),field("ownership_structure","Ownership structure and percentages","textarea"),field("business_activity","Primary business activity","textarea"),field("request_summary","Describe the registration/certification request","textarea",true),field("deadline","Known deadline","date")]],["Contact",commonContact]
    ],
    "Specialty Services":[
      ["Customer & business",business],["Service details",[field("request_summary","Describe what you need Filings4u to create or complete","textarea",true),field("existing_assets_links","Existing files, references, or links","textarea"),field("deadline","Requested deadline","date")]],["Contact",commonContact]
    ]
  };

  const special={
    "web-design-packages":[
      ["Business & website goals",[field("business_name","Business name","text",true),field("client_name","Client name","text",true),field("email_address","Email","email",true),field("phone_number","Phone","tel",true),field("current_url","Current website","url"),field("website_type","Website type","select",true,["Business website","E-commerce","Landing page","Portfolio","Booking / service site","Membership / client portal","Other"]),field("estimated_page_count","Estimated page count","select",true,["1-3","4-6","7-10","11-20","20+"]),field("main_goal","Primary website goal","textarea",true),field("target_audience","Target audience","textarea",true),field("products_services","Products or services to feature","textarea")]],
      ["Pages & functionality",[field("required_features","Required features","textarea",true),field("architectural_notes","Pages / site architecture","textarea")]],
      ["Brand & visual direction",[field("branding_status","Branding status","select",true,["Complete","Partial","Need branding"]),field("style_preference","Design style","select",true,["Modern","Corporate","Minimal","Luxury","Bold","Editorial","Other"]),field("aesthetic_tone","Aesthetic tone","text",true),field("brand_color_notes","Brand colors / colors to avoid"),field("design_inspiration_links","Websites you like","textarea"),field("design_avoid_notes","Styles or websites to avoid","textarea")]],
      ["Content",[field("asset_copy_status","Copy/content status","select",true,["Ready","Partial","Need help"]),field("logo_status","Logo status","select",true,["Ready","In progress","Need a logo"]),field("brand_assets_links","Links to logo, brand assets, samples, or shared files","textarea"),field("additional_notes","Additional notes","textarea")]]
    ],
    "logo-design-packages":[
      ["Brand basics",[field("business_name","Business name","text",true),field("client_name","Client name","text",true),field("email_address","Email","email",true),field("phone_number","Phone","tel",true),field("industry","Industry / business type"),field("logo_text","Exact logo text","text",true),field("logo_tagline","Tagline / slogan"),field("business_description","What does your business do?","textarea"),field("target_audience","Who is your target audience?","textarea")]],
      ["Creative direction",[field("logo_style","Logo style","select",true,["Modern","Classic","Minimal","Bold","Luxury","Playful","Emblem / badge","Wordmark"]),field("brand_mood","Brand mood / personality","text",true),field("brand_colors","Preferred brand colors","text",true),field("typography_preference","Typography preference"),field("logo_description","Describe the logo you envision","textarea",true),field("competitor_inspiration_links","Competitors / inspiration links","textarea"),field("avoid_notes","Things to avoid","textarea")]],
      ["Reference materials",[field("reference_asset_url","Reference asset / shared file link","url"),field("reference_assets","Additional reference links","textarea"),field("additional_notes","Additional notes","textarea")]]
    ],
    "domain-name-registration":[
      ["Domain request",[field("request_type","What do you need?","select",true,["New domain registration","Transfer an existing domain","DNS / nameserver setup"]),field("preferred_domain","Preferred domain name","text",true),field("alternate_domains","Alternate domain choices","textarea"),field("domain_use","Primary use","select",true,["Business website","Business email","Website and email","Redirect / forwarding","Brand protection","Other"])]],
      ["Registrant",commonContact.concat([field("business_legal_name","Registrant business / organization name"),field("registrant_address","Registrant address","textarea",true)])],
      ["Configuration",[field("registration_years","Initial registration term","select",true,["1 year","2 years","3 years","5 years"]),field("dns_mode","DNS setup","select",true,["Default registrar DNS","I have nameservers","Configure DNS records","Configure later"]),field("nameservers","Nameservers, if applicable","textarea"),field("website_provider","Website / hosting provider"),field("email_provider","Business email provider"),field("dns_instructions","DNS records or setup instructions","textarea")]]
    ],
    "employer-id-ein":[
      ["Applicant contact",commonContact],["Entity information",[field("legal_name","Legal name of entity or individual","text",true),field("trade_name","Trade name / DBA"),field("entity_type","Entity type","select",true,["Sole proprietor","Partnership","Corporation","S corporation","LLC","Estate","Trust","Nonprofit","Government entity","Other"]),field("mailing_address","Mailing address","textarea",true),field("responsible_party_name","Responsible party full legal name","text",true),field("responsible_party_id_type","Responsible party taxpayer ID type","select",true,["SSN","ITIN","EIN — government entity only","Foreign / N/A"])]],["Application details",[field("reason_applying","Primary reason for applying","textarea",true),field("business_start_date","Date business started or acquired","date"),field("principal_activity","Principal activity"),field("primary_product_service","Primary product or service"),field("prior_ein","Previous EIN or prior application details","textarea")]]
    ]
  };

  // More precise identifiers for a few common transportation services.
  const perService={
    "broker-authority":[field("broker_authority_type","Broker authority requested"),field("financial_security_status","BMC-84 / BMC-85 bond or trust status"),field("boc3_status","BOC-3 status")],
    "trucker-authority":[field("authority_type","Motor-carrier authority requested"),field("insurance_status","Insurance filing status"),field("boc3_status","BOC-3 status")],
    "mcs-150-update":[field("last_mcs150_date","Approximate date of last MCS-150 filing","date"),field("changes_needed","What information needs to change?","textarea",true)],
    "ifta-quarterly-returns":[field("quarter","Quarter being filed"),field("tax_year","Tax year"),field("ifta_account_number","IFTA account number")],
    "ifta-registration":[field("base_jurisdiction","IFTA base jurisdiction"),field("vehicle_count","Qualified vehicle count","number")],
    "heavy-use-tax-2290":[field("tax_period","2290 tax period"),field("vehicle_count","Number of taxable vehicles","number"),field("vin_list","VINs / vehicle list","textarea")],
    "process-agents-boc-3":[field("docket_number","MC / FF / MX docket number"),field("boc3_request_type","BOC-3 request type")],
    "boc-3-amendment":[field("docket_number","MC / FF / MX docket number"),field("requested_changes","BOC-3 changes needed","textarea",true)],
    "motor-carrier-mc-number-reinstatement":[field("revocation_date","Approximate revocation date","date"),field("insurance_on_file","Required insurance on file?"),field("boc3_on_file","BOC-3 on file?")],
    "broker-mc-number-reinstatement":[field("revocation_date","Approximate revocation date","date"),field("bond_on_file","Broker bond/trust on file?"),field("boc3_on_file","BOC-3 on file?")],
    "name-change":[field("current_legal_name","Current legal business name","text",true),field("new_legal_name","New legal business name","text",true),field("effective_date","Name change effective date","date")]
  };

  function schema(){
    const base=JSON.parse(JSON.stringify(special[serviceKey]||categorySchemas[service.category]||categorySchemas["Specialty Services"]));
    const extra=perService[serviceKey];
    if(extra&&base.length){base[0][1]=base[0][1].concat(extra)}
    if(serviceKey!=="web-design-packages"&&serviceKey!=="logo-design-packages")base.push(["Authorization",acknowledgement]);
    else base.push(["Authorization",[field("acknowledgement","I confirm the information provided is accurate and may be used by Filings4u for this design project.","checkbox",true)]]);
    return base;
  }

  function input(f){
    const req=f.required?' required':'';
    const name=esc(f.name),label=esc(f.label);
    if(f.type==="textarea")return `<div class="form-field form-field--full"><label>${label}${f.required?'<span class="required-mark">*</span>':''}</label><textarea name="${name}"${req}></textarea></div>`;
    if(f.type==="select")return `<div class="form-field"><label>${label}${f.required?'<span class="required-mark">*</span>':''}</label><select name="${name}"${req}><option value="">Select one</option>${(f.extra||[]).map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
    if(f.type==="checkbox")return `<div class="form-field form-field--full"><label class="choice"><input type="checkbox" name="${name}" value="yes"${req}> <span>${label}${f.required?'<span class="required-mark">*</span>':''}</span></label></div>`;
    return `<div class="form-field"><label>${label}${f.required?'<span class="required-mark">*</span>':''}</label><input name="${name}" type="${esc(f.type||'text')}"${req}></div>`;
  }
  root.innerHTML=`<form class="public-form" id="standaloneServiceForm" novalidate><div class="hp-field" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>${schema().map((s,i)=>`<section class="form-card"><div class="form-card__head"><span class="form-card__step">${String(i+1).padStart(2,'0')}</span><div><h2>${esc(s[0])}</h2></div></div><div class="form-grid">${s[1].map(input).join('')}</div></section>`).join('')}<section class="form-card"><div class="form-card__head"><span class="form-card__step">✓</span><div><h2>Security verification</h2><p>Complete the verification before submitting.</p></div></div><div class="form-grid"><div class="form-field form-field--full"><div data-turnstile-mount></div><p class="field-help">This form is protected by Cloudflare Turnstile.</p></div></div></section><div class="form-status" data-form-status aria-live="polite"></div><div class="form-submit-row"><button type="submit">Submit ${esc(service.title)} intake</button></div></form>`;

  const form=document.getElementById("standaloneServiceForm"),status=form.querySelector("[data-form-status]"),submit=form.querySelector("[type=submit]");
  let widgetId=null,token="";
  const setStatus=(type,msg)=>{status.className=`form-status is-visible is-${type}`;status.innerHTML=msg;status.scrollIntoView({behavior:"smooth",block:"center"})};
  const renderTurnstile=()=>{
    if(widgetId!==null||!window.turnstile)return;
    widgetId=turnstile.render(form.querySelector("[data-turnstile-mount]"),{sitekey:config.siteKey,action:"standalone_service",theme:"auto",callback:t=>{token=t},"expired-callback":()=>{token=""},"error-callback":()=>{token="";setStatus("error","Security verification could not load. Please refresh the page and try again.")}})
  };
  const timer=setInterval(()=>{renderTurnstile();if(widgetId!==null)clearInterval(timer)},120);
  const resetTurnstile=()=>{token="";if(widgetId!==null&&window.turnstile)turnstile.reset(widgetId)};
  const serialize=()=>{const fd=new FormData(form),o={};for(const [k,v] of fd.entries()){if(k==="website")continue;if(Object.hasOwn(o,k))o[k]=Array.isArray(o[k])?[...o[k],v]:[o[k],v];else o[k]=v}return o};
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const invalid=[...form.querySelectorAll("input,select,textarea")].find(x=>!x.checkValidity());if(invalid){invalid.reportValidity();invalid.focus();return}
    if(!token){setStatus("error","Please complete the security verification before submitting.");return}
    submit.disabled=true;const old=submit.textContent;submit.textContent="Submitting…";
    try{
      const answers=serialize();
      const applicantName=answers.full_name||answers.client_name||[answers.first_name,answers.last_name].filter(Boolean).join(' ')||"";
      const applicantEmail=answers.email||answers.email_address||"";
      const businessName=answers.business_legal_name||answers.business_name||answers.legal_name||"";
      const phone=answers.phone||answers.phone_number||"";
      const r=await fetch(config.submitEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceKey,serviceTitle:service.title,category:service.category,applicantName,applicantEmail,businessName,phone,answers,website:form.elements.website.value||"",pageUrl:location.href,turnstileToken:token,turnstileAction:"standalone_service"})});
      const result=await r.json().catch(()=>({}));if(!r.ok)throw new Error(result.error||"Submission failed");
      form.reset();resetTurnstile();setStatus("success",`<strong>Service intake received.</strong><br>Your F4U tracking number is <strong class="tracking-number">${esc(result.reference||"Assigned")}</strong>.<br>No payment was collected. Filings4u can continue your existing service using this submission.`)
    }catch(err){console.error(err);resetTurnstile();setStatus("error",esc(err.message||"We could not submit the form. Please try again."))}finally{submit.disabled=false;submit.textContent=old}
  });
})();
