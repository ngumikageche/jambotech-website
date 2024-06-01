console.log("setup complete")
function toggleTextVisibility() {
    var truncatedText = document.getElementById('truncated-text');
    var fullText = document.getElementById('full-text');
    var readMoreButton = document.querySelector('button');

    if (truncatedText.style.display === 'none') {
        // If truncated text is hidden, show it and hide the full text
        truncatedText.style.display = 'inline';
        fullText.style.display = 'none';
        readMoreButton.innerText = 'Read more';
    } else {
        // If truncated text is visible, hide it and show the full text
        truncatedText.style.display = 'none';
        fullText.style.display = 'inline';
        readMoreButton.innerText = 'Read less';
    }
}

var currentPage = 1;
var totalPages = 3; // Replace with the actual total number of pages

 // Set a debounce delay (in milliseconds)
 const debounceDelay = 300; // Adjust as needed

 let debounceTimer;

 // Attach input event listener to the search input
 $('#searchInput').on('input', function () {
     clearTimeout(debounceTimer);

     // Set a new timer to trigger search after the debounce delay
     debounceTimer = setTimeout(function () {
         // Execute search function
         searchProducts();
     }, debounceDelay);
 });

function searchProducts() {
    var searchQuery = $('#searchInput').val();
    
    if (searchQuery.trim() === "") {
        // If the search query is empty, you can handle this case as needed
        // For example, you might want to display a message or take other actions
        // console.log("Search query is empty");
        return;
    }

    showLoadingSpinner();
    getProductSearch(searchQuery);
}

    // Add this script in your HTML or JS file
    $(document).ready(function () {
        $('.category_id-button').on('click', function () {
            // Remove 'active' class from all buttons
            $('.category_id-button').removeClass('active');
    
            // Add 'active' class to the clicked button
            $(this).addClass('active');
    
            // Retrieve the selected category_id
            var selectedCategory = $(this).data('category_id.id');
    
            // Call a function or perform actions based on the selected category_id
            // For example, you might want to load products for the selected category_id
            if (selectedCategory === 'all') {
                // Handle 'All' category_id separately
                showLoadingSpinner();
                getAllProducts();
            } else {
                showLoadingSpinner();
                getProducts(selectedCategory);
                
            }
        });
    });
    function getAllProducts() {
        // Fetch all products for the next page
        currentPage++;
        // Fetch all products for the next page
        $.get('127.0.0.1:5001/products', { page: currentPage }, function (data) {
            if (data && data.current_page !== undefined) {
                // Valid response structure
                currentPage = data.current_page;
                
                displayProducts(data.products, currentPage, data.total_pages, 'All');
                generatePaginationLinks2(currentPage, data.total_pages, 'All');
            } else {
                console.log('Invalid response structure:', data);
                // Handle invalid response structure, e.g., display a message to the user
                $('#productContainer').html('<div class="alert alert-danger" role="alert">Invalid response structure. Please try again.</div>');
            }
        })
        .fail(function () {
            console.log('Error fetching products.');
            // Handle AJAX request failure (e.g., network error)
            $('#productContainer').html('<div class="alert alert-danger" role="alert">Error fetching products. Please try again.</div>');
        });
    }

function showLoadingSpinner() {
    getAllProducts
    // Display a loading spinner or any visual indicator
    $('#productContainer').html('<div class="text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>');
}

// Add this script in your HTML or JS file
$(document).ready(function () {
    $('#mobileSearchIcon, #mobileSearchButton').click(function () {
        // Toggle the visibility of the search input on mobile
        $('#searchInput').toggleClass('d-none').focus();
    });
});
function handleSearchInput(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        // Execute search function when Enter key is pressed
        searchProducts();
    }
}

function getProductSearch(name, page) {
    page = page || 1;
    var requestData = { page: page, name: name };

    $.get('/get_products_by_name', requestData, function (data) {
        currentPage = data.current_page;
        displayProducts(data.products, currentPage, data.total_pages, '');
        generatePaginationLinks(currentPage, data.total_pages, '');
    })
    .fail(function () {
        // Handle AJAX request failure (e.g., network error)
        $('#productContainer').html('<div class="alert alert-danger" role="alert">Error fetching products. Please try again.</div>');
    });
}

function getProducts(category_id, page, search) {
    page = page || 1; // Set a default value if page is undefined
    var requestData = { page: page };

    if (search) {
        requestData.search = search;
    }

    $.get(`http://127.0.0.1:5001/products/${category_id}`, requestData, function (data) {
        currentPage = data.current_page;
        displayProducts(data.products, currentPage, data.total_pages, category_id);
        generatePaginationLinks(currentPage, data.total_pages, category_id);
    })
    .fail(function () {
        // Handle AJAX request failure (e.g., network error)
        $('#productContainer').html('<div class="alert alert-danger" role="alert">Error fetching products. Please try again.</div>');
    });
}




