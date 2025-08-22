document.addEventListener('DOMContentLoaded', function () {
    try {
        const hamburger = document.getElementById('hamburger');
        const navbar = document.getElementById('navbar');

        // Debugging logs - only show in development mode (check URL for localhost)
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isDevelopment) {
            console.log('Hamburger:', hamburger);
            console.log('Navbar:', navbar);
        }

        if (hamburger && navbar) {
            hamburger.addEventListener('click', function () {
                navbar.classList.toggle('open');
            });
            
            if (isDevelopment) {
                console.log('Navbar is available');
            }
        } else {
            // Only log warnings if elements are expected but not found
            if (!hamburger && document.querySelector('.hamburger-menu')) {
                console.warn('Hamburger element not found by ID, but hamburger menu class exists');
            }
            if (!navbar && document.querySelector('.navbar')) {
                console.warn('Navbar element not found by ID, but navbar class exists');
            }
        }

        // Additional debugging for other elements - only check if they exist on the page
        const searchBar = document.querySelector('.search-bar');
        if (searchBar && isDevelopment) {
            console.log('Search Bar:', searchBar);
        }

    } catch (error) {
        console.error('Error in app.js initialization:', error);
    }
});
