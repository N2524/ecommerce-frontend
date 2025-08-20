document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');

    console.log('Hamburger:', hamburger); // Debugging log
    console.log('Navbar:', navbar); // Debugging log

    if (hamburger && navbar) {
        hamburger.addEventListener('click', function () {
            navbar.classList.toggle('open');
        });
        console.log('Navbar is available');
    } else {
        if (!hamburger) {
            console.error('Hamburger element not found');
        }
        if (!navbar) {
            console.error('Navbar element not found');
        }
    }

    // Additional debugging for other elements
    const searchBar = document.querySelector('.search-bar');
    console.log('Search Bar:', searchBar); // Debugging log
    if (!searchBar) {
        console.error('Search bar element not found');
    }
});
