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
const total = document.querySelectorAll('.testimonials-track .testimonial-card').length;

let current = 0;
let autoTimer;
const DELAY = 4000;

function goTo(index) {
  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 260}px)`;
  testimonialsDots.forEach(d => d.classList.remove('active'));
  testimonialsDots[current].classList.add('active');
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

startAuto();

/*
Things to make:

- FAQ accordion
*/