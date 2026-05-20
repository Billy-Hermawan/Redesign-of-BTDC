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

heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    resetCarouselTimer();
  });
});

startCarousel();
// --- Testimonials Carousel ---
const track = document.querySelector('.testimonials-track');
const testimonialsDots = document.querySelectorAll('.testimonial-dot');
const prevBtn = document.querySelector('.testimonial-arrow-left');
const nextBtn = document.querySelector('.testimonial-arrow-right');
const allCards = document.querySelectorAll('.testimonials-track .testimonial-card');
const total = allCards.length;

let current = 0;
let autoTimer;
const DELAY = 4000;

function getCardsPerView() {
  return window.innerWidth >= 1440 ? 3 : 1;
}

function getCardWidth() {
  return window.innerWidth >= 1440 ? 369 + 48 : 260;
}

function getTotalSteps() {
  return Math.ceil(total / getCardsPerView());
}

function goTo(index) {
  const steps = getTotalSteps();
  current = (index + steps) % steps;
  track.style.transform = `translateX(-${current * getCardsPerView() * getCardWidth()}px)`;
  testimonialsDots.forEach(d => d.classList.remove('active'));
  testimonialsDots[current].classList.add('active');
}

function updateDots() {
  const steps = getTotalSteps();
  testimonialsDots.forEach((dot, i) => {
    dot.style.display = i < steps ? 'block' : 'none';
  });
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), DELAY);
}

function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}

nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
testimonialsDots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

window.addEventListener('resize', () => {
  updateDots();
  goTo(0);
});

updateDots();
startAuto();

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