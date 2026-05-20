const params = new URLSearchParams(window.location.search);
const course = params.get('course');
const backLink = document.getElementById('booking-back');

if (backLink && course === 'family-dog-training-1') {
    backLink.textContent = '← Back To Family Dog Training 1';
    backLink.href = 'family-dog-training-1.html';
}
