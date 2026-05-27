document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchInfo = document.getElementById('searchInfo');
    const publicationsList = document.getElementById('publicationsList');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const publications = document.querySelectorAll('.publication-card');
    
    let showingAll = false;
    const initialDisplayCount = 3;
    
    function updateDisplay() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        let matchCount = 0;
        
        publications.forEach((pub, index) => {
            const title = pub.dataset.title.toLowerCase();
            const author = pub.dataset.author.toLowerCase();
            const journal = pub.dataset.journal.toLowerCase();
            const year = pub.dataset.year;
            const tags = pub.dataset.tags.toLowerCase();
            
            const matches = !query || 
                title.includes(query) || 
                author.includes(query) || 
                journal.includes(query) || 
                year.includes(query) || 
                tags.includes(query);
            
            if (matches) {
                matchCount++;
                if (showingAll || visibleCount < initialDisplayCount) {
                    pub.classList.remove('hidden');
                    visibleCount++;
                } else {
                    pub.classList.add('hidden');
                }
            } else {
                pub.classList.add('hidden');
            }
        });
        
        // Update search info
        if (query) {
            searchInfo.textContent = `Found ${matchCount} publication${matchCount !== 1 ? 's' : ''} matching "${query}"`;
        } else {
            searchInfo.textContent = '';
        }
        
        // Update show more button
        if (query || showingAll || matchCount <= initialDisplayCount) {
            showMoreBtn.classList.add('hidden');
        } else {
            showMoreBtn.classList.remove('hidden');
            showMoreBtn.textContent = `Show ${matchCount - visibleCount} More Publications`;
        }
    }
    
    searchInput.addEventListener('input', function() {
        showingAll = false;
        updateDisplay();
    });
    
    showMoreBtn.addEventListener('click', function() {
        showingAll = true;
        updateDisplay();
    });
    
    // Initial display
    updateDisplay();
});