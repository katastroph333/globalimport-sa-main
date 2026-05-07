// This file contains JavaScript functionality for the GlobalImport S.A. website.
// It includes handling for the responsive navigation bar and hamburger menu toggle.

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});