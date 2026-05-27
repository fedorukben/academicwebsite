// modalLoader.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('modals.html')
        .then(response => response.text())
        .then(html => {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = html;
            document.body.appendChild(modalContainer);
        })
        .catch(error => console.error('Error loading modals:', error));
});
