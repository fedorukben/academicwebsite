// Search functionality for full courses
document.getElementById('fullCourseSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const courseCards = document.querySelectorAll('#fullCoursesGrid .course-card');
    const noResults = document.getElementById('noFullCourseResults');
    let visibleCount = 0;

    courseCards.forEach(card => {
        const courseName = card.dataset.courseName.toLowerCase();
        const terms = card.dataset.terms.toLowerCase();
        const content = card.dataset.content.toLowerCase();
        
        // Also search within the card text content
        const cardText = card.textContent.toLowerCase();
        
        if (courseName.includes(searchTerm) || 
            terms.includes(searchTerm) || 
            content.includes(searchTerm) || 
            cardText.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (visibleCount === 0 && searchTerm.length > 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
});

// Search functionality for mini courses
document.getElementById('miniCourseSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const courseCards = document.querySelectorAll('#miniCoursesGrid .course-card');
    const noResults = document.getElementById('noMiniCourseResults');
    let visibleCount = 0;

    courseCards.forEach(card => {
        const courseName = card.dataset.courseName.toLowerCase();
        const content = card.dataset.content.toLowerCase();
        
        // Also search within the card text content
        const cardText = card.textContent.toLowerCase();
        
        if (courseName.includes(searchTerm) || 
            content.includes(searchTerm) || 
            cardText.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (visibleCount === 0 && searchTerm.length > 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
});

function filterCourses() {
    const selectedTerm = document.getElementById('termFilter').value;
    const selectedType = document.querySelector('input[name="courseType"]:checked').value;
    const courses = document.querySelectorAll('.course-card');
    
    courses.forEach(course => {
        const terms = course.dataset.terms.split(' ');
        const courseType = course.dataset.courseType;
        
        const matchesTerm = selectedTerm === 'all' || terms.includes(selectedTerm);
        const matchesType = courseType === selectedType;
        
        if (matchesTerm && matchesType) {
            course.classList.remove('hidden');
        } else {
            course.classList.add('hidden');
        }
    });
}

document.querySelectorAll('input[name="courseType"]').forEach(radio => {
    radio.addEventListener('change', filterCourses);
});

filterCourses();