// News search functionality with show more/less
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('newsSearchInput');
    const newsList = document.getElementById('newsList');
    const noResults = document.getElementById('noNewsResults');
    const searchInfo = document.getElementById('newsSearchInfo');
    let showingAll = false;
    const itemLimit = 3;

    if (!searchInput) return;

    // Create show more/less button
    const showMoreContainer = document.createElement('div');
    showMoreContainer.className = 'text-center mt-8';
    showMoreContainer.innerHTML = `
        <button id="showMoreNewsBtn" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition duration-300">
            Show More News
        </button>
    `;
    newsList.parentNode.insertBefore(showMoreContainer, noResults);

    const showMoreBtn = document.getElementById('showMoreNewsBtn');

    function applyItemLimit() {
        const newsItems = newsList.querySelectorAll('.news-item');
        const isSearching = searchInput.value.trim().length > 0;
        
        if (isSearching) {
            // During search, show all matching items
            showMoreContainer.style.display = 'none';
            newsItems.forEach(item => {
                item.classList.remove('hidden-by-limit');
            });
        } else {
            // When not searching, apply the limit
            showMoreContainer.style.display = 'block';
            newsItems.forEach((item, index) => {
                if (index >= itemLimit && !showingAll) {
                    item.classList.add('hidden-by-limit');
                } else {
                    item.classList.remove('hidden-by-limit');
                }
            });
            
            // Update button text and visibility
            if (newsItems.length <= itemLimit) {
                showMoreContainer.style.display = 'none';
            } else {
                showMoreBtn.textContent = showingAll ? 'Show Less' : `Show More News (${newsItems.length - itemLimit} more)`;
            }
        }
    }

    // Show more/less functionality
    showMoreBtn.addEventListener('click', function() {
        showingAll = !showingAll;
        applyItemLimit();
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const newsItems = newsList.querySelectorAll('.news-item');
        let visibleCount = 0;

        newsItems.forEach(item => {
            const title = item.dataset.title.toLowerCase();
            const category = item.dataset.category.toLowerCase();
            const date = item.dataset.date.toLowerCase();
            const content = item.dataset.content.toLowerCase();
            const itemText = item.textContent.toLowerCase();
            
            if (searchTerm.length === 0 || 
                title.includes(searchTerm) || 
                category.includes(searchTerm) || 
                date.includes(searchTerm) || 
                content.includes(searchTerm) || 
                itemText.includes(searchTerm)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Apply item limit after search
        applyItemLimit();

        // Count actually visible items (not hidden by search OR limit)
        const actuallyVisible = Array.from(newsItems).filter(item => 
            item.style.display !== 'none' && !item.classList.contains('hidden-by-limit')
        ).length;

        // Update search info and show/hide no results message
        if (searchTerm.length > 0) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
                newsList.style.display = 'none';
                searchInfo.textContent = 'No results found.';
            } else {
                noResults.classList.add('hidden');
                newsList.style.display = 'block';
                searchInfo.textContent = `Showing ${visibleCount} of ${newsItems.length} news items.`;
            }
        } else {
            noResults.classList.add('hidden');
            newsList.style.display = 'block';
            searchInfo.textContent = '';
        }
    });

    // Initialize the limit on page load
    applyItemLimit();
});