function displayProducts(products, currentPage, totalPages, category_id) {
    var productContainer = $('<div>').addClass('row gy-4 portfolio-container').attr('data-aos', 'fade-up').attr('data-aos-delay', '300');

    productContainer.empty(); // Clear existing content

    if (!Array.isArray(products) || products.length === 0) {
        // Handle the case where 'products' is not an array or empty
        productContainer.html('<div class="alert alert-warning" role="alert">No products available for this category_id.</div>');
        return;
    }

    products.forEach(function (product) {
        var colDiv = $('<div>').addClass('col-lg-4 col-md-6 portfolio-item filter-' + category_id);
        var imgElement = $('<img>').addClass('img-fluid').attr('src', product.image).attr('alt', product.name);
        var portfolioInfo = $('<div>').addClass('portfolio-info');

        var h4Title = $('<h4>').text(product.name);
        var pDescription = $('<p>').text(product.description);

        var previewLink = $('<a>').attr('href', product.image).attr('title', product.name).attr('data-gallery', 'portfolio-gallery-' + category_id).addClass('glightbox preview-link').html('<i class="bi bi-zoom-in"></i>');
        var detailsLink = $('<a>').attr('href', 'portfolio-details.html').attr('title', 'More Details').addClass('details-link').html('<i class="bi bi-link-45deg"></i>');

        portfolioInfo.append(h4Title, pDescription, previewLink, detailsLink);
        colDiv.append(imgElement, portfolioInfo);
        productContainer.append(colDiv);
    });

    // Append product container to the parent container
    $('#productContainer').html(productContainer);

    // Create pagination controls
    var paginationContainer = $('#pagination-container');
    paginationContainer.empty(); // Clear existing pagination

    generatePaginationLinks(currentPage, totalPages, category_id);
}


// Generate pagination links
function generatePaginationLinks(currentPage, totalPages, category_id) {
    var paginationContainer = $('#pagination-container');
    paginationContainer.empty();

    // Create "Previous" link
    var previousLink = $('<li>').addClass('page-item').addClass(currentPage === 1 ? 'disabled' : '');
    previousLink.append($('<a>').addClass('page-link').attr('href', '#').text('Previous'));
    paginationContainer.append(previousLink);

    // Create page links
    for (var i = 1; i <= totalPages; i++) {
        var pageLink = $('<a>').addClass('page-link').text(i).attr('href', '#');
        var pageItem = $('<li>').addClass('page-item').append(pageLink);

        if (i === currentPage) {
            pageItem.addClass('active');
        }

        // Use a closure to capture the current value of category_id and pageNumber
        (function (pageNumber) {
            pageLink.click(function () {
                if (category_id === '') {
                    // Use getAllProducts when viewing all products
                    getAllProducts(pageNumber);
                } else {
                    // Use getProducts for specific categories
                    getProducts(category_id, pageNumber);
                }
            });
        })(i);

        paginationContainer.append(pageItem);
    }

    // Create "Next" link
    var nextLink = $('<li>').addClass('page-item').addClass(currentPage === totalPages ? 'disabled' : '');
    nextLink.append($('<a>').addClass('page-link').attr('href', '#').text('Next'));
    paginationContainer.append(nextLink);
}
function generatePaginationLinks2(currentPage, totalPages, category_id) {
    var paginationContainer = $('#pagination-container');
    paginationContainer.empty();

    // Create "Previous" link
    var previousLink = $('<li>').addClass('page-item').addClass(currentPage === 1 ? 'disabled' : '');
    previousLink.append($('<a>').addClass('page-link').attr('href', '#').text('Previous'));
    paginationContainer.append(previousLink);

    // Create page links
    for (var i = 1; i <= totalPages; i++) {
        var pageLink = $('<a>').addClass('page-link').text(i).attr('href', '#');
        var pageItem = $('<li>').addClass('page-item').append(pageLink);

        if (i === currentPage) {
            pageItem.addClass('active');
        }

        // Attach click event to page link
        pageLink.click(function (pageNumber) {
            return function () {
                if (category_id === 'All') {
                    // Use getAllProducts when viewing all products
                    getAllProducts(pageNumber);
                } else {
                    // Use getProducts for specific categories
                    getProducts(category_id, pageNumber);
                }
            };
        }(i));

        paginationContainer.append(pageItem);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Remember scroll position when the page loads
    var scrollPosition = localStorage.getItem('scrollPosition') || 0;
    window.scrollTo(0, scrollPosition);

    // Save scroll position when leaving the page
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('scrollPosition', window.scrollY);
    });
});

//for category_id scroll
const items = document.querySelectorAll('.item');

items.forEach(item => {
    
    item.addEventListener('click', () => {
        // Remove background color from all items
        items.forEach(otherItem => {
            otherItem.style.borderBottomColor = ''; // Reset to default or remove this line if no default color
            otherItem.style.borderColor = '';
            otherItem.style.borderBottomWidth = '';
            otherItem.style.borderTopWidth = '';

        });

        // Apply background color to the clicked item
        item.style.borderBottomColor = '#141951';
        // item.style.borderColor =  '#141951';
        item.style.borderBottomWidth = '5px';
        item.style.borderTopWidth = '';
        
    });
});

