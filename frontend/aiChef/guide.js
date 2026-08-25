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

(function injectGuideStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../aiChef/chef.css";
  document.head.appendChild(link);
})();

document.addEventListener("DOMContentLoaded", () => {
  const userEmail = getLoggedUserEmail();
  const guideContainer = document.createElement("div");
  guideContainer.className = "chef-widget-container";

  if (!userEmail) {
    guideContainer.innerHTML = `
      <div class="chef-chat-box" id="guideChatBox" style="display: none;">
        <div class="chef-header">
          <div class="chef-info">
            <h4>مرشد سُفرة 🎟️</h4>
            <p>تنبيه</p>
          </div>
          <button class="chef-header-btn" id="closeGuideBtn">&times;</button>
        </div>
        <div class="chef-messages" style="padding: 25px; text-align: center; color: #fff;">
          <p style="margin-bottom: 18px; font-size: 15px; line-height: 1.6;">
            أهلاً بك! لتتمكن من التحدث مع <b>مرشد سُفرة</b>، يرجى تسجيل الدخول أولاً 🔒
          </p>
          <a href="../auth/login.html" style="background: #F28C28; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            تسجيل الدخول / إنشاء حساب
          </a>
        </div>
      </div>
      <button class="chef-floating-btn" id="openGuideBtn" title="تحدث مع مرشد سُفرة">
        <span style="font-size: 24px;">🎟️</span>
        <span class="pulse-ring"></span>
      </button>
    `;
  } else {
    guideContainer.innerHTML = `
      <div class="chef-chat-box" id="guideChatBox">
        <div class="chef-header">
          <div class="chef-info">
            <div class="chef-avatar-wrapper">
              <span style="font-size: 24px;">🎟️</span>
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4>مرشد سُفرة 🎟️</h4>
              <p>دليلك للفعاليات والمناسبات</p>
            </div>
          </div>
          <div class="chef-header-actions">
            <button class="chef-header-btn" id="expandGuideBtn" title="تكبير / تصغير">⛶</button>
            <button class="chef-header-btn" id="closeGuideBtn" title="إغلاق">&times;</button>
          </div>
        </div>

        <div class="chef-messages" id="guideMessages">
          <div class="msg-row bot-row">
            <div class="msg bot-msg">
              أهلاً بك! 👋 أنا مرشد سُفرة.. علمني وش نوع الفعاليات اللي تدور عليها أو ميزانيتك ومكانك وأنا أضبطك! 🎉
            </div>
          </div>
        </div>

        <div class="chef-input-area">
          <input type="text" id="guideInput" placeholder="اسأل عن الفعاليات، التذاكر، والمواعيد..." autocomplete="off">
          <button id="sendGuideBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <button class="chef-floating-btn" id="openGuideBtn" title="تحدث مع مرشد سُفرة">
        <span style="font-size: 24px;">🎟️</span>
        <span class="pulse-ring"></span>
      </button>
    `;
  }

  document.body.appendChild(guideContainer);

  const openGuideBtn = document.getElementById("openGuideBtn");
  const closeGuideBtn = document.getElementById("closeGuideBtn");
  const guideChatBox = document.getElementById("guideChatBox");
  const expandGuideBtn = document.getElementById("expandGuideBtn");

  openGuideBtn.addEventListener("click", () => {
    guideChatBox.style.display = guideChatBox.style.display === "flex" ? "none" : "flex";
    if (userEmail && guideChatBox.style.display === "flex") {
      document.getElementById("guideInput").focus();
    }
  });

  closeGuideBtn.addEventListener("click", () => {
    guideChatBox.style.display = "none";
  });

  if (expandGuideBtn) {
    expandGuideBtn.addEventListener("click", () => {
      guideChatBox.classList.toggle("expanded");
    });
  }

  if (!userEmail) return;

  const sendGuideBtn = document.getElementById("sendGuideBtn");
  const guideInput = document.getElementById("guideInput");
  const guideMessages = document.getElementById("guideMessages");

  async function sendMessage() {
    const text = guideInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    guideInput.value = "";
    const loadingId = appendLoadingIndicator();

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          agent_type: "guide",
          user_id: userEmail 
        }),
      });
      const data = await response.json();
      removeLoadingIndicator(loadingId);

      if (data.status === "success") {
        appendMessage(data.reply, "bot");
      } else {
        appendMessage(data.reply || "حصل خطأ بسيط في تحضير الرد!", "bot");
      }
    } catch (err) {
      removeLoadingIndicator(loadingId);
      appendMessage("تعذر الاتصال بالمرشد، تأكد من اتصال الإنترنت وحاول مجدداً.", "bot");
    }
  }

  sendGuideBtn.addEventListener("click", sendMessage);
  guideInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  function appendMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `msg-row ${sender}-row`;
    row.innerHTML = `<div class="msg ${sender}-msg">${text.replace(/\n/g, "<br>")}</div>`;
    guideMessages.appendChild(row);
    guideMessages.scrollTop = guideMessages.scrollHeight;
  }

  function appendLoadingIndicator() {
    const id = "loading-" + Date.now();
    const row = document.createElement("div");
    row.className = "msg-row bot-row";
    row.id = id;
    row.innerHTML = `<div class="msg bot-msg" style="color: #F28C28;">كتابة .. 🎟️</div>`;
    guideMessages.appendChild(row);
    guideMessages.scrollTop = guideMessages.scrollHeight;
    return id;
  }

  function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
});