/* Doggo AI — floating chat widget */

(function () {
  const OPENAI_API_KEY = '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'
  const SYSTEM_PROMPT = `
You are Buddy, the friendly AI assistant for Brisbane Dog Training Club (BDTC).
You speak in a warm, casual Australian tone. Keep replies concise (3–6 sentences max).
Use plain text only — no markdown, no asterisks. Use line breaks for lists.

KEY FACTS — only use these, do not make anything up:

COURSES:
- Puppy Preschool: $100, for puppies aged 8–12 weeks. Covers socialisation, basic commands, good habits. Requires proof of first vaccination, small treats, closed-in shoes.
- Family Dog Training 1 (FDT1): $120, for dogs roughly 3 months to 18 months or untrained adults. Covers sit, recall, loose-lead walking, calm greetings.
- Family Dog Training 2 (FDT2): for dogs that have completed FDT1. Advanced commands, focus, refined behaviour in challenging environments.

COURSE RECOMMENDATION RULES (follow these strictly):
- Under 8 weeks → too young, recommend Puppy Preschool once they turn 8 weeks
- 8 weeks to 12 weeks → Puppy Preschool
- 3 months to 18 months → Family Dog Training 1
- Over 18 months with no prior training → Family Dog Training 1
- Over 18 months with prior training / completed FDT1 → Family Dog Training 2
- Unknown age / rescue dog → Family Dog Training 1 to start

BOOKING PROCESS:
1. Go to a course page
2. Click "Choose Date & Time"
3. Pick an available date on the calendar
4. Select a time slot
5. Add to cart, then click the cart icon at the top to checkout

LOCATION: 15 Englefield Rd, Oxley QLD 4075
HOURS: Monday to Sunday, 8AM – 8PM
CONTACT: brisbanedogtrainingclub.com | +61 413 223 190 | facebook.com/bdtc1

CLUB RULES:
- Positive training only — no harsh treatment
- Clean up after your dog
- Don't approach other dogs without permission
- Keep dogs on lead unless instructed
- Always close the gate behind you

WHAT TO BRING (all classes): small high-value treats, closed-in shoes, flat collar and lead, vaccination proof (puppies), positive attitude.

If the user asks something outside these topics, say you can help with course recommendations, booking, pricing, location, or club rules — and ask what they'd like to know.
Always end your first message by asking how old the user's dog is if they haven't mentioned it.
`.trim();

  const conversationHistory = [];

  // ── Path helpers ────────────────────────────────────────────────────
  const base = window.location.pathname.includes('/pages/') ? '../' : '';

  function pg(page) {
    return window.location.pathname.includes('/pages/') ? page : `pages/${page}`;
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

  let isOpen  = false;
  let isBusy  = false;

  // ── Open / close ────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (messages.children.length === 0) {
      addBotMessage(
        "G'day! 🐾 I'm Buddy, Brisbane Dog Training Club's AI assistant!\n\n" +
        "I can recommend the perfect course for your dog or walk you through the booking process.\n\n" +
        "To get started — how old is your dog? (e.g. \"10 weeks\", \"6 months\", \"2 years\")"
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
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isBusy) return;
    isBusy = true;
    sendBtn.disabled = true;

    addUserMessage(text);
    input.value = '';
    showTyping();

    try {
      const reply = await getAIResponse(text);
      removeTyping();
      addBotMessage(reply);
    } catch (err) {
      removeTyping();
      addBotMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment! 🐾");
    }

    isBusy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // ── OpenAI API call ─────────────────────────────────────────────────
  async function getAIResponse(userText) {
    conversationHistory.push({ role: 'user', content: userText });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory
        ],
        max_tokens: 350,
        temperature: 0.7
      })
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    const reply = data.choices[0].message.content.trim();
    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;
  }

  // ── Message helpers ─────────────────────────────────────────────────
  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg user';
    el.innerHTML = `<div class="chat-bubble">${escHtml(text)}</div>`;
    messages.appendChild(el);
    scrollBottom();
  }

  function addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.innerHTML = `<div class="chat-bubble">${escHtml(text).replace(/\n/g, '<br>')}</div>`;
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
})();
