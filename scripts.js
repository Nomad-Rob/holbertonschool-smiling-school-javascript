// Author: Rob Farley
// used for the smile school project
// used chatGPT to generate docs

$(document).ready(function () {
  
  // Function to display the quotes in the carousel
  /**
   * Displays quotes in a carousel based on the provided data.
   * 
   * @param {Array} data - The array of quotes data.
   */
  function displayQuotes(data) {
    let classItem = "";
    // Loop through the data and create the carousel items
    for (let i in data) {
      // Set the class of the first item to active
      classItem = i == 0 ? "carousel-item active" : "carousel-item";
      // Create the carousel item
      let $carouselItem = $(`
        <blockquote class="${classItem}">
        <div class="row mx-auto align-items-center">
            <div class="col-11 col-sm-2 col-lg-2 offset-lg-1 text-center">
            <img
                src="${data[i].pic_url}"
                class="d-block align-self-center"
                alt="Carousel Pic ${i}"
            />
            </div>
            <div class="col-12 col-sm-6 offset-sm-2 col-lg-8 offset-lg-0">
            <div class="quote-text">
                <p class="text-white pr-md-4 pr-lg-5">
                ${data[i].text}
                </p>
                <h4 class="text-white font-weight-bold">${data[i].name}</h4>
                <span class="text-white">${data[i].title}</span>
            </div>
            </div>
        </div>
        </blockquote>;
    `);
      // Append the carousel item to the carousel
      $("#carousel-items").append($carouselItem);
    }
  }

  // Modifies to logic of bootstrap carousel in order for
  /**
   * Slides the carousel items in a specified container.
   * 
   * @param {string} id - The ID of the container element.
   */
  function slideOne(id) {
    // Iterate through each carousel item
    $(`#${id} .carousel-item`).each(function () {
      let minPerSlide = 4;
      let next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(":first");
      }
      next.children(":first-child").clone().appendTo($(this));

      for (let i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(":first");
        }

        next.children(":first-child").clone().appendTo($(this));
      }
          });
        }

        // Function to create the card using bootstrap with the data from the API
        /**
         * Creates a card element based on the provided card data.
         *
         * @param {Object} cardData - The data used to populate the card.
         * @returns {string} The HTML string representing the card element.
         */
        function createCard(cardData) {
          let starState = "";
          let starString = "";
          let star;
          for (let i = 1; i <= 5; i++) {
            if (i <= cardData.star) {
              starState = "images/star_on.png";
            } else {
              starState = "images/star_off.png";
            }

            star = `<img src="${starState}" alt="star on" width="16px" />`;
            starString += i == 1 ? star : "\n" + star;
          }

          let card = `
          <div class="card">
            <img
              src="${cardData.thumb_url}"
              class="card-img-top"
              alt="Video thumbnail"
            />
            <div class="card-img-overlay text-center">
              <img
                src="images/play.png"
                alt="Play"
                width="66px"
                class="align-self-center play-overlay"
              />
            </div>
            <div class="card-body">
              <h5 class="card-title font-weight-bold">${cardData.title}</h5>
              <p class="card-text text-muted">
                  ${cardData["sub-title"]}
              </p>
              <div class="creator d-flex align-items-center">
                <img
                  src="${cardData.author_pic_url}"
                  alt="Creator of Video"
                  width="32px"
                  class="rounded-circle"
                />
                <h6 class="pl-3 m-0 main-color">${cardData.author}</h6>
              </div>
              <div class="info pt-3 d-flex justify-content-between">
                <div class="rating">
                  ${starString}
                </div>
                <span class="main-color">${cardData.duration}</span>
              </div>
            </div>
          </div>
          `;

          return card;
        }

        // Creates cards and attaches them to the DOM in order to display
        /**
         * Displays popular items on the carousel.
         * 
         * @param {Array} data - The data containing the popular items.
         */
        function displayPopularItems(data) {
          let classItem = "";
          for (let i in data) {
            classItem = i == 0 ? "carousel-item active" : "carousel-item";
            let card = createCard(data[i]);
            let $carouselItem = $(`
            <div class="${classItem}">
              <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                ${card}
                </div>
            </div>
                `);
            $("#popular-items").append($carouselItem);
          }

          slideOne("popular");
        }

        // Creates cards and attaches them to the DOM in order to display
        /**
         * Displays the latest videos on the webpage.
         * 
         * @param {Array} data - The array of video data.
         */
        function displayLatestVideos(data) {
          let classItem = "";
          for (let i in data) {
            classItem = i == 0 ? "carousel-item active" : "carousel-item";
            let card = createCard(data[i]);
            let $carouselItem = $(`
            <div class="${classItem}">
              <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
                ${card}
                </div>
            </div>
                `);
            $("#latest-videos-items").append($carouselItem);
          }

          slideOne("latest-videos");
        }

        // Function to retreve search parameters from the DOM
        /**
         * Returns an object containing search parameters.
         * @returns {Object} The search object with the following properties:
         * - q: The value of the keywords input field.
         * - topic: The lowercase text of the topic element.
         * - sort: The lowercase text of the sort-by element with spaces replaced by underscores.
         */
        function getSearchObject() {
          let searchObj = {
            q: $("#keywords-input").val(),
            topic: $("#topic").text().toLowerCase(),
            sort: $("#sort-by").text().toLowerCase().replace(" ", "_"),
          };

          return searchObj;
        }

        // Creates cards and attaches them to the DOM in order to display
        /**
         * Performs a search request and displays the results.
         */
        function performSearchRequest() {
          let searchObj = getSearchObject();
          let $results = $("#results-items");
          $results.empty();
          $("#results-count").text("");

          for (let request of courseRequests) {
            requestData(request.url, displayResults, request.id, searchObj);
          }
        }

        // Returns title to original condition with corresponding
        /**
         * Parses the title by capitalizing the first letter and replacing underscores with spaces.
         * @param {string} title - The title to be parsed.
         * @returns {string} - The parsed title.
         */
        function parseTitle(title) {
          if (title) {
            title = title.charAt(0).toUpperCase() + title.slice(1).replace("_", " ");
          }
          return title;
        }

        // Creates the dropdown menu with the corresponding options from the api
        /**
         * Displays a dropdown menu with items from a list.
         * 
         * @param {Array} list - The list of items to display in the dropdown menu.
         * @param {jQuery} $DOMElement - The jQuery object representing the DOM element where the dropdown menu will be appended.
         * @param {jQuery} $titleElement - The jQuery object representing the DOM element where the selected item's title will be displayed.
         */
        function displayDropdownMenu(list, $DOMElement, $titleElement) {
          if (list.length) {
            for (let l of list) {
              let s = parseTitle(l);
              let $item = $(`
                <a class="dropdown-item" href="#">${s}</a>
              `);
              $item.click(function () {
                $titleElement.text(s);
                performSearchRequest();
              });
              $DOMElement.append($item);
            }
          }
        }

        // Displays the whole search section in dom
        /**
         * Displays the search results based on the provided data.
         * 
         * @param {Object} data - The data containing the search information.
         */
        function displaySearchResults(data) {
          let title;
          let topics = data.topics;
          let sorts = data.sorts;

          let $topicDropdown = $("#topic-dropdown");
          let $topicTitle = $("#topic");
          title = parseTitle(data.topic);
          $topicTitle.text(title);
          displayDropdownMenu(topics, $topicDropdown, $topicTitle);

          let $sortDropdown = $("#sort-dropdown");
          let $sortTitle = $("#sort-by");
          title = parseTitle(data.sort);
          $sortTitle.text(title);
          displayDropdownMenu(sorts, $sortDropdown, $sortTitle);

          let $keywordsInput = $("#keywords-input");

          $keywordsInput.val(data.q);

          $keywordsInput.change(function () {
            performSearchRequest();
          });
        }

        // Shows all of the videos, obtained after request to API, in DOM
        /**
         * Display the results of the data.
         * 
         * @param {Object} data - The data containing the courses.
         */
        function displayResults(data) {
          let courses = data.courses;
          if (!courses) return;
          let $results = $("#results-items");

          let count = Object.keys(courses).length;
          $("#results-count").text(`${count} videos`);

          if (Object.keys(courses).length) {
            for (let c of courses) {
              let card = createCard(c);
              let $resultItem = $(`
            <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
              ${card}
            </div>
           `);
              $results.append($resultItem);
            }
          }
        }

        // Calls the needed functions in order to correctly display
        /**
         * Displays the search results and search bar on the page.
         * 
         * @param {object} data - The data containing the search results.
         */
        function displaySearchResultsAndBar(data) {
          displayResults(data);
          displaySearchResults(data);

        }

        
        // Function to show loader when waiting for API response
        /**
         * Displays or hides a loader element based on the value of the 'active' parameter.
         * @param {boolean} active - Indicates whether the loader should be displayed (true) or hidden (false).
         * @param {string} id - The ID of the element where the loader should be appended or removed.
         */
        function displayLoader(active, id) {
          if (active) {
            let $loader = $(`<div class="loader" id="loader-${id}"></div>`);
            $(`#${id}`).append($loader);
          } else {
            let $loader = $(`#loader-${id}`);
            $loader.remove();
          }
        }


        // Function to make GET request to API
        /**
         * Sends a GET request to the specified URL and handles the response using the provided callback function.
         * @param {string} url - The URL to send the request to.
         * @param {function} callback - The callback function to handle the response.
         * @param {string} id - The ID of the element to display the loader for.
         * @param {object} [data={}] - Optional data to include in the request.
         */
        function requestData(url, callback, id, data = {}) {
          displayLoader(true, id);
          $.ajax({
            url: url,
            type: "GET",
            data: data,
            headers: { "Content-Type": "application/json" },
            success: function (response) {
              displayLoader(false, id);
              callback(response);
            },
            error: function (error) {
              alert(`Error Getting Data from ${url}`);
            },
          });
        }

        // PERFORM DYNAMIC CONTENT REQUESTS
        /**
         * Array of objects representing the requests for the homepage.
         * Each object contains a URL, a function to handle the response, and an ID for the HTML element to update.
         * @type {Array<Object>}
         */
        let homepageRequests = [
          {
            url: "https://smileschool-api.hbtn.info/quotes",
            func: displayQuotes,
            id: "carousel-items",
          },
          {
            url: "https://smileschool-api.hbtn.info/popular-tutorials",
            func: displayPopularItems,
            id: "popular-items",
          },
          {
            url: "https://smileschool-api.hbtn.info/latest-videos",
            func: displayLatestVideos,
            id: "latest-videos-items",
          },
        ];

        /**
         * Array of objects representing pricing requests.
         * @type {Array<Object>}
         */
        let pricingRequests = [
          {
            url: "https://smileschool-api.hbtn.info/quotes",
            func: displayQuotes,
            id: "carousel-items",
          },
        ];

        /**
         * Array of objects representing requests for courses.
         * @typedef {Object} CourseRequest
         * @property {string} url - The URL for the request.
         * @property {Function} func - The function to be executed for the request.
         * @property {string} id - The ID of the element to display the results.
         */
        let courseRequests = [
          {
            url: "https://smileschool-api.hbtn.info/courses",
            func: displaySearchResultsAndBar,
            id: "results-items",
          },
        ];
        
        // END OF DYNAMIC CONTENT REQUESTS
        let $homepage = $("#homepage");
        let $pricing = $("#pricing");
        let $courses = $("#courses");

        // Determine which page is being displayed
        let requestObject;
        
        if (Object.keys($homepage).length) requestObject = homepageRequests;
        else if (Object.keys($pricing).length) requestObject = pricingRequests;
        else if (Object.keys($courses).length) requestObject = courseRequests;
        
        // Make requests to API for dynamic content
        for (let request of requestObject) {
          requestData(request.url, request.func, request.id);
        }
      });

      // COMPLETE!!!
      