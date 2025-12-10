// Mobile Menu Toggle
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("nav-menu").classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", function(event) {
    const navMenu = document.getElementById("nav-menu");
    const menuToggle = document.getElementById("menu-toggle");
    
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove("active");
    }
});

// Login Modal Functions
function openModal(type) {
    document.getElementById("loginModal").style.display = "block";
    document.getElementById("modalTitle").textContent =
        type.charAt(0).toUpperCase() + type.slice(1) + " Login";
    
    // Store login type for form submission
    document.getElementById("loginForm").dataset.type = type;
}

function closeModal() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("loginForm").reset();
}

// Handle form submission
function handleLogin(event) {
    event.preventDefault();
    
    const type = event.target.dataset.type;
    const id = document.getElementById("loginId").value;
    const password = document.getElementById("loginPassword").value;
    
    // Add your login logic here
    console.log(`${type} Login Attempt:`, { id, password });
    
    // For demo purposes, show alert and close modal
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} login submitted!\n\nIn a real application, this would validate credentials and redirect.`);
    closeModal();
}

// Hero Background Slideshow
document.addEventListener("DOMContentLoaded", function() {
    const hero = document.querySelector(".hero");
    
    const images = [
        "images/set 2k25(2).jpg",
        "images/set 2k25(7).jpg",
        "images/set 2k25(4).jpg",
        "images/set 2k25(5).jpg",
        "images/set 2k25(6).jpg"
    ];
    
    // Preload images
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    let current = 0;
    
    function changeBackground() {
        if (images.length === 0) return;
        
        hero.style.backgroundImage = 
            `linear-gradient(rgba(87, 197, 246, 0.45), rgba(139, 94, 60, 0.55)), 
             url('${images[current]}')`;
        
        current = (current + 1) % images.length;
    }
    
    // Change background every 5 seconds
    if (images.length > 1) {
        setInterval(changeBackground, 5000);
    }
    
    // Close modal when clicking outside
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("loginModal");
        if (event.target === modal) {
            closeModal();
        }
    });
});