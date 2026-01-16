const slides = document.getElementById('slides');
    const slideCount = slides.children.length;
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const indicatorsContainer = document.getElementById('indicators');
    const thumbnailsContainer = document.getElementById('thumbnails');

    let currentIndex = 0;
    let interval;
    let isAutoPlayPaused = false;

    // Create indicators
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('indicator');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    }

    const indicators = document.querySelectorAll('.indicator');

    // Create thumbnails
    for (let i = 0; i < slideCount; i++) {
      const thumbnail = document.createElement('img');
      thumbnail.src = `https://picsum.photos/100/100?${i + 1}`;
      thumbnail.alt = `Thumbnail ${i + 1}`;
      thumbnail.classList.add('thumbnail');
      if (i === 0) thumbnail.classList.add('active-thumb');
      thumbnail.addEventListener('click', () => {
        pauseAutoPlay();
        goToSlide(i);
      });
      thumbnailsContainer.appendChild(thumbnail);
    }

    const thumbnails = document.querySelectorAll('.thumbnail');

    function updateCarousel() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      indicators.forEach(dot => dot.classList.remove('active'));
      indicators[currentIndex].classList.add('active');
      thumbnails.forEach(thumb => thumb.classList.remove('active-thumb'));
      thumbnails[currentIndex].classList.add('active-thumb');
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function pauseAutoPlay() {
      isAutoPlayPaused = true;
      clearInterval(interval);
    }

    function resumeAutoPlay() {
      if (isAutoPlayPaused) {
        isAutoPlayPaused = false;
        startAutoSlide();
      }
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
      if (!isAutoPlayPaused) {
        clearInterval(interval);
        startAutoSlide();
      }
    }

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resumeAutoPlay();
      startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resumeAutoPlay();
      startAutoSlide();
    });

    startAutoSlide();