const heroBg = document.querySelector(".hero-bg");
const dots = document.querySelectorAll(".hero-dot");

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
    heroBg.style.backgroundImage = `
      url("${heroImages[currentSlide]}")
    `;

    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    dots[currentSlide].classList.add("active");

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

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    resetCarouselTimer();
  });
});

startCarousel();

/*
Things to make:
- Testimonial carousel
- FAQ accordion
*/