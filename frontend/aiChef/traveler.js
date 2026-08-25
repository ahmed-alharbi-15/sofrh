const BACKEND_URL = "https://sofrh-1.onrender.com";

function getLoggedUserEmail() {
  const user = localStorage.getItem("safraUser");
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    return parsed.email;
  } catch (e) {
    return null;
  }
}

(function injectTravelerStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../aiChef/chef.css";
  document.head.appendChild(link);
})();

document.addEventListener("DOMContentLoaded", () => {
  const userEmail = getLoggedUserEmail();
  const travelerContainer = document.createElement("div");
  travelerContainer.className = "chef-widget-container";

  if (!userEmail) {
    travelerContainer.innerHTML = `
      <div class="chef-chat-box" id="travelerChatBox" style="display: none;">
        <div class="chef-header">
          <div class="chef-info">
            <h4>رحّال سُفرة 🧭</h4>
            <p>تنبيه</p>
          </div>
          <button class="chef-header-btn" id="closeTravelerBtn">&times;</button>
        </div>
        <div class="chef-messages" style="padding: 25px; text-align: center; color: #fff;">
          <p style="margin-bottom: 18px; font-size: 15px; line-height: 1.6;">
            أهلاً بك! لتتمكن من التحدث مع <b>رحّال سُفرة</b>، يرجى تسجيل الدخول أولاً 🔒
          </p>
          <a href="../auth/login.html" style="background: #F28C28; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            تسجيل الدخول / إنشاء حساب
          </a>
        </div>
      </div>
      <button class="chef-floating-btn" id="openTravelerBtn" title="تحدث مع رحّال سُفرة">
        <span style="font-size: 24px;">🧭</span>
        <span class="pulse-ring"></span>
      </button>
    `;
  } else {
    travelerContainer.innerHTML = `
      <div class="chef-chat-box" id="travelerChatBox">
        <div class="chef-header">
          <div class="chef-info">
            <div class="chef-avatar-wrapper">
              <span style="font-size: 24px;">🧭</span>
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4>رحّال سُفرة 🧭</h4>
              <p>دليلك لاستكشاف دول وثقافات العالم</p>
            </div>
          </div>
          <div class="chef-header-actions">
            <button class="chef-header-btn" id="expandTravelerBtn" title="تكبير / تصغير">⛶</button>
            <button class="chef-header-btn" id="closeTravelerBtn" title="إغلاق">&times;</button>
          </div>
        </div>

        <div class="chef-messages" id="travelerMessages">
          <div class="msg-row bot-row">
            <div class="msg bot-msg">
              يا هلا بالمستكشف! 🌍 أنا رحّال سُفرة.. ودك تسافر وين أو تتعرف على ثقافة وأكل أي دولة بالعالم؟ اسألني وجاهز آخذك في جولة! 🧭✨
            </div>
          </div>
        </div>

        <div class="chef-input-area">
          <input type="text" id="travelerInput" placeholder="اسأل عن أي دولة، ثقافة، أو تجربة..." autocomplete="off">
          <button id="sendTravelerBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <button class="chef-floating-btn" id="openTravelerBtn" title="تحدث مع رحّال سُفرة">
        <span style="font-size: 24px;">🧭</span>
        <span class="pulse-ring"></span>
      </button>
    `;
  }

  document.body.appendChild(travelerContainer);

  const openTravelerBtn = document.getElementById("openTravelerBtn");
  const closeTravelerBtn = document.getElementById("closeTravelerBtn");
  const travelerChatBox = document.getElementById("travelerChatBox");
  const expandTravelerBtn = document.getElementById("expandTravelerBtn");

  openTravelerBtn.addEventListener("click", () => {
    travelerChatBox.style.display = travelerChatBox.style.display === "flex" ? "none" : "flex";
    if (userEmail && travelerChatBox.style.display === "flex") {
      document.getElementById("travelerInput").focus();
    }
  });

  closeTravelerBtn.addEventListener("click", () => {
    travelerChatBox.style.display = "none";
  });

  if (expandTravelerBtn) {
    expandTravelerBtn.addEventListener("click", () => {
      // التحقق هل تم سحب وتغيير الحجم يدوياً
      const hasManualResize = travelerChatBox.style.width || travelerChatBox.style.height;

      if (hasManualResize) {
        travelerChatBox.style.width = "";
        travelerChatBox.style.height = "";
        travelerChatBox.classList.remove("expanded");
      } else {
        travelerChatBox.classList.toggle("expanded");
      }
    });
  }
  if (!userEmail) return;

  const sendTravelerBtn = document.getElementById("sendTravelerBtn");
  const travelerInput = document.getElementById("travelerInput");
  const travelerMessages = document.getElementById("travelerMessages");

  async function sendMessage() {
    const text = travelerInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    travelerInput.value = "";
    const loadingId = appendLoadingIndicator();

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          agent_type: "traveler",
          user_id: userEmail 
        }),
      });
      const data = await response.json();
      removeLoadingIndicator(loadingId);

      if (data.status === "success") {
        appendMessage(data.reply, "bot");
      } else {
        appendMessage(data.reply || "حصل خطأ بسيط أثناء الرحلة!", "bot");
      }
    } catch (err) {
      removeLoadingIndicator(loadingId);
      appendMessage("تعذر الاتصال بالرحال، تأكد من اتصال الإنترنت وحاول مجدداً.", "bot");
    }
  }

  sendTravelerBtn.addEventListener("click", sendMessage);
  travelerInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  function appendMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `msg-row ${sender}-row`;
    row.innerHTML = `<div class="msg ${sender}-msg">${text.replace(/\n/g, "<br>")}</div>`;
    travelerMessages.appendChild(row);
    travelerMessages.scrollTop = travelerMessages.scrollHeight;
  }

  function appendLoadingIndicator() {
    const id = "loading-" + Date.now();
    const row = document.createElement("div");
    row.className = "msg-row bot-row";
    row.id = id;
    row.innerHTML = `<div class="msg bot-msg" style="color: #F28C28;">كتابة .. 🧭🌍</div>`;
    travelerMessages.appendChild(row);
    travelerMessages.scrollTop = travelerMessages.scrollHeight;
    return id;
  }

  function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
});