const BACKEND_URL = "https://sofrh-1.onrender.com";

// حقن ملف التنسيق
(function injectGuideStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../aiChef/chef.css";
  document.head.appendChild(link);
})();

document.addEventListener("DOMContentLoaded", () => {
  const guideContainer = document.createElement("div");
  guideContainer.className = "chef-widget-container";
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
        <button class="close-btn" id="closeGuideBtn">&times;</button>
      </div>

      <div class="chef-messages" id="guideMessages">
        <div class="msg-row bot-row">
          <div class="msg bot-msg">
            أهلاً بك! 👋 أنا مرشد سُفرة.. علمني وش نوع الفعاليات اللي تدور عليها أو ميزانيتك ومكانك، وأنا أضبطك بأفضل التجارب! 🎉
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

  document.body.appendChild(guideContainer);

  const openBtn = document.getElementById("openGuideBtn");
  const closeBtn = document.getElementById("closeGuideBtn");
  const chatBox = document.getElementById("guideChatBox");
  const sendBtn = document.getElementById("sendGuideBtn");
  const inputEl = document.getElementById("guideInput");
  const messagesEl = document.getElementById("guideMessages");

  openBtn.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
    if (chatBox.style.display === "flex") inputEl.focus();
  });

  closeBtn.addEventListener("click", () => { chatBox.style.display = "none"; });

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    appendMsg(text, "user");
    inputEl.value = "";

    const loadingId = appendLoading();

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, agent_type: "guide" }),
      });
      const data = await response.json();
      removeLoading(loadingId);

      if (data.status === "success") {
        appendMsg(data.reply, "bot");
      } else {
        appendMsg("حصل خطأ بسيط في تحضير الرد، جرب تسألني ثانية!", "bot");
      }
    } catch (err) {
      removeLoading(loadingId);
      appendMsg("تعذر الاتصال بالمرشد، تأكد من اتصال الإنترنت وحاول مجدداً.", "bot");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  function appendMsg(text, sender) {
    const row = document.createElement("div");
    row.className = `msg-row ${sender}-row`;
    row.innerHTML = `<div class="msg ${sender}-msg">${text.replace(/\n/g, "<br>")}</div>`;
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendLoading() {
    const id = "loading-" + Date.now();
    const row = document.createElement("div");
    row.className = "msg-row bot-row";
    row.id = id;
    row.innerHTML = `<div class="msg bot-msg" style="color: #F28C28;">كتابة .. 🎟️</div>`;
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
});