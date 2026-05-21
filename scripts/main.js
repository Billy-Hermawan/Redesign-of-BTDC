// --- Cart Badge ---
(function () {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.add('visible');
    }
})();

// --- Hamburger Menu + Smooth Scroll ---
const hamburger = document.querySelector('.header-hamburger');
const mobileMenu = document.querySelector('.header-mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  });
});

// --- Hero Carousel ---
const heroBg = document.querySelector(".hero-bg");
const heroDots = document.querySelectorAll(".hero-dot");

const heroImages = [
  "assets/images/top-dog-1.png",
  "assets/images/top-dog-2.png",
  "assets/images/top-dog-3.png"
];

let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  currentSlide = index;
  heroBg.classList.add("is-fading");

  setTimeout(() => {
    heroBg.style.backgroundImage = `url("${heroImages[currentSlide]}")`;

    heroDots.forEach((dot) => dot.classList.remove("active"));
    heroDots[currentSlide].classList.add("active");

    heroBg.classList.remove("is-fading");
  }, 250);
}

function nextSlide() {
  const nextIndex = (currentSlide + 1) % heroImages.length;
  showSlide(nextIndex);
}

function startCarousel() {
  slideTimer = setInterval(nextSlide, 4000);
}

function resetCarouselTimer() {
  clearInterval(slideTimer);
  startCarousel();
}

if (heroBg) {
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetCarouselTimer();
    });
  });

  startCarousel();
}


// init testimonials (responsive: 1-up mobile, 3-up desktop)
(function () {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const dots = Array.from(document.querySelectorAll('.testimonial-dot'));
  const prevBtn = document.querySelector('.testimonial-arrow-left');
  const nextBtn = document.querySelector('.testimonial-arrow-right');
  const TOTAL = track.querySelectorAll('.testimonial-card').length;
  let current = 0;
  let autoTimer;

  function isDesktop() { return window.innerWidth >= 1440; }
  function cardWidth() { return isDesktop() ? 369 + 48 : 260; }
  function cardsPerView() { return isDesktop() ? 3 : 1; }
  function totalSteps() { return TOTAL - cardsPerView() + 1; }

  function updateDots() {
    const steps = totalSteps();
    dots.forEach((dot, i) => { dot.style.display = i < steps ? '' : 'none'; });
  }

  function goTo(index) {
    const steps = totalSteps();
    current = ((index % steps) + steps) % steps;
    track.style.transform = `translateX(-${current * cardWidth()}px)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));
  window.addEventListener('resize', () => { updateDots(); goTo(0); });

  updateDots();
  goTo(0);
  startAuto();
})();

// init requirements (responsive: 1-up mobile, 3-up desktop)
(function () {
  const track = document.querySelector('.requirements-track');
  if (!track) return;

  const dots = Array.from(document.querySelectorAll('.req-dot'));
  const prevBtn = document.querySelector('.req-arrow-left');
  const nextBtn = document.querySelector('.req-arrow-right');
  const TOTAL = track.querySelectorAll('.req-card').length;
  let current = 0;
  let autoTimer;

  function isDesktop() { return window.innerWidth >= 1440; }
  function cardWidth() { return isDesktop() ? 324 : 260; } // 300px card + 24px gap
  function cardsPerView() { return isDesktop() ? 3 : 1; }
  function totalSteps() { return TOTAL - cardsPerView() + 1; }

  function updateDots() {
    const steps = totalSteps();
    dots.forEach((dot, i) => { dot.style.display = i < steps ? '' : 'none'; });
  }

  function goTo(index) {
    const steps = totalSteps();
    current = ((index % steps) + steps) % steps;
    track.style.transform = `translateX(-${current * cardWidth()}px)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));
  window.addEventListener('resize', () => { updateDots(); goTo(0); });

  updateDots();
  goTo(0);
  startAuto();
})();

// --- FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all
    faqItems.forEach(i => i.classList.remove('open'));
    // open clicked one if it was closed
    if (!isOpen) item.classList.add('open');
  });
});
