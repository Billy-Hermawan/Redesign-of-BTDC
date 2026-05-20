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

function initCarousel(trackSelector, dotSelector, prevSelector, nextSelector, cardWidth, delay) {
  const track = document.querySelector(trackSelector);
  if (!track) return;

  const dots = document.querySelectorAll(dotSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  const total = track.querySelectorAll('.testimonial-card, .req-card').length;
  let current = 0;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), delay);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  goTo(0);
  startAuto();
}

// init testimonials
initCarousel('.testimonials-track', '.testimonial-dot', '.testimonial-arrow-left', '.testimonial-arrow-right', 260, 4000);

// init requirements
initCarousel('.requirements-track', '.req-dot', '.req-arrow-left', '.req-arrow-right', 260, 5000);

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
