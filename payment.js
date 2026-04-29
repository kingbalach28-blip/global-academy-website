/* ========================= */
/* GLOBAL VARIABLES */
/* ========================= */

let selectedMethod = "";
const PAYMENT_PHONE = "+92 330 5588331";
const PAYMENT_AMOUNT = 1800;

/* ========================= */
/* PAGE INITIALIZATION */
/* ========================= */

document.addEventListener("DOMContentLoaded", function() {
  // ADD BACK BUTTON IF NEEDED
  const title = document.querySelector(".apply");
  if (title && !document.querySelector(".back-btn")) {
    const backBtn = document.createElement("button");
    backBtn.innerHTML = "← Back to Form";
    backBtn.type = "button";
    backBtn.className = "back-btn";
    backBtn.style.cssText = `
      display: block;
      margin: 0 auto 15px;
      padding: 8px 15px;
      background: rgba(255,255,255,0.1);
      border: 2px solid gold;
      color: gold;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s;
    `;
    backBtn.onclick = function() {
      window.location.href = "index.html";
    };
    title.parentElement.insertBefore(backBtn, title);
  }
});

/* ========================= */
/* SELECT PAYMENT METHOD */
/* ========================= */

function selectMethod(method, event) {
  selectedMethod = method;
  localStorage.setItem("paymentMethod", method);

  // RESET ALL BUTTONS
  document.querySelectorAll(".payment-method-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // ACTIVATE CURRENT BUTTON
  event.target.closest(".payment-method-btn").classList.add("active");

  // HIDE ALL DETAILS
  document.getElementById("easypaisa-details").style.display = "none";
  document.getElementById("jazzcash-details").style.display = "none";

  // SHOW RELEVANT SECTION
  const clickToPayBtn = document.getElementById("clickToPayBtn");
  const screenshotSection = document.getElementById("screenshotSection");
  const cashMessage = document.getElementById("cashMessage");

  if (method === "Cash") {
    clickToPayBtn.style.display = "none";
    screenshotSection.style.display = "none";
    cashMessage.style.display = "block";
  } else {
    clickToPayBtn.style.display = "block";
    screenshotSection.style.display = "none";
    cashMessage.style.display = "none";

    // SHOW PAYMENT DETAILS
    if (method === "Easypaisa") {
      document.getElementById("easypaisa-details").style.display = "block";
    } else if (method === "JazzCash") {
      document.getElementById("jazzcash-details").style.display = "block";
    }
  }
}

/* ========================= */
/* CLICK TO PAY */
/* ========================= */

function clickToPay() {
  if (!selectedMethod) {
    alert("⚠️ Please select a payment method");
    return;
  }

  // SHOW SCREENSHOT SECTION
  document.getElementById("screenshotSection").style.display = "block";

  // SCROLL TO SCREENSHOT SECTION
  setTimeout(() => {
    document.getElementById("screenshot").scrollIntoView({ behavior: "smooth" });
  }, 100);

  // ATTEMPT TO OPEN APP (simulated)
  if (selectedMethod === "Easypaisa") {
    // Easypaisa deeplink format (may not work on desktop)
    window.open("https://www.easypaisa.com.pk", "_blank");
    alert("📱 Opening Easypaisa...\n\nPay to: " + PAYMENT_PHONE + "\nAmount: " + PAYMENT_AMOUNT + " Rs\n\nAfter payment, upload the screenshot below.");
  } else if (selectedMethod === "JazzCash") {
    // JazzCash deeplink format
    window.open("https://www.jazz.com.pk/my-jazz-app", "_blank");
    alert("📱 Opening JazzCash...\n\nPay to: " + PAYMENT_PHONE + "\nAmount: " + PAYMENT_AMOUNT + " Rs\n\nAfter payment, upload the screenshot below.");
  }
}

/* ========================= */
/* SUBMIT PAYMENT (DIGITAL) */
/* ========================= */

function submitPayment() {
  if (!selectedMethod || (selectedMethod !== "Easypaisa" && selectedMethod !== "JazzCash")) {
    alert("⚠️ Please select Easypaisa or JazzCash");
    return;
  }

  const file = document.getElementById("screenshot").files[0];

  if (!file) {
    alert("⚠️ Please upload payment screenshot");
    return;
  }

  // VALIDATE FILE SIZE (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("⚠️ Image size must be less than 5MB");
    return;
  }

  // VALIDATE FILE TYPE
  if (!file.type.startsWith("image/")) {
    alert("⚠️ Please upload a valid image file");
    return;
  }

  // SAVE DATA
  localStorage.setItem("paymentMethod", selectedMethod);
  localStorage.setItem("paymentScreenshot", file.name);
  localStorage.setItem("paymentStatus", "pending-verification");

  // STORE FILE IN SESSION FOR UPLOAD
  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem("paymentScreenshotData", e.target.result);
    alert("✅ Payment screenshot submitted!\n\nWaiting for verification from host...");
    window.location.href = "success.html";
  };
  reader.readAsDataURL(file);
}

/* ========================= */
/* SUBMIT CASH PAYMENT */
/* ========================= */

function submitCashPayment() {
  localStorage.setItem("paymentMethod", "Cash");
  localStorage.setItem("paymentStatus", "confirmed");
  alert("✅ Cash payment confirmed!\n\nPlease complete payment at our campus.");
  window.location.href = "success.html";
}