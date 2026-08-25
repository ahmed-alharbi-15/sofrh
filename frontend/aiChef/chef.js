// عنوان الباك إند على ريندر
const BACKEND_URL = "https://sofrh-1.onrender.com";

// 1. حقن ملف CSS تلقائياً
(function injectChefStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/aiChef/chef.css"; // أو ../aiChef/chef.css
  document.head.appendChild(link);
})();

// 2. حقن هيكل الـ HTML في الصفحة عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  const chefContainer = document.createElement("div");
  chefContainer.className = "chef-widget-container";
  chefContainer.innerHTML = `
    <!-- نافذة المحادثة -->
    <div class="chef-chat-box" id="chefChatBox">
      <div class="chef-header">
        <div class="chef-info">
          <div class="chef-avatar-wrapper">
            <img src="/img/chef-main.png" alt="Chef Avatar">
            <span class="online-indicator"></span>
          </div>
          <div>
            <h4>شيف سُفرة 👨‍🍳</h4>
            <p>مساعدك الذكي للطبخ والفعاليات</p>
          </div>
        </div>
        <button class="close-btn" id="closeChefBtn">&times;</button>
      </div>

      <div class="chef-messages" id="chefMessages">
        <div class="msg-row bot-row">
          <img src="/img/chef-thinking.png" class="msg-avatar" alt="Chef">
          <div class="msg bot-msg">
            أهلاً بك يا بطل! 👋 أنا شيف سُفرة، علمني وش المكونات اللي عندك بالثلاجة أو وش ودك تطبخ اليوم وأنا أضبطك بأحلى وصفة! 🍽️
          </div>
        </div>
      </div>

      <div class="chef-quick-chips">
        <button class="chip-btn" onclick="sendQuickPrompt('عندي دجاج ورز وش أطبخ؟')">🍗 دجاج ورز</button>
        <button class="chip-btn" onclick="sendQuickPrompt('أبي حلا سريع وسهل')">🍰 حلا سريع</button>
        <button class="chip-btn" onclick="sendQuickPrompt('وش الفعاليات الجاية؟')">🎉 الفعاليات</button>
      </div>

      <div class="chef-input-area">
        <input type="text" id="chefInput" placeholder="اكتب مكوناتك أو استفسارك هنا..." autocomplete="off">
        <button id="sendChefBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>

    <!-- الزر العائم -->
    <button class="chef-floating-btn" id="openChefBtn" title="تحدث مع شيف سُفرة">
      <img src="/img/chef-main.png" alt="شيف سُفرة" class="chef-btn-icon">
      <span class="pulse-ring"></span>
    </button>
  `;

  document.body.appendChild(chefContainer);

  // 3. تفعيل أحداث الأزرار والإرسال
  const openChefBtn = document.getElementById("openChefBtn");
  const closeChefBtn = document.getElementById("closeChefBtn");
  const chefChatBox = document.getElementById("chefChatBox");
  const sendChefBtn = document.getElementById("sendChefBtn");
  const chefInput = document.getElementById("chefInput");
  const chefMessages = document.getElementById("chefMessages");

  openChefBtn.addEventListener("click", () => {
    chefChatBox.style.display = chefChatBox.style.display === "flex" ? "none" : "flex";
    if (chefChatBox.style.display === "flex") {
      chefInput.focus();
    }
  });

  closeChefBtn.addEventListener("click", () => {
    chefChatBox.style.display = "none";
  });

  async function sendMessage(textToSend = null) {
    const text = textToSend || chefInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    if (!textToSend) chefInput.value = "";

    const loadingId = appendLoadingIndicator();

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      removeLoadingIndicator(loadingId);

      if (data.status === "success") {
        appendMessage(data.reply, "bot");
      } else {
        appendMessage("حصل خطأ بسيط في تحضير الرد، جرب تسألني مرة ثانية!", "bot");
      }
    } catch (err) {
      removeLoadingIndicator(loadingId);
      appendMessage("تعذر الاتصال بالشيف، تأكد من اتصال الإنترنت وحاول مجدداً.", "bot");
    }
  }

  sendChefBtn.addEventListener("click", () => sendMessage());
  chefInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function appendMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `msg-row ${sender}-row`;

    if (sender === "bot") {
      row.innerHTML = `
        <img src="/img/chef-thinking.png" class="msg-avatar" alt="Chef">
        <div class="msg bot-msg">${text.replace(/\n/g, "<br>")}</div>
      `;
    } else {
      row.innerHTML = `<div class="msg user-msg">${text}</div>`;
    }

    chefMessages.appendChild(row);
    chefMessages.scrollTop = chefMessages.scrollHeight;
  }

  function appendLoadingIndicator() {
    const id = "loading-" + Date.now();
    const row = document.createElement("div");
    row.className = "msg-row bot-row";
    row.id = id;
    row.innerHTML = `
      <img src="/img/chef-thinking.png" class="msg-avatar" style="animation: pulse-anim 1s infinite alternate;" alt="Chef">
      <div class="msg bot-msg" style="color: #F28C28;">تحضير الرد . .</div>
    `;
    chefMessages.appendChild(row);
    chefMessages.scrollTop = chefMessages.scrollHeight;
    return id;
  }

  function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  window.sendQuickPrompt = function (promptText) {
    sendMessage(promptText);
  };
});