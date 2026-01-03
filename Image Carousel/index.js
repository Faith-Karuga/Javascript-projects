const slides = document.getElementById('slides');
    const slideCount = slides.children.length;
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const indicatorsContainer = document.getElementById('indicators');

    let currentIndex = 0;
    let interval;

    // Create indicators
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('indicator');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    }

    const indicators = document.querySelectorAll('.indicator');

    function updateCarousel() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      indicators.forEach(dot => dot.classList.remove('active'));
      indicators[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
      resetAutoSlide();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateCarousel();
    }

    function startAutoSlide() {
      interval = setInterval(nextSlide, 3000);
    }

    function resetAutoSlide() {
      clearInterval(interval);
      startAutoSlide();
    }

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    startAutoSlide();