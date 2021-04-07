/*===== SWIPER CAROUSEL =====*/ 
const mySwiper = new Swiper('.hobby__container', {
    spaceBetween: 16,
    loop: true,
    grabCursor: true,

  
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints:{
        640:{
            slidesPerView: 2,
        },
        1024:{
            slidesPerView: 3,
        }
    }
});