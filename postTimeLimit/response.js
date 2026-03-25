// Global State
let selectedSide = null;
let reasonSubmitted = false;
let publishedSides = [];
let publishedQuestionData = null;
let isQuestionExpired = false;

// Initialize on page load
window.onload = () => {
  loadPublishedQuestionAndSides();
  checkQuestionExpiry();
  loadUserState();
  updateSubmitButton();
  loadOtherReasons();
};

// Load the published question + sides + expiry time
function loadPublishedQuestionAndSides() {
  publishedQuestionData = JSON.parse(localStorage.getItem('publishedQuestionData')) || null;
  const qElement = document.getElementById('publishedQuestion');
  const sideContainer = document.getElementById('sideButtonsContainer');

  // Reset UI
  selectedSide = null;
  reasonSubmitted = false;
  document.getElementById('selectedSideStatus').textContent = "No side selected yet!";
  document.getElementById('reasonInput').value = "";
  document.getElementById('charCount').textContent = "0 / 500 characters";
  document.getElementById('yourResponseContainer').style.display = "none";
  document.getElementById('othersResponsesContainer').style.display = "none";
  document.getElementById('submitReasonBtn').disabled = true;
  sideContainer.innerHTML = '';

  if (!publishedQuestionData) {
    qElement.textContent = "No active question right now.";
    return;
  }

  // Show question
  qElement.textContent = publishedQuestionData.question;

  // Show EXPIRY DATE to USER 
  showExpiryDateToUser();

  // Load side buttons
  publishedSides = publishedQuestionData.sides || [];
  if (publishedSides.length >= 2 && !isQuestionExpired) {
    publishedSides.forEach(side => {
      const btn = document.createElement('button');
      btn.textContent = side;
      btn.onclick = () => selectSide(side);
      sideContainer.appendChild(btn);
    });
  }
}

// SHOW EXPIRY DATE TO USER ON THEIR RESPONSE PAGE 
function showExpiryDateToUser() {
  if (!publishedQuestionData) return;

  const expiryBox = document.createElement('div');
  expiryBox.id = 'user-expiry-info';
  expiryBox.style.margin = '12px 0';
  expiryBox.style.padding = '10px 14px';
  expiryBox.style.background = '#f0f8ff';
  expiryBox.style.borderLeft = '4px solid #4285F4';
  expiryBox.style.borderRadius = '6px';

  const expireDate = new Date(publishedQuestionData.expireTime).toLocaleString();
  expiryBox.innerHTML = `<strong>Closes on:</strong> ${expireDate}`;

  // Insert below question
  document.getElementById('publishedQuestion').parentElement.prepend(expiryBox);
}

// CHECK IF QUESTION IS EXPIRED + LOCK UI 
function checkQuestionExpiry() {
  if (!publishedQuestionData) return;

  const now = Date.now();
  isQuestionExpired = now > publishedQuestionData.expireTime;

  if (isQuestionExpired) {
    // Red warning
    const alertBox = document.createElement('div');
    alertBox.id = 'expired-warning';
    alertBox.style.margin = '12px 0';
    alertBox.style.padding = '12px';
    alertBox.style.background = '#fee2e2';
    alertBox.style.color = '#dc2626';
    alertBox.style.fontWeight = 'bold';
    alertBox.style.borderRadius = '8px';
    alertBox.textContent = '⚠️ This question has expired. No more submissions allowed.';

    document.getElementById('publishedQuestion').parentElement.prepend(alertBox);

    // LOCK EVERYTHING
    document.getElementById('reasonInput').disabled = true;
    document.getElementById('submitReasonBtn').disabled = true;
    document.querySelectorAll('#sideButtonsContainer button').forEach(btn => {
      btn.disabled = true;
      btn.style.background = '#ccc';
    });
  }
}

// Select a side
function selectSide(side) {
  if (reasonSubmitted || isQuestionExpired) return;
  selectedSide = side;
  sessionStorage.setItem('userSelectedSide', side);
  document.getElementById('selectedSideStatus').textContent = `You selected: ${side}`;
  updateSubmitButton();
}

// Character count
function countChars() {
  if (isQuestionExpired) return;
  const len = document.getElementById('reasonInput').value.length;
  document.getElementById('charCount').textContent = `${len} / 500`;
  updateSubmitButton();
}

// Enable/disable submit button
function updateSubmitButton() {
  if (isQuestionExpired) {
    document.getElementById('submitReasonBtn').disabled = true;
    return;
  }
  const reason = document.getElementById('reasonInput').value.trim();
  document.getElementById('submitReasonBtn').disabled = !selectedSide || reason.length === 0 || reasonSubmitted;
}

// Submit reason
function submitReason() {
  if (isQuestionExpired) return;
  const reason = document.getElementById('reasonInput').value.trim();
  if (!selectedSide || !reason || reasonSubmitted) return;

  reasonSubmitted = true;
  sessionStorage.setItem('userSubmittedReason', reason);

  const response = {
    id: Date.now(),
    author: "Anonymous",
    side: selectedSide,
    reason: reason
  };

  const allResponses = JSON.parse(localStorage.getItem('allResponses')) || [];
  allResponses.push(response);
  localStorage.setItem('allResponses', JSON.stringify(allResponses));

  // Lock UI
  document.querySelectorAll('#sideButtonsContainer button').forEach(btn => {
    btn.disabled = true;
    btn.style.background = '#ccc';
  });
  document.getElementById('reasonInput').disabled = true;
  document.getElementById('submitReasonBtn').disabled = true;

  // Show response
  document.getElementById('yourSideBadge').textContent = `Your stance: ${selectedSide}`;
  document.getElementById('yourReasonText').textContent = reason;
  document.getElementById('yourResponseContainer').style.display = "block";
  document.getElementById('othersResponsesContainer').style.display = "block";
  loadOtherReasons();
}

// Load other people's responses
function loadOtherReasons() {
  const list = document.getElementById('otherReasonsList');
  const responses = JSON.parse(localStorage.getItem('allResponses')) || [];
  if (responses.length === 0) {
    list.innerHTML = "<p>No responses yet.</p>";
    return;
  }
  list.innerHTML = responses.map(r => `
    <div style="background:white; padding:12px; margin:8px 0; border-radius:8px;">
      <strong>${r.side}</strong>
      <p>${r.reason}</p>
    </div>
  `).join('');
}

// Load user's saved state
function loadUserState() {
  if (isQuestionExpired) return;
  const savedSide = sessionStorage.getItem('userSelectedSide');
  const savedReason = sessionStorage.getItem('userSubmittedReason');
  if (savedSide) selectSide(savedSide);
  if (savedReason) {
    reasonSubmitted = true;
    document.getElementById('reasonInput').value = savedReason;
    document.getElementById('yourResponseContainer').style.display = "block";
    document.getElementById('othersResponsesContainer').style.display = "block";
  }
}