(function () {
  const APPS_SCRIPT_URL = "PASTE_YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE";

  const form = document.getElementById("application-form");
  if (!form) return;

  const stepLabel = document.getElementById("step-label");
  const stepTitle = document.getElementById("step-title");
  const progressFill = document.getElementById("progress-fill");
  const panels = Array.from(document.querySelectorAll(".step-panel"));
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const prevBtnMobile = document.getElementById("prev-btn-mobile");
  const submitBtn = document.getElementById("submit-btn");
  const messageBox = document.getElementById("form-message");
  const iframe = document.getElementById("hidden_iframe");

  const eventNameHidden = document.getElementById("eventNameHidden");
  const eventSlugHidden = document.getElementById("eventSlugHidden");
  const eventNameDisplay = document.getElementById("eventNameDisplay");
  const sourceHidden = document.getElementById("sourceHidden");
  const sourceIdHidden = document.getElementById("sourceIdHidden");
  const utmSourceHidden = document.getElementById("utmSourceHidden");
  const utmMediumHidden = document.getElementById("utmMediumHidden");
  const utmCampaignHidden = document.getElementById("utmCampaignHidden");
  const refHidden = document.getElementById("refHidden");
  const landingPageUrlHidden = document.getElementById("landingPageUrlHidden");
  const userAgentHidden = document.getElementById("userAgentHidden");
  const identitySelectionHidden = document.getElementById("identitySelectionHidden");
  const interestedInSelectionHidden = document.getElementById("interestedInSelectionHidden");

  const identityBase = document.getElementById("identityBase");
  const identitySubWrap = document.getElementById("identitySubWrap");
  const identitySub = document.getElementById("identitySub");

  const longTerm = document.getElementById("longTermPercent");
  const casual = document.getElementById("casualPercent");
  const friends = document.getElementById("friendsPercent");
  const longTermValue = document.getElementById("longTermValue");
  const casualValue = document.getElementById("casualValue");
  const friendsValue = document.getElementById("friendsValue");
  const intentionTotal = document.getElementById("intention-total");
  const intentionError = document.getElementById("intention-error");

  const openness = document.getElementById("openness");
  const opennessOther = document.getElementById("opennessOther");

  const languageSelects = Array.from(document.querySelectorAll(".language-select"));
  const languageError = document.getElementById("language-error");

  const interestedGrid = document.getElementById("interestedGrid");

  let currentStep = 1;
  let isSubmitting = false;
  let submissionStarted = false;
  let iframeResponseHandled = false;

  const stepTitles = {
    1: "My info",
    2: "What I’m looking for",
    3: "Nice to have"
  };

  const fullGenderOptions = [
    "Man",
    "Woman",
    "Non-binary",
    "Genderqueer",
    "Genderfluid",
    "Agender",
    "Bigender",
    "Multigender",
    "Polygender",
    "Demiboy",
    "Demigirl",
    "Androgynous",
    "Genderflux",
    "Intergender"
  ];

  const manSubOptions = ["Man", "Cis-Man", "Trans-Man"];
  const womanSubOptions = ["Woman", "Cis-Woman", "Trans-Woman"];

  function initTracking() {
    const params = new URLSearchParams(window.location.search);
    const eventName = params.get("event") || "Blind Duck Dating Berlin";
    const eventSlug = params.get("slug") || "";
    const source = params.get("source") || params.get("utm_source") || "direct";
    const sourceId = params.get("source_id") || "";
    const utmSource = params.get("utm_source") || "";
    const utmMedium = params.get("utm_medium") || "";
    const utmCampaign = params.get("utm_campaign") || "";
    const ref = params.get("ref") || document.referrer || "";

    eventNameHidden.value = eventName;
    eventSlugHidden.value = eventSlug;
    eventNameDisplay.value = eventName;

    sourceHidden.value = source;
    sourceIdHidden.value = sourceId;
    utmSourceHidden.value = utmSource;
    utmMediumHidden.value = utmMedium;
    utmCampaignHidden.value = utmCampaign;
    refHidden.value = ref;
    landingPageUrlHidden.value = window.location.href;
    userAgentHidden.value = navigator.userAgent;

    if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith("http")) {
      form.action = APPS_SCRIPT_URL;
    }
  }

  function renderInterestedOptions() {
    const items = [];
    fullGenderOptions.forEach((option) => {
      if (option === "Man") {
        items.push({ label: "Man", value: "Man", children: manSubOptions });
      } else if (option === "Woman") {
        items.push({ label: "Woman", value: "Woman", children: womanSubOptions });
      } else {
        items.push({ label: option, value: option });
      }
    });

    interestedGrid.innerHTML = items.map((item) => {
      if (!item.children) {
        return `
          <label class="checkbox-card">
            <input class="sr-only interested-checkbox" type="checkbox" data-value="${escapeAttr(item.value)}">
            <span class="block rounded-2xl border border-black/10 bg-[#f8f4ee] px-4 py-3 font-medium cursor-pointer">${escapeHtml(item.label)}</span>
          </label>
        `;
      }

      return `
        <div class="rounded-2xl border border-black/10 bg-[#f8f4ee] p-4">
          <label class="checkbox-card block">
            <input class="sr-only interested-parent" type="checkbox" data-parent="${escapeAttr(item.value)}">
            <span class="block rounded-2xl border border-black/10 bg-white px-4 py-3 font-medium cursor-pointer">${escapeHtml(item.label)}</span>
          </label>
          <div class="grid gap-2 mt-3 hidden interested-children" data-children-for="${escapeAttr(item.value)}">
            ${item.children.map(child => `
              <label class="checkbox-card">
                <input class="sr-only interested-checkbox" type="checkbox" data-value="${escapeAttr(child)}">
                <span class="block rounded-2xl border border-black/10 bg-white px-4 py-3 font-medium cursor-pointer">${escapeHtml(child)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");

    Array.from(document.querySelectorAll(".interested-parent")).forEach((parentCheckbox) => {
      parentCheckbox.addEventListener("change", () => {
        const parent = parentCheckbox.getAttribute("data-parent");
        const childrenWrap = document.querySelector(`[data-children-for="${cssEscape(parent)}"]`);
        if (!childrenWrap) return;
        childrenWrap.classList.toggle("hidden", !parentCheckbox.checked);
        if (!parentCheckbox.checked) {
          childrenWrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
          });
        }
        syncInterestedHidden();
      });
    });

    Array.from(document.querySelectorAll(".interested-checkbox")).forEach((cb) => {
      cb.addEventListener("change", syncInterestedHidden);
    });
  }

  function initIdentityControls() {
    identityBase.addEventListener("change", () => {
      const value = identityBase.value;
      identitySub.innerHTML = '<option value="">Select</option>';

      if (value === "Man") {
        manSubOptions.forEach((opt) => {
          identitySub.insertAdjacentHTML("beforeend", `<option>${escapeHtml(opt)}</option>`);
        });
        identitySubWrap.classList.remove("hidden");
      } else if (value === "Woman") {
        womanSubOptions.forEach((opt) => {
          identitySub.insertAdjacentHTML("beforeend", `<option>${escapeHtml(opt)}</option>`);
        });
        identitySubWrap.classList.remove("hidden");
      } else {
        identitySubWrap.classList.add("hidden");
        identitySub.value = "";
      }

      syncIdentityHidden();
    });

    identitySub.addEventListener("change", syncIdentityHidden);
  }

  function syncIdentityHidden() {
    const value = identityBase.value;
    const sub = identitySub.value;
    identitySelectionHidden.value = sub || value || "";
  }

  function syncInterestedHidden() {
    const selected = [];

    document.querySelectorAll(".interested-checkbox:checked").forEach((cb) => {
      selected.push(cb.getAttribute("data-value"));
    });

    document.querySelectorAll(".interested-parent:checked").forEach((parent) => {
      const name = parent.getAttribute("data-parent");
      const childrenWrap = document.querySelector(`[data-children-for="${cssEscape(name)}"]`);
      const anyChildChecked = childrenWrap && childrenWrap.querySelector(".interested-checkbox:checked");
      if (!anyChildChecked) {
        selected.push(name);
      }
    });

    interestedInSelectionHidden.value = selected.join(", ");
  }

  function updateIntentionUI() {
    longTermValue.textContent = `${longTerm.value}%`;
    casualValue.textContent = `${casual.value}%`;
    friendsValue.textContent = `${friends.value}%`;

    const total = Number(longTerm.value) + Number(casual.value) + Number(friends.value);
    intentionTotal.textContent = `Total: ${total}%`;

    if (total === 100) {
      intentionTotal.className = "text-sm font-black rounded-full bg-[#ecfdf5] px-3 py-1 border border-[#86efac]";
      intentionError.classList.add("hidden");
    } else {
      intentionTotal.className = "text-sm font-black rounded-full bg-[#fff7ef] px-3 py-1 border border-black/10";
    }
  }

  function initRanges() {
    [longTerm, casual, friends].forEach((input) => {
      input.addEventListener("input", updateIntentionUI);
    });
    updateIntentionUI();
  }

  function initOpenness() {
    openness.addEventListener("change", () => {
      if (openness.value === "Other") {
        opennessOther.classList.remove("hidden");
      } else {
        opennessOther.classList.add("hidden");
        opennessOther.value = "";
      }
    });
  }

  function initLanguageValidation() {
    languageSelects.forEach((select) => {
      select.addEventListener("change", validateLanguagesUnique);
    });
  }

  function validateLanguagesUnique() {
    const chosen = languageSelects.map(s => s.value).filter(Boolean);
    const unique = new Set(chosen);
    const isValid = chosen.length === unique.size;

    languageError.classList.toggle("hidden", isValid);

    languageSelects.forEach(select => {
      if (!isValid && select.value && chosen.filter(v => v === select.value).length > 1) {
        select.classList.add("field-error");
      } else {
        select.classList.remove("field-error");
      }
    });

    return isValid;
  }

  function initLimitedCheckboxes(groupSelector, errorId, maxAllowed) {
    const boxes = Array.from(document.querySelectorAll(groupSelector));
    const error = document.getElementById(errorId);

    boxes.forEach((box) => {
      box.addEventListener("change", () => {
        const checked = boxes.filter(b => b.checked);
        if (checked.length > maxAllowed) {
          box.checked = false;
          error.classList.remove("hidden");
        } else {
          error.classList.add("hidden");
        }
      });
    });
  }

  function showStep(step) {
    currentStep = step;
    panels.forEach((panel) => {
      panel.hidden = Number(panel.getAttribute("data-step")) !== step;
    });

    stepLabel.textContent = `Step ${step}/3`;
    stepTitle.textContent = stepTitles[step];
    progressFill.style.width = `${(step / 3) * 100}%`;

    const showPrev = step > 1;
    prevBtn.classList.toggle("hidden", !showPrev);
    prevBtnMobile.classList.toggle("hidden", !showPrev);

    nextBtn.classList.toggle("hidden", step === 3);
    submitBtn.classList.toggle("hidden", step !== 3);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearErrors(step) {
    const panel = panels.find(p => Number(p.getAttribute("data-step")) === step);
    if (!panel) return;

    panel.querySelectorAll(".field-error").forEach((el) => el.classList.remove("field-error"));
    document.querySelectorAll(`[data-step-required="${step}"] + .helper-error, .helper-error[data-step="${step}"]`).forEach((el) => el.classList.add("hidden"));
    panel.querySelectorAll(".helper-error").forEach((el) => {
      if (el.id !== "language-error" && el.id !== "interests-error" && el.id !== "music-error" && el.id !== "intention-error") {
        el.classList.add("hidden");
      }
    });
  }

  function validateRequiredInputs(step) {
    clearErrors(step);
    let isValid = true;

    const requiredFields = Array.from(document.querySelectorAll(`.required-step${step}`));
    requiredFields.forEach((field) => {
      const value = (field.value || "").trim();
      if (!value) {
        field.classList.add("field-error");
        isValid = false;
      } else {
        field.classList.remove("field-error");
      }
    });

    const requiredGroups = Array.from(document.querySelectorAll(`[data-step-required="${step}"]`));
    requiredGroups.forEach((group) => {
      const groupName = group.getAttribute("data-required-group");
      const min = Number(group.getAttribute("data-min") || "1");
      const radios = Array.from(group.querySelectorAll('input[type="radio"]'));
      const checks = Array.from(group.querySelectorAll('input[type="checkbox"]'));

      let count = 0;
      if (radios.length) count = radios.filter(r => r.checked).length;
      if (checks.length) count = checks.filter(c => c.checked).length;

      const errorEl = document.querySelector(`[data-error-for="${cssEscape(groupName)}"]`);
      if (count < min) {
        isValid = false;
        if (errorEl) errorEl.classList.remove("hidden");
        group.querySelectorAll('span').forEach(span => span.classList.add("field-error"));
      } else {
        if (errorEl) errorEl.classList.add("hidden");
        group.querySelectorAll('span').forEach(span => span.classList.remove("field-error"));
      }
    });

    if (step === 2) {
      syncIdentityHidden();
      syncInterestedHidden();

      if (!identitySelectionHidden.value) {
        isValid = false;
        identityBase.classList.add("field-error");
        const errorEl = document.querySelector('[data-error-for="identityBase"]');
        if (errorEl) errorEl.classList.remove("hidden");
      }

      if (!interestedInSelectionHidden.value) {
        isValid = false;
        const errorEl = document.querySelector('[data-error-for="interestedIn"]');
        if (errorEl) errorEl.classList.remove("hidden");
      }

      const total = Number(longTerm.value) + Number(casual.value) + Number(friends.value);
      if (total !== 100) {
        isValid = false;
        intentionError.classList.remove("hidden");
      } else {
        intentionError.classList.add("hidden");
      }
    }

    if (step === 1) {
      if (!validateLanguagesUnique()) {
        isValid = false;
      }
    }

    return isValid;
  }

  function showMessage(type, html) {
    messageBox.classList.remove("hidden");
    messageBox.className = "rounded-[1.5rem] border px-5 py-4";
    if (type === "success") {
      messageBox.classList.add("border-[#86efac]", "bg-[#ecfdf5]");
    } else {
      messageBox.classList.add("border-[#fca5a5]", "bg-[#fef2f2]");
    }
    messageBox.innerHTML = html;
  }

  function setSubmittingState(submitting) {
    isSubmitting = submitting;
    submitBtn.disabled = submitting;
    nextBtn.disabled = submitting;
    prevBtn.disabled = submitting;
    prevBtnMobile.disabled = submitting;

    submitBtn.textContent = submitting ? "Submitting..." : "Submit";
  }

  function normalizeCheckboxGroup(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map((cb) => cb.value)
      .join(", ");
  }

  function addHiddenField(name, value) {
    let field = form.querySelector(`input[type="hidden"][name="${name}"]`);
    if (!field) {
      field = document.createElement("input");
      field.type = "hidden";
      field.name = name;
      form.appendChild(field);
    }
    field.value = value;
  }

  function prepareSubmissionValues() {
    syncIdentityHidden();
    syncInterestedHidden();

    addHiddenField("genderIdentity", identitySelectionHidden.value);
    addHiddenField("interestedIn", interestedInSelectionHidden.value);
    addHiddenField("preferredMeetingType", normalizeCheckboxGroup("meetType"));
    addHiddenField("preferredAgeRangesCombined", normalizeCheckboxGroup("preferredAgeRanges"));
    addHiddenField("eveningVibeCombined", normalizeCheckboxGroup("eveningVibe"));
    addHiddenField("interestsCombined", normalizeCheckboxGroup("interests"));
    addHiddenField("musicGenresCombined", normalizeCheckboxGroup("musicGenres"));

    if (openness.value === "Other" && opennessOther.value.trim()) {
      addHiddenField("opennessCombined", `Other: ${opennessOther.value.trim()}`);
    } else {
      addHiddenField("opennessCombined", openness.value || "");
    }
  }

  function handleNext() {
    if (validateRequiredInputs(currentStep)) {
      showStep(Math.min(3, currentStep + 1));
    }
  }

  function handlePrev() {
    showStep(Math.max(1, currentStep - 1));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;
    if (!validateRequiredInputs(3) || !validateRequiredInputs(2) || !validateRequiredInputs(1)) {
      const firstInvalidStep = !validateRequiredInputs(1) ? 1 : (!validateRequiredInputs(2) ? 2 : 3);
      showStep(firstInvalidStep);
      return;
    }

    prepareSubmissionValues();

    if (!form.action || !form.action.startsWith("http")) {
      showMessage(
        "error",
        "<strong>Missing Apps Script URL.</strong><p class='mt-2 text-sm'>Open <code>js/apply-form.js</code> and paste your deployed Google Apps Script <code>/exec</code> URL into <code>APPS_SCRIPT_URL</code>.</p>"
      );
      return;
    }

    iframeResponseHandled = false;
    submissionStarted = true;
    setSubmittingState(true);
    showMessage("success", "<strong>Submitting...</strong><p class='mt-2 text-sm'>Your application is on its way.</p>");

    form.submit();

    window.setTimeout(() => {
      if (submissionStarted && !iframeResponseHandled) {
        iframeResponseHandled = true;
        submissionStarted = false;
        setSubmittingState(false);
        form.reset();
        identitySelectionHidden.value = "";
        interestedInSelectionHidden.value = "";
        identitySubWrap.classList.add("hidden");
        opennessOther.classList.add("hidden");
        updateIntentionUI();
        showStep(1);
        showMessage(
          "success",
          "<strong>Application sent.</strong><p class='mt-2 text-sm'>If your Google Apps Script deployment is live, your application should now be in the spreadsheet and confirmation emails should be triggered.</p>"
        );
      }
    }, 1800);
  }

  iframe.addEventListener("load", () => {
    if (!submissionStarted || iframeResponseHandled) return;
    iframeResponseHandled = true;
    submissionStarted = false;
    setSubmittingState(false);

    form.reset();
    identitySelectionHidden.value = "";
    interestedInSelectionHidden.value = "";
    identitySubWrap.classList.add("hidden");
    opennessOther.classList.add("hidden");
    updateIntentionUI();
    showStep(1);

    showMessage(
      "success",
      "<strong>Application received.</strong><p class='mt-2 text-sm'>Thanks for applying. We received your submission. This does not yet confirm a spot.</p>"
    );
  });

  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", handlePrev);
  prevBtnMobile.addEventListener("click", handlePrev);
  form.addEventListener("submit", handleSubmit);

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function cssEscape(str) {
    return String(str).replace(/"/g, '\\"');
  }

  initTracking();
  renderInterestedOptions();
  initIdentityControls();
  initRanges();
  initOpenness();
  initLanguageValidation();
  initLimitedCheckboxes(".limited-interests", "interests-error", 3);
  initLimitedCheckboxes(".limited-music", "music-error", 3);
  syncIdentityHidden();
  syncInterestedHidden();
  showStep(1);
})();