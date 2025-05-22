

    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'flex' : 'none';
        dots[i].classList.toggle('active', i === index);
      });
      currentSlide = index;
    }
    function goToSlide(index) {
      showSlide(index);
    }
    setInterval(() => {
      let nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }, 5000);
    showSlide(0);