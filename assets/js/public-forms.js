(() => {
  "use strict";
  const config = window.FILINGS4U_PUBLIC_FORMS || {};
  const forms = document.querySelectorAll("form[data-public-application]");

  const setConditionalState = (block, show) => {
    block.hidden = !show;
    block.querySelectorAll("input,select,textarea").forEach((el) => {
      if (!show) {
        if (el.required) el.dataset.wasRequired = "1";
        el.required = false;
      } else if (el.dataset.wasRequired === "1") {
        el.required = true;
      }
    });
  };

  const toggleConditionals = (form) => {
    form.querySelectorAll("[data-show-when]").forEach((block) => {
      const [name, expected] = block.dataset.showWhen.split(":");
      const controls = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      let actual = "";
      if (controls.some((c) => c.type === "radio" || c.type === "checkbox")) {
        actual = controls.find((c) => c.checked)?.value || "";
      } else {
        actual = controls[0]?.value || "";
      }
      setConditionalState(block, actual === expected);
    });
  };

  const setStatus = (form, type, html) => {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.className = `form-status is-visible is-${type}`;
    status.innerHTML = html;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const serialize = (form) => {
    const fd = new FormData(form);
    const answers = {};
    for (const [key, value] of fd.entries()) {
      if (key === "website") continue;
      if (Object.hasOwn(answers, key)) {
        answers[key] = Array.isArray(answers[key]) ? [...answers[key], value] : [answers[key], value];
      } else {
        answers[key] = value;
      }
    }
    return answers;
  };

  const validate = (form) => {
    form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute("aria-invalid"));
    const controls = [...form.querySelectorAll("input,select,textarea")].filter((el) => !el.closest("[hidden]"));
    let firstInvalid = null;
    for (const el of controls) {
      if (!el.checkValidity()) {
        el.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = el;
      }
    }
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.reportValidity?.();
      setStatus(form, "error", "Please complete the required fields and correct any invalid entries before submitting.");
      return false;
    }
    return true;
  };

  forms.forEach((form) => {
    form.addEventListener("change", () => toggleConditionals(form));
    toggleConditionals(form);

    const date = form.querySelector('[name="signature_date"]');
    if (date && !date.value) date.value = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      toggleConditionals(form);
      if (!validate(form)) return;
      if (!config.submitEndpoint) return setStatus(form, "error", "The submission service is not configured.");

      const submit = form.querySelector("[type=submit]");
      const original = submit?.textContent;
      if (submit) { submit.disabled = true; submit.textContent = "Submitting…"; }

      try {
        const payload = {
          formType: form.dataset.publicApplication,
          formVersion: form.dataset.formVersion || "1.0",
          applicantEmail: form.querySelector('[name="email"]')?.value?.trim() || "",
          applicantName: form.querySelector('[name="full_name"]')?.value?.trim() || form.querySelector('[name="legal_name"]')?.value?.trim() || "",
          businessName: form.querySelector('[name="business_legal_name"]')?.value?.trim() || form.querySelector('[name="legal_name"]')?.value?.trim() || "",
          phone: form.querySelector('[name="phone"]')?.value?.trim() || "",
          website: form.querySelector('[name="website"]')?.value || "",
          pageUrl: location.href,
          submittedAt: new Date().toISOString(),
          answers: serialize(form)
        };

        const response = await fetch(config.submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "Submission failed");

        const reference = String(result.reference || "").replace(/[^A-Z0-9-]/gi, "");
        form.reset();
        toggleConditionals(form);
        if (date) date.value = new Date().toISOString().slice(0, 10);
        setStatus(form, "success", `<strong>Application received.</strong><br>Your F4U tracking number is <strong class="tracking-number">${reference || "Assigned"}</strong>.<br>A simple confirmation email has been sent to you. Save this tracking number for your records.`);
      } catch (error) {
        console.error("Public form submission error", error);
        setStatus(form, "error", "We could not submit your application. Please review your connection and try again. If the problem continues, contact Filings4u.");
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = original || "Submit application"; }
      }
    });
  });
})();
