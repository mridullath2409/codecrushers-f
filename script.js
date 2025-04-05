// Main navigation functionality
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('nav a');

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navToggle.checked) {
      navToggle.checked = false;
    }
  });
});

// Smooth scroll functionality for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Redirect to translate page when "Start Translating" button is clicked
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
  if (button.textContent.includes('Start Translating') || button.textContent.includes('Try It Now')) {
    button.addEventListener('click', (e) => {
      if (button.tagName !== 'A') {
        e.preventDefault();
        window.location.href = 'translate.html';
      }
    });
  }
});

// Add active class to current navigation item
const currentPage = window.location.pathname.split('/').pop();
navLinks.forEach(link => {
  const linkPage = link.getAttribute('href');
  if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  }
});

// Animation on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.feature-card, .aim h2, .divider, .aim p, .cta');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animate');
    }
  });
};

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
});