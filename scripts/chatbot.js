/* Doggo AI — floating chat widget */

(function () {
  // ── Path helpers ────────────────────────────────────────────────────
  // Resolve asset path regardless of root vs pages/
  const base = window.location.pathname.includes('/pages/') ? '../' : '';

  // Resolve internal page path (course pages live in /pages/)
  function pg(page) {
    return window.location.pathname.includes('/pages/') ? page : `pages/${page}`;
  }

  // Reusable "View course" pill link
  function courseBtn(label, page) {
    return `<a href="${pg(page)}" class="chat-course-btn">${label} →</a>`;
  }

  // ── Inject widget HTML ──────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.className = 'chatbot-widget';
  widget.id = 'chatbot-widget';
  widget.innerHTML = `
    <div class="chatbot-panel" id="chatbot-panel" aria-hidden="true">

      <div class="chatbot-panel-header">
        <div class="chatbot-header-info">
          <img src="${base}assets/icons/AI-bot.png" alt="" class="chatbot-header-avatar">
          <div>
            <span class="chatbot-header-name">Doggo AI</span>
            <span class="chatbot-header-status">● Online</span>
          </div>
        </div>
        <button class="chatbot-close-btn" id="chatbot-close-btn" aria-label="Close chat">✕</button>
      </div>

      <div class="chatbot-messages" id="chatbot-messages"></div>

      <div class="chatbot-input-row">
        <input type="text" id="chatbot-input" class="chatbot-input"
               placeholder="Ask me anything…" autocomplete="off">
        <button id="chatbot-send-btn" class="chatbot-send-btn" aria-label="Send">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        </button>
      </div>

    </div>

    <button class="chatbot-fab" id="chatbot-fab" aria-label="Chat with Buddy">
      <img src="${base}assets/icons/AI-bot.png" alt="" class="chatbot-fab-icon">
    </button>
  `;
  document.body.appendChild(widget);

  // ── Element references ──────────────────────────────────────────────
  const panel    = document.getElementById('chatbot-panel');
  const fab      = document.getElementById('chatbot-fab');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const messages = document.getElementById('chatbot-messages');
  const input    = document.getElementById('chatbot-input');
  const sendBtn  = document.getElementById('chatbot-send-btn');

  let isOpen = false;

  // ── Open / close ────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    // Greeting shown once — immediately asks about the dog
    if (messages.children.length === 0) {
      addBotMessage(
        "G'day! 🐾 I'm Buddy, Brisbane Dog Training Club's assistant!\n\n" +
        "I can recommend the perfect course for your dog, or walk you through the booking process.\n\n" +
        "To get started — <strong>how old is your dog?</strong> (e.g. \"10 weeks\", \"6 months\", \"2 years\")"
      );
    }
    setTimeout(() => input.focus(), 260);
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  fab.addEventListener('click', () => (isOpen ? closeChat() : openChat()));
  closeBtn.addEventListener('click', closeChat);

  document.addEventListener('click', (e) => {
    if (isOpen && !widget.contains(e.target)) closeChat();
  });

  // ── Send ────────────────────────────────────────────────────────────
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    showTyping();
    const delay = 650 + Math.random() * 350;
    setTimeout(() => {
      removeTyping();
      addBotMessage(getResponse(text));
    }, delay);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // ── Message helpers ─────────────────────────────────────────────────
  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg user';
    el.innerHTML = `<div class="chat-bubble">${escHtml(text)}</div>`;
    messages.appendChild(el);
    scrollBottom();
  }

  function addBotMessage(html) {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.innerHTML = `<div class="chat-bubble">${html}</div>`;
    messages.appendChild(el);
    scrollBottom();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg bot chat-typing';
    el.id = 'chat-typing';
    el.innerHTML = `<div class="chat-bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
    messages.appendChild(el);
    scrollBottom();
  }

  function removeTyping() {
    const t = document.getElementById('chat-typing');
    if (t) t.remove();
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Age parser — returns age in weeks, or null ──────────────────────
  function parseAgeWeeks(t) {
    const wm = t.match(/(\d+)\s*week/);
    if (wm) return parseInt(wm[1]);

    const mm = t.match(/(\d+)\s*month/);
    if (mm) return Math.round(parseInt(mm[1]) * 4.33);

    const ym = t.match(/(\d+)\s*(year|yr)/);
    if (ym) return parseInt(ym[1]) * 52;

    // Bare number — treat as weeks if ≤ 52, years if > 52 (unlikely bare input)
    const nm = t.match(/^(\d+)$/);
    if (nm) return parseInt(nm[1]);

    return null;
  }

  // ── Rule-based responses ────────────────────────────────────────────
  function getResponse(userText) {
    const t = userText.toLowerCase();

    // ── Greetings ──
    if (/\b(hi|hello|hey|howdy|g'?day|yo)\b/.test(t)) {
      return "Hey there! 🐾 How old is your dog? I'll point you straight to the right course!";
    }

    // ── Farewell ──
    if (/\b(bye|goodbye|see ya|seeya|later|cheers)\b/.test(t)) {
      return "See you at training! 🐾 Feel free to pop back any time.";
    }

    // ── Thanks ──
    if (/\b(thank|thanks|ta|appreciate)\b/.test(t)) {
      return "You're welcome! Anything else I can help with? 🐾";
    }

    // ── Age / stage detection (core recommendation flow) ──────────────
    const ageWeeks = parseAgeWeeks(t);

    if (ageWeeks !== null) {
      if (ageWeeks < 8) {
        return (
          "Your pup is still very young! 🐾 We recommend waiting until they hit <strong>8 weeks</strong>.\n\n" +
          "Once they're ready, our Puppy Preschool will be perfect for them.\n\n" +
          courseBtn("View Puppy Preschool", "course-detail.html")
        );
      }
      if (ageWeeks <= 16) {
        return (
          "That's the perfect age for our <strong>Puppy Preschool</strong>! 🐶\n\n" +
          "Designed for puppies 8–12 weeks, it covers socialisation, basic commands, and building great habits from day one.\n\n" +
          courseBtn("View Puppy Preschool", "course-detail.html")
        );
      }
      if (ageWeeks <= 78) { // up to ~18 months
        return (
          "At that age your dog is ready to build solid foundations with our <strong>Family Dog Training 1</strong>! 🐕\n\n" +
          "Small, structured classes using positive, reward-based methods. Great starting point for any dog.\n\n" +
          courseBtn("View Family Dog Training 1", "family-dog-training-1.html")
        );
      }
      // 18+ months
      return (
        "With an older dog, <strong>Family Dog Training 1</strong> is a great starting point — or if they've had prior training, <strong>Family Dog Training 2</strong> may suit them better.\n\n" +
        "Have they had any formal training before?"
      );
    }

    // ── "I don't know" / rescue / not sure ──
    if (/\b(don'?t know|not sure|unsure|rescue|unknown|adult)\b/.test(t)) {
      return (
        "No worries! 🐾 For adult dogs or rescues where the history is unclear, we'd normally recommend starting with <strong>Family Dog Training 1</strong> to build a solid foundation.\n\n" +
        courseBtn("View Family Dog Training 1", "family-dog-training-1.html")
      );
    }

    // ── "Already done FDT1" / has prior training ──
    if (/\b(done|completed|finished|already|level 1|fdt1)\b/.test(t) && /\b(training|course|class|level)\b/.test(t)) {
      return (
        "Awesome — sounds like they're ready to level up with <strong>Family Dog Training 2</strong>! 🦮\n\n" +
        "It builds on FDT1 with advanced commands, better focus, and refined behaviour in challenging environments.\n\n" +
        courseBtn("Book Family Dog Training 2", "booking.html")
      );
    }

    // ── Booking ──
    if (/\b(book|booking|reserve|schedule|session|enrol|enroll)\b/.test(t)) {
      return (
        "To book a session:\n" +
        "1. Visit a course page\n" +
        "2. Tap <strong>Choose Date &amp; Time</strong>\n" +
        "3. Pick a date on the calendar\n" +
        "4. Select a time slot\n" +
        "5. Add to cart and checkout!\n\n" +
        "Not sure which course? Just tell me how old your dog is 🐾"
      );
    }

    // ── Cart / checkout ──
    if (/\b(cart|checkout|pay|payment|purchase|buy)\b/.test(t)) {
      return "Once you've picked a date and time, tap <strong>Add to Cart</strong>. Then click the 🛒 icon at the top to review and complete your checkout!";
    }

    // ── Courses — general list ──
    if (/\b(course|class|program|what.*offer|all course)\b/.test(t)) {
      return (
        "We offer three courses:\n\n" +
        `🐶 <a href="${pg('course-detail.html')}" class="chat-link">Puppy Preschool</a> — $100 · puppies 8–12 weeks\n` +
        `🐕 <a href="${pg('family-dog-training-1.html')}" class="chat-link">Family Dog Training 1</a> — $120 · everyday manners\n` +
        "🦮 Family Dog Training 2 — advanced skills\n\n" +
        "Tell me your dog's age and I'll recommend the right one!"
      );
    }

    // ── Puppy Preschool ──
    if (/\b(puppy|preschool)\b/.test(t)) {
      return (
        "🐶 <strong>Puppy Preschool</strong> is perfect for puppies aged 8–12 weeks. We focus on socialisation, basic commands, and building great habits from day one.\n\n" +
        "You'll need:\n✓ Proof of first vaccination\n✓ Lots of small treats\n✓ Closed-in shoes\n✓ Positive attitude!\n\n" +
        courseBtn("View Puppy Preschool", "course-detail.html")
      );
    }

    // ── Family Dog Training 1 ──
    if (/family.*1|training.*1|fdt\s*1|level 1|beginner/.test(t)) {
      return (
        "🐕 <strong>Family Dog Training 1</strong> builds strong foundations using reward-based training. Small, structured classes for real-world situations.\n\n" +
        "Covers: sit, recall, loose-lead walking, calm greetings, and more!\n\n" +
        courseBtn("View Family Dog Training 1", "family-dog-training-1.html")
      );
    }

    // ── Family Dog Training 2 ──
    if (/family.*2|training.*2|fdt\s*2|level 2|advanced|intermediate/.test(t)) {
      return (
        "🦮 <strong>Family Dog Training 2</strong> takes skills to the next level — advanced commands, better focus, and refined behaviour in challenging environments.\n\n" +
        courseBtn("Book a Session", "booking.html")
      );
    }

    // ── Price ──
    if (/\b(price|cost|how much|fee|charge|\$|dollar)\b/.test(t)) {
      return "Our sessions are <strong>$100</strong> for Puppy Preschool and <strong>$120</strong> for Family Dog Training — each covering a full session with an expert positive-reinforcement trainer!";
    }

    // ── Location ──
    if (/\b(where|location|address|find us|map|oxley|direction|suburb)\b/.test(t)) {
      return "📍 We're at:\n<strong>15 Englefield Rd, Oxley QLD 4075</strong>\n\nThere's a Google Maps link on our booking page!";
    }

    // ── Hours ──
    if (/\b(hour|open|when|time|day|monday|sunday|weekend|8am|8pm)\b/.test(t)) {
      return "🕐 We're open <strong>Monday to Sunday, 8AM – 8PM</strong>. Plenty of slots to find one that suits you!";
    }

    // ── Club rules ──
    if (/\b(rule|regulation|policy|allowed|behaviour|aggressive)\b/.test(t)) {
      return "Our club rules:\n\n✓ Positive training only — no harsh treatment\n✓ Clean up after your dog\n✓ Don't approach other dogs without permission\n✓ Keep dogs on lead unless instructed\n✓ Always close the gate behind you";
    }

    // ── Contact ──
    if (/\b(contact|email|phone|call|reach|facebook|social)\b/.test(t)) {
      return "You can reach us at:\n📧 brisbanedogtrainingclub.com\n📞 +61 413 223 190\n📘 <strong>facebook.com/bdtc1</strong>";
    }

    // ── What to bring ──
    if (/\b(bring|need|require|requirement|prepare|what to)\b/.test(t)) {
      return "For any class, bring:\n✓ Lots of small, high-value treats\n✓ Closed-in shoes\n✓ Flat collar and lead\n✓ Proof of vaccination (puppies)\n✓ A positive attitude! 🐾";
    }

    // ── Fallback ──
    return (
      "I'm not sure about that one! I can help with:\n\n" +
      "🐶 <strong>Course recommendations</strong> — just tell me your dog's age\n" +
      "📅 <strong>How to book</strong> a session\n" +
      "💰 <strong>Pricing</strong> and what to bring\n" +
      "📍 <strong>Location</strong> and opening hours\n\n" +
      "What would you like to know?"
    );
  }
})();
