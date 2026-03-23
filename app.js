// app.js - minimal working version for your HTML
let savedQuestion = "";
let selectedAnswer = "No side selected yet!";
let savedReason = "";

// Save the question from input
function saveQuestion() {
  const questionInput = document.getElementById("questionInput");
  savedQuestion = questionInput.value.trim();
  if (savedQuestion) {
    alert("Question saved: " + savedQuestion);
  } else {
    alert("Please enter a question first!");
  }
}

// Select Side A/B
function selectAnswer(side) {
  selectedAnswer = side;
  document.getElementById("selectedAnswer").textContent = `Selected: ${selectedAnswer}`;
}

// Count characters for reason input
function countChars() {
  const reasonInput = document.getElementById("reasonInput");
  const charCount = document.getElementById("charCount");
  const currentLength = reasonInput.value.length;
  charCount.textContent = `${currentLength} / 500 characters`;
}

// Save the reason
function saveReason() {
  const reasonInput = document.getElementById("reasonInput");
  savedReason = reasonInput.value.trim();
  if (savedReason) {
    alert("Reason saved!");
  } else {
    alert("Please enter a reason first!");
  }
}
