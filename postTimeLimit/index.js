// Load and render all published questions from localStorage (WITH 7-DAY EXPIRY)
function loadAllQuestions() {
  const container = document.getElementById('questionsContainer');
  const allQuestions = JSON.parse(localStorage.getItem('publishedQuestions')) || [];
  
  if (allQuestions.length === 0) {
    container.innerHTML = "<p>No questions published yet!</p>";
    return;
  }

  container.innerHTML = '';
  // Sort: newest first + calculate expiry for each question
  [...allQuestions].reverse().forEach(entry => {
    const now = Date.now();
    // Fallback for old entries without expiryTime (set to 7 days from publishTime)
    const publishTime = entry.publishTime || Date.now();
    const expireTime = entry.expireTime || (publishTime + 7 * 24 * 60 * 60 * 1000);
    const isExpired = now > expireTime;
    
    const publishDate = new Date(publishTime).toLocaleString();
    const expireDate = new Date(expireTime).toLocaleString();

    const card = document.createElement('div');
    card.classList.add('post-card');
    // Add expired class for CSS styling
    if (isExpired) card.classList.add('expired-question');

    card.innerHTML = `
      <h3>${entry.question} ${isExpired ? '<span class="expiry-badge">EXPIRED</span>' : ''}</h3>
      <p class="sides-label">Sides: ${entry.sides.join(" vs ")}</p>
      <p class="published-date">Published: ${publishDate}</p>
      <p class="expire-date">${isExpired ? 'Expired on:' : 'Expires on:'} ${expireDate}</p>
    `;
    container.appendChild(card);
  });
}

// Initialize on page load
window.onload = loadAllQuestions;