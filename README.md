# Brisbane Dog Training Club — Website Redesign
**INFO20005 Assignment 3 | Billy Hermawan**

A full redesign of the Brisbane Dog Training Club website. Built from scratch using vanilla HTML, CSS, and JavaScript — no frameworks.

Live site: https://billy-hermawan.github.io/Redesign-of-BTDC/

---

## How to Run Locally

1. Clone or download the repository
2. Open the project folder in VS Code
3. Install the **Live Server** extension if you haven't already
4. Right-click `index.html` and select **Open with Live Server**
5. The site will open at `http://127.0.0.1:5500`

> Do not just double-click `index.html` to open it in a browser — some features rely on proper file serving and won't work correctly opened as a raw file.

---

## Doggo AI Chatbot — Setup Required

The chatbot uses the **OpenAI API (gpt-4o-mini)** and requires a valid API key to function.

The key is intentionally left as a placeholder in the committed code:

```js
const OPENAI_API_KEY = 'PASTE_YOUR_KEY_HERE';
```

### To enable the chatbot locally:
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Open `scripts/chatbot.js` and replace `PASTE_YOUR_KEY_HERE` with your key
4. **Do not commit the key to GitHub** — OpenAI automatically scans public repositories and revokes any exposed keys

### Why the chatbot doesn't work on the live site:
This is a known architectural limitation of static sites. A real API key cannot be safely stored in client-side JavaScript on a public repository. The proper solution requires a backend proxy server (e.g. Netlify Functions) to keep the key server-side. This is documented in the project report.

---

## Features

- Multi-page booking flow — browse courses, pick a date and time, checkout, confirmation
- Interactive calendar with available date and time slot selection
- Cart system using localStorage — persists across pages
- Checkout form with payment method toggle and field validation
- Doggo AI chatbot powered by OpenAI API
- First-visit tooltip to prompt chatbot discovery
- Smooth page transitions and hover animations on all interactive elements
- Fully responsive — mobile (390px) and desktop (1440px+)
- Auto-advancing hero carousel with fade transitions
- Testimonials and requirements carousels
- FAQ accordion
- Discount codes: `BDTC10` and `FREE`

---

## Project Structure

```
/
├── index.html                  # Home page
├── pages/
│   ├── booking.html            # Date and time selection
│   ├── checkout.html           # Cart and payment form
│   ├── confirmation.html       # Order summary
│   ├── course-detail.html      # Puppy Preschool
│   └── family-dog-training-1.html  # Family Dog Training 1
├── scripts/
│   ├── main.js                 # Shared — cart badge, nav, page transitions
│   ├── booking.js              # Calendar and cart logic
│   ├── chatbot.js              # Doggo AI widget and OpenAI API call
│   ├── checkout.js             # Cart rendering, validation, order saving
│   └── confirmation.js         # Order summary display
├── styles/
│   ├── main.css                # Global styles, colours, typography, transitions
│   ├── home.css                # Home page styles
│   ├── booking.css             # Booking page styles
│   ├── checkout.css            # Checkout page styles
│   ├── confirmation.css        # Confirmation page styles
│   ├── course-detail.css       # Shared course page styles
│   └── chatbot.css             # Chatbot widget styles
└── assets/
    ├── icons/                  # UI icons and logos
    └── images/                 # Photography and course imagery
```

---

## External Resources

| Resource | Purpose |
|---|---|
| Google Fonts — Playfair Display | Headings and display text |
| Google Fonts — Inter | Body copy, labels, navigation |
| OpenAI API (gpt-4o-mini) | Chatbot responses |

---

## Notes

- The site has two breakpoints: **390px** (mobile) and **1440px+** (desktop). Widths in between use the mobile layout.
- All cart and booking data is stored in `localStorage` — clearing browser storage will reset the cart.
- To test the chatbot tooltip again, open DevTools → Application → Local Storage → delete the `chatbot_seen` key and refresh.
- To test the checkout without a real booking, use the discount code `FREE` which bypasses payment validation.
