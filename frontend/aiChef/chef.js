const BACKEND_URL = "https://sofrh-1.onrender.com";

const CHEF_IMG_MAIN = "https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/chef-main.PNG";
const CHEF_IMG_THINKING = "https://res.cloudinary.com/dqe6mmkzz/image/upload/f_auto,q_auto/chef-thinking.PNG";
const FALLBACK_ICON = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F28C28'><path d='M12 2a5 5 0 0 0-5 5v1H6a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3h-1V7a5 5 0 0 0-5-5zm-3 16v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2H9z'/></svg>";

function getLoggedUserEmail() {
  const user = localStorage.getItem("safraUser");
  if (!user) return null;
  try {
    const parsed = JSON.parse(user);
    return parsed.email || null;
  } catch (e) {
    return null;
  }
}

(function injectChefStyles() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../aiChef/chef.css";
  document.head.appendChild(link);
})();

document.addEventListener("DOMContentLoaded", () => {
  const userEmail = getLoggedUserEmail();
  const chefContainer = document.createElement("div");
  chefContainer.className = "chef-widget-container";

  if (!userEmail) {
    chefContainer.innerHTML = `
      <div class="chef-chat-box" id="chefChatBox" style="display: none;">
        <div class="chef-header">
          <div class="chef-info">
            <h4>شيف سُفرة 👨‍🍳</h4>
            <p>تنبيه</p>
          </div>
          <button class="chef-header-btn" id="closeChefBtn">&times;</button>
        </div>
        <div class="chef-messages" style="padding: 25px; text-align: center; color: #fff;">
          <p style="margin-bottom: 18px; font-size: 15px; line-height: 1.6;">
            أهلاً بك! لتتمكن من التحدث مع <b>شيف سُفرة</b>، يرجى تسجيل الدخول أولاً 🔒
          </p>
          <a href="../auth/login.html" style="background: #F28C28; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            تسجيل الدخول / إنشاء حساب
          </a>
        </div>
      </div>
      <button class="chef-floating-btn" id="openChefBtn" title="تحدث مع شيف سُفرة">
        <img src="${CHEF_IMG_MAIN}" onerror="this.onerror=null; this.src='${FALLBACK_ICON}';" alt="شيف سُفرة" class="chef-btn-icon">
        <span class="pulse-ring"></span>
      </button>
    `;
  } else {
    chefContainer.innerHTML = `
      <div class="chef-chat-box" id="chefChatBox">
        <div class="chef-header">
          <div class="chef-info">
            <div class="chef-avatar-wrapper">
              <img src="${CHEF_IMG_MAIN}" onerror="this.onerror=null; this.src='${FALLBACK_ICON}';" alt="Chef Avatar">
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4>شيف سُفرة 👨‍🍳</h4>
              <p>مساعدك الذكي للطبخ</p>
            </div>
          </div>
          <div class="chef-header-actions">
            <button class="chef-header-btn" id="expandChefBtn" title="تكبير / تصغير">⛶</button>
            <button class="chef-header-btn" id="closeChefBtn" title="إغلاق">&times;</button>
          </div>
        </div>

        <div class="chef-messages" id="chefMessages">
          <div class="msg-row bot-row">
            <img src="${CHEF_IMG_THINKING}" onerror="this.onerror=null; this.src='${FALLBACK_ICON}';" class="msg-avatar" alt="Chef">
            <div class="msg bot-msg">
              أهلاً وسهلاً بك! 👋 أنا شيف سُفرة، علمني وش المكونات اللي عندك أو وش ودك تطبخ وأنا معك خطوة بخطوة! 🍽️
            </div>
          </div>
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

      <button class="chef-floating-btn" id="openChefBtn" title="تحدث مع شيف سُفرة">
        <img src="${CHEF_IMG_MAIN}" onerror="this.onerror=null; this.src='${FALLBACK_ICON}';" alt="شيف سُفرة" class="chef-btn-icon">
        <span class="pulse-ring"></span>
      </button>
    `;
  }

  document.body.appendChild(chefContainer);

  const openChefBtn = document.getElementById("openChefBtn");
  const closeChefBtn = document.getElementById("closeChefBtn");
  const chefChatBox = document.getElementById("chefChatBox");
  const expandChefBtn = document.getElementById("expandChefBtn");

  // حدث فتح وإغلاق الشات بالزر العائم
  openChefBtn.addEventListener("click", () => {
    chefChatBox.style.display = chefChatBox.style.display === "flex" ? "none" : "flex";
  });

  // حدث إغلاق الشات بزر الإكس
  closeChefBtn.addEventListener("click", () => {
    chefChatBox.style.display = "none";
  });

  // حدث زر التكبير والتصغير واستعادة الحجم
  if (expandChefBtn) {
    expandChefBtn.addEventListener("click", () => {
      const hasManualResize = chefChatBox.style.width || chefChatBox.style.height;

      if (hasManualResize) {
        chefChatBox.style.width = "";
        chefChatBox.style.height = "";
        chefChatBox.classList.remove("expanded");
      } else {
        chefChatBox.classList.toggle("expanded");
      }
    });
  }

  if (!userEmail) return;

  const sendChefBtn = document.getElementById("sendChefBtn");
  const chefInput = document.getElementById("chefInput");
  const chefMessages = document.getElementById("chefMessages");

  async function sendMessage() {
    const text = chefInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    chefInput.value = "";
    const loadingId = appendLoadingIndicator();

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          agent_type: "chef", 
          user_email: userEmail 
        }),
      });
      const data = await response.json();
      removeLoadingIndicator(loadingId);

      if (data.reply) {
        appendMessage(data.reply, "bot");
      } else {
        appendMessage("حصل خطأ بسيط في تحضير الرد!", "bot");
      }
    } catch (err) {
      removeLoadingIndicator(loadingId);
      appendMessage("تعذر الاتصال بالشيف، تأكد من اتصال الإنترنت وحاول مجدداً.", "bot");
    }
  }

  sendChefBtn.addEventListener("click", sendMessage);
  chefInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

  function appendMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `msg-row ${sender}-row`;
    if (sender === "bot") {
      row.innerHTML = `<img src="${CHEF_IMG_THINKING}" onerror="this.onerror=null; this.src='${FALLBACK_ICON}';" class="msg-avatar" alt="Chef"><div class="msg bot-msg">${text.replace(/\n/g, "<br>")}</div>`;
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
    row.innerHTML = `<img src="${CHEF_IMG_THINKING}" onerror="this.onerror=null; this.src='${FALLBACK_ICON}';" class="msg-avatar" style="animation: pulse-anim 1s infinite alternate;" alt="Chef"><div class="msg bot-msg" style="color: #F28C28;">كتابة .. 🍳</div>`;
    chefMessages.appendChild(row);
    chefMessages.scrollTop = chefMessages.scrollHeight;
    return id;
  }

  function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
});