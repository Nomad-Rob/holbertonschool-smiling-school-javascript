$(document).ready(function() {
  const path = window.location.pathname;
  if (path === "/") {
    // Home Page
    generate_quotes();
  }})
  
  function generate_quotes() {
    const carousel = $('#testimonial');
    const loader = $('#testimonialLoader');
  
    $.ajax({
      url: 'https://smileschool-api.hbtn.info/quotes',
      method: 'GET',
      success: function(data) {
        const itemsHTML = data.map((quote, index) => {
          const isActive = index === 0 ? 'active' : '';
          return `
            <div class='carousel-item px-5 ${isActive}'>
              <div class='d-flex flex-column align-items-center flex-sm-row carousel-helper m-md-5'>
                <img class='rounded-circle carousel-avatar ml-sm-5' src='${quote.pic_url}' width='210px'>
                <div class='mx-sm-5'>
                  <p class='px-2 mt-4 mt-md-0'>${quote.text}</p>
                  <p class='font-weight-bold pl-2 pt-2 mb-1 align-self-start'>${quote.name}</p>
                  <cite class='pl-2 align-self-start'>${quote.title}</cite>
                </div>
              </div>
            </div>`;
        }).join('');
  
        carousel.html(itemsHTML);
        loader.remove();
        carousel.removeClass('d-none');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching quotes:', textStatus, errorThrown);
        // Optionally, update the UI to inform the user
      }
    });
  }  
