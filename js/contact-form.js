/*
 * Contact form -> Netlify Forms (AJAX) with popup message.
 * The visitor stays on the page; no thank-you page is needed.
 */
(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  var submitBtn = document.getElementById("contactSubmit");
  var popup = document.getElementById("cfPopup");
  var popupTitle = document.getElementById("cfPopupTitle");
  var popupText = document.getElementById("cfPopupText");
  var popupIcon = document.getElementById("cfPopupIcon");
  var popupOk = document.getElementById("cfPopupOk");
  var popupX = document.getElementById("cfPopupX");
  var lastFocused = null;

  function showPopup(type, title, text) {
    lastFocused = document.activeElement;
    popup.classList.remove("is-success", "is-error");
    popup.classList.add(type === "success" ? "is-success" : "is-error");
    popupIcon.textContent = type === "success" ? "✓" : "!";
    popupTitle.textContent = title;
    popupText.textContent = text;
    popup.hidden = false;
    document.body.classList.add("cf-no-scroll");
    popupOk.focus();
  }

  function hidePopup() {
    popup.hidden = true;
    document.body.classList.remove("cf-no-scroll");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  popupOk.addEventListener("click", hidePopup);
  popupX.addEventListener("click", hidePopup);

  // Click on the dark background closes the popup
  popup.addEventListener("click", function (e) {
    if (e.target === popup) hidePopup();
  });

  // Esc key closes the popup
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !popup.hidden) hidePopup();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Stop double clicks
    if (submitBtn.disabled) return;
    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    var body = new URLSearchParams(new FormData(form)).toString();

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        form.reset();
        showPopup(
          "success",
          "Thank you!",
          "Your message has been sent successfully. We will get back to you soon."
        );
      })
      .catch(function () {
        showPopup(
          "error",
          "Message not sent",
          "Something went wrong. Please try again in a moment, or contact us directly."
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();