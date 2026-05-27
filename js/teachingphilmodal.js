function openPhilosophyModal() {
    document.getElementById('philosophyModal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function closePhilosophyModal() {
    document.getElementById('philosophyModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Close modal when clicking outside
document.getElementById('philosophyModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePhilosophyModal();
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePhilosophyModal();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('philosophyModal');
    
    // Handle touch events
    let touchStart = null;
    modal.addEventListener('touchstart', function(e) {
        touchStart = e.touches[0].clientY;
    });
    
    modal.addEventListener('touchmove', function(e) {
        if (!touchStart) return;
        
        const touchEnd = e.touches[0].clientY;
        const diff = touchStart - touchEnd;
        
        // If user has scrolled down more than 100px at the top of the content
        if (diff < -100 && modal.scrollTop === 0) {
            closePhilosophyModal();
        }
    });
    
    modal.addEventListener('touchend', function() {
        touchStart = null;
    });
});