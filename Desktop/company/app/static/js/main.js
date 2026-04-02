// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Auto-dismiss alerts after 5 seconds
document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
});

// Add loading state to buttons
document.querySelectorAll('form button[type="submit"]').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.form && this.form.checkValidity()) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 3000);
        }
    });
});

// Product image hover effect
document.querySelectorAll('.product-image').forEach(image => {
    image.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Cart quantity validation
document.querySelectorAll('input[name="quantity"]').forEach(input => {
    input.addEventListener('change', function() {
        const max = parseInt(this.getAttribute('max'));
        let value = parseInt(this.value);
        
        if (value > max) {
            this.value = max;
            showNotification(`Only ${max} items available in stock`, 'warning');
        } else if (value < 1) {
            this.value = 1;
        }
    });
});

// Search form enhancement
const searchInput = document.querySelector('input[name="search"]');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.form.submit();
        }
    });
}

// Notification function
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Add to cart animation
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create flying element animation
        const cartIcon = document.querySelector('.fa-shopping-cart');
        const productCard = this.closest('.product-card');
        
        if (productCard && cartIcon) {
            const clone = productCard.querySelector('.product-image img').cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.width = '50px';
            clone.style.height = '50px';
            clone.style.borderRadius = '10px';
            clone.style.zIndex = '9999';
            clone.style.transition = 'all 0.5s ease';
            
            const rect = productCard.getBoundingClientRect();
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            
            document.body.appendChild(clone);
            
            const cartRect = cartIcon.getBoundingClientRect();
            
            setTimeout(() => {
                clone.style.left = cartRect.left + 'px';
                clone.style.top = cartRect.top + 'px';
                clone.style.width = '20px';
                clone.style.height = '20px';
                clone.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                clone.remove();
                showNotification('Item added to cart!', 'success');
            }, 500);
        }
    });
});

// Lazy loading images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Price formatting
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Update cart count dynamically
function updateCartCount() {
    fetch('/cart/count')
        .then(response => response.json())
        .then(data => {
            const cartBadge = document.getElementById('cartCount');
            if (cartBadge && data.count > 0) {
                cartBadge.textContent = data.count;
                cartBadge.style.display = 'inline-block';
            } else if (cartBadge) {
                cartBadge.style.display = 'none';
            }
        })
        .catch(error => console.error('Error updating cart count:', error));
}

// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Add sticky navbar effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
    } else {
        navbar.style.backdropFilter = 'none';
        navbar.style.backgroundColor = 'transparent';
    }
});

// Product filtering without page reload (for category filters)
document.querySelectorAll('.list-group-item').forEach(filter => {
    filter.addEventListener('click', function(e) {
        if (!this.classList.contains('active')) {
            const url = this.getAttribute('href');
            if (url && url !== '#') {
                window.location.href = url;
            }
        }
    });
});

console.log('EliteStore frontend initialized successfully!');