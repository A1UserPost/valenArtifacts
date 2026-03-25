// Open User UI
function openUserUI() {
  const cacheBuster = `?v=${Date.now()}`;
  window.open(`index.html${cacheBuster}`, '_blank');
}

// Add new side input
function addSide() {
  const container = document.getElementById('sidesContainer');
  const newSide = document.createElement('div');
  newSide.className = 'side-item';
  newSide.innerHTML = `
    <input type="text" class="side-input" placeholder="Side name">
    <button class="delete-side" onclick="deleteSide(this)">Delete</button>
  `;
  container.appendChild(newSide);
}

// Delete side
function deleteSide(btn) {
  const container = document.getElementById('sidesContainer');
  if (container.children.length > 2) {
    btn.parentElement.remove();
  } else {
    alert("Minimum 2 sides required!");
  }
}

// Show expiry date BEFORE publishing
function showExpiryDate() {
  const now = Date.now();
  const expireTime = now + (7 * 24 * 60 * 60 * 1000);
  const formatted = new Date(expireTime).toLocaleString();

  const box = document.getElementById('expiryDateDisplay');
  box.innerHTML = `
    This question will <span class="expiry-date-text">EXPIRE ON:</span> ${formatted}
  `;
}

// PUBLISH QUESTION WITH 7-DAY LIMIT
function publishQuestion() {
  const question = document.getElementById('modQuestionInput').value.trim();
  const sideInputs = document.querySelectorAll('.side-input');
  const sides = Array.from(sideInputs)
    .map(input => input.value.trim())
    .filter(Boolean);

  const status = document.getElementById('publishStatus');

  if (!question) {
    status.textContent = "Error: Enter a question!";
    status.className = "status error";
    return;
  }
  if (sides.length < 2) {
    status.textContent = "Error: At least 2 sides required!";
    status.className = "status error";
    return;
  }

  const publishTime = Date.now();
  const expireTime = publishTime + (7 * 24 * 60 * 60 * 1000);

  const newQuestion = {
    id: Date.now(),
    question: question,
    sides: sides,
    publishTime: publishTime,
    expireTime: expireTime,
    publishedAt: new Date(publishTime).toLocaleString()
  };

  // Save to both lists
  const allQuestions = JSON.parse(localStorage.getItem('publishedQuestions') || '[]');
  allQuestions.push(newQuestion);
  localStorage.setItem('publishedQuestions', JSON.stringify(allQuestions));
  localStorage.setItem('publishedQuestionData', JSON.stringify(newQuestion));

  status.textContent = `SUCCESS! Question expires: ${new Date(expireTime).toLocaleString()}`;
  status.className = "status success";

  // Show expiry date
  showExpiryDate();
}

// Load saved question + show expiry
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem('publishedQuestionData'));
  if (saved) {
    document.getElementById('modQuestionInput').value = saved.question;
    const container = document.getElementById('sidesContainer');
    container.innerHTML = '';

    saved.sides.forEach(side => {
      const item = document.createElement('div');
      item.className = 'side-item';
      item.innerHTML = `
        <input type="text" class="side-input" value="${side}">
        <button class="delete-side" onclick="deleteSide(this)">Delete</button>
      `;
      container.appendChild(item);
    });

    // Show expiry date if already published
    if (saved.expireTime) {
      const formatted = new Date(saved.expireTime).toLocaleString();
      const box = document.getElementById('expiryDateDisplay');
      box.innerHTML = `
        Currently active question <span class="expiry-date-text">EXPIRES ON:</span> ${formatted}
      `;
    }
  }
};