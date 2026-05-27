console.log('Available blog posts:', Object.keys(blogPosts));
// Blog modal functionality
function openBlogModal(postId) {
    const modal = document.getElementById('blogModal');
    const content = document.getElementById('blogModalContent');
    
    // Get the blog post content
    const postContent = getBlogPostContent(postId);
    content.innerHTML = postContent;
    
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Close modal when clicking outside or pressing Escape
document.getElementById('blogModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBlogModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBlogModal();
    }
});

// Blog post content storage
function getBlogPostContent(postId) {
    return blogPosts[postId] || '<p>Post content not found.</p>';
}