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
};

// 1. Load the published question + sides + expiry time
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
  document.getElementById('submitReasonBtn').disabled = true;
  sideContainer.innerHTML = '';

  if (!publishedQuestionData) {
    qElement.textContent = "No question published yet! Check back soon.";
    qElement.className = "no-question";
    return;
  }

  // Show question
  qElement.textContent = publishedQuestionData.question;
  qElement.className = "";

  // Show expiry date to user
  showExpiryDateToUser();

  // Load side buttons
  publishedSides = publishedQuestionData.sides || [];
  if (publishedSides.length >= 2 && !isQuestionExpired) {
    publishedSides.forEach(side => {
      const btn = document.createElement('button');
      btn.id = `side-${side.replace(/\s+/g, '-')}`;
      btn.textContent = side;
      btn.onclick = () => selectSide(side);
      sideContainer.appendChild(btn);
    });
  }
}

// 2. Show expiry date below the question
function showExpiryDateToUser() {
  if (!publishedQuestionData) return;

  // Avoid duplicating the box on reload
  const existing = document.getElementById('user-expiry-info');
  if (existing) existing.remove();

  const expiryBox = document.createElement('div');
  expiryBox.id = 'user-expiry-info';
  expiryBox.style.margin = '12px 0';
  expiryBox.style.padding = '10px 14px';
  expiryBox.style.background = '#f0f8ff';
  expiryBox.style.borderLeft = '4px solid #4285F4';
  expiryBox.style.borderRadius = '6px';

  const expireDate = new Date(publishedQuestionData.expireTime).toLocaleString();
  expiryBox.innerHTML = `<strong>Closes on:</strong> ${expireDate}`;

  document.getElementById('publishedQuestion').parentElement.appendChild(expiryBox);
}

// 3. Check if question is expired and lock UI if so
function checkQuestionExpiry() {
  if (!publishedQuestionData) return;

  isQuestionExpired = Date.now() > publishedQuestionData.expireTime;

  if (isQuestionExpired) {
    const existing = document.getElementById('expired-warning');
    if (existing) existing.remove();

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

    // Lock all inputs
    document.getElementById('reasonInput').disabled = true;
    document.getElementById('submitReasonBtn').disabled = true;
    document.querySelectorAll('#sideButtonsContainer button').forEach(btn => {
      btn.disabled = true;
      btn.style.background = '#ccc';
    });
  }
}

// 4. Select a side
function selectSide(side) {
  if (reasonSubmitted || isQuestionExpired) return;

  selectedSide = side;
  sessionStorage.setItem('userSelectedSide', side);
  document.getElementById('selectedSideStatus').textContent = `You selected: ${side} (cannot be switched once your reason is submitted)`;

  document.querySelectorAll('#sideButtonsContainer button').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent === side);
  });

  updateSubmitButton();
}

// 5. Character count
function countChars() {
  if (isQuestionExpired) return;
  const len = document.getElementById('reasonInput').value.length;
  document.getElementById('charCount').textContent = `${len} / 500 characters`;
  updateSubmitButton();
}

// 6. Enable/disable submit button
function updateSubmitButton() {
  if (isQuestionExpired) {
    document.getElementById('submitReasonBtn').disabled = true;
    return;
  }
  const reason = document.getElementById('reasonInput').value.trim();
  document.getElementById('submitReasonBtn').disabled = !selectedSide || reason.length === 0 || reasonSubmitted;
}

// 7. Submit reason
function submitReason() {
  if (isQuestionExpired) return;
  const reason = document.getElementById('reasonInput').value.trim();
  if (!selectedSide || !reason || reasonSubmitted) return;

  reasonSubmitted = true;
  sessionStorage.setItem('userSubmittedReason', reason);

  // Save to shared localStorage so othersResponses.html can read it
  const newResponse = {
    id: Date.now(),
    author: "Anonymous",
    side: selectedSide,
    reason: reason,
  };
  const existing = JSON.parse(localStorage.getItem('allResponses')) || [];
  existing.push(newResponse);
  localStorage.setItem('allResponses', JSON.stringify(existing));

  // Lock UI
  document.querySelectorAll('#sideButtonsContainer button').forEach(btn => {
    btn.classList.add('locked');
    btn.classList.remove('selected');
    btn.disabled = true;
  });
  document.getElementById('reasonInput').classList.add('locked');
  document.getElementById('reasonInput').disabled = true;
  document.getElementById('submitReasonBtn').disabled = true;
  document.getElementById('selectedSideStatus').textContent = `You selected: ${selectedSide}`;

  // Show your submitted response
  document.getElementById('yourSideBadge').textContent = `Your Stance: ${selectedSide}`;
  document.getElementById('yourReasonText').textContent = reason;
  document.getElementById('yourResponseContainer').style.display = "block";
}

// 8. Load user's saved state on page reload
function loadUserState() {
  if (isQuestionExpired) return;

  const savedSide = sessionStorage.getItem('userSelectedSide');
  const savedReason = sessionStorage.getItem('userSubmittedReason');

  if (savedSide && !reasonSubmitted) {
    selectedSide = savedSide;
    selectSide(savedSide);
  }

  if (savedReason && !reasonSubmitted) {
    reasonSubmitted = true;
    document.getElementById('reasonInput').value = savedReason;
    countChars();
    // Lock UI
    document.querySelectorAll('#sideButtonsContainer button').forEach(btn => {
      btn.classList.add('locked');
      btn.disabled = true;
    });
    document.getElementById('reasonInput').classList.add('locked');
    document.getElementById('reasonInput').disabled = true;
    document.getElementById('submitReasonBtn').disabled = true;
    document.getElementById('selectedSideStatus').textContent = `You selected: ${selectedSide}`;
    // Show submitted response
    document.getElementById('yourResponseContainer').style.display = "block";
    document.getElementById('yourSideBadge').textContent = `Your Stance: ${selectedSide}`;
    document.getElementById('yourReasonText').textContent = savedReason;

    window.onload = function() {
      loadLatestQuestion();
};
  }
}
