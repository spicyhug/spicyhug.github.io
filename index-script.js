// Age verification function
function confirmAge(isOfAge) {
    const overlay = document.getElementById('ageVerificationOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (isOfAge) {
        // User confirmed they are 21+, show the home page
        overlay.style.display = 'none';
        mainContent.style.display = 'flex';
        
        // Store age verification in sessionStorage for this browser session only
        sessionStorage.setItem('ageVerified', 'true');
    } else {
        // User is under 21, redirect them away or show a message
        alert('Sorry, you must be 21 years or older to access this content.');
        window.location.href = 'https://www.google.com'; // Redirect to a safe page
    }
}

// Check if user has already verified their age today
function checkAgeVerification() {
    const ageVerified = sessionStorage.getItem('ageVerified');
    
    if (ageVerified === 'true') {
        // Already verified this session, skip the modal
        document.getElementById('ageVerificationOverlay').style.display = 'none';
        document.getElementById('mainContent').style.display = 'flex';
        return true;
    }
    
    // Show age verification modal
    document.getElementById('ageVerificationOverlay').style.display = 'flex';
    return false;
}

// Navigate to game function
function navigateToGame(gameUrl) {
    // Add a smooth transition effect
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.8';
    
    // Navigate after a short delay for the transition
    setTimeout(() => {
        window.location.href = gameUrl;
    }, 300);
}

// Initialize the home page
document.addEventListener('DOMContentLoaded', function() {
    // Check age verification
    checkAgeVerification();
    
    // Add hover effects to game cards
    const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect for coming soon cards
    const comingSoonCards = document.querySelectorAll('.game-card.coming-soon');
    comingSoonCards.forEach(card => {
        card.addEventListener('click', function() {
            // Show a nice coming soon message
            showComingSoonMessage();
        });
    });
});

// Show coming soon message
function showComingSoonMessage() {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.1rem;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: notificationSlide 0.3s ease;
    `;
    notification.textContent = '🚀 This game is coming soon! Stay tuned for updates.';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationSlide {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);
