function createQuoteSlide({ pic_url, name, title, text }, isActive = false) {
  return `
    <div class="carousel-item ${isActive ? 'active' : ''}">
      <div class="row mx-auto align-items-center">
        <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
          <img src="${pic_url}" alt="Carousel Pic" class="d-block align-self-center">
        </div>
        <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
          <div class="quote-text">
            <p class="text-white">${text}</p>
            <h4 class="text-white font-weight-bold">${name}</h4>
            <span class="text-white">${title}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

$(document).ready(function () {
  const carouselInner = $('#carouselExampleControls .carousel-inner');
  const loader = $('.loader');
  loader.show();

  $.get("https://smileschool-api.hbtn.info/quotes", function (data) {
    loader.hide();
    carouselInner.empty();

    const slides = data.map((quote, index) => createQuoteSlide(quote, index === 0)).join('');
    carouselInner.append(slides);
  });
});
