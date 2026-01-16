const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "Home Tool Markup Language", correct: false },
      { text: "Hyperlinks Text Mark Language", correct: false }
    ]
  },
  {
    question: "Which language is used for styling web pages?",
    answers: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: true },
      { text: "Java", correct: false }
    ]
  },
  {
    question: "Which is a JavaScript framework?",
    answers: [
      { text: "React", correct: true },
      { text: "Laravel", correct: false },
      { text: "Django", correct: false }
    ]
  }
];

// DOM Elements
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const quizSection = document.getElementById("quiz-section");
const reviewSection = document.getElementById("review-section");
const resultSection = document.getElementById("result-section");
const successNotification = document.getElementById("success-notification");
const currentQuestionEl = document.getElementById("current-question");
const totalQuestionsEl = document.getElementById("total-questions");
const scoreEl = document.getElementById("score");
const totalScoreEl = document.getElementById("total-score");
const percentageEl = document.getElementById("percentage");

// State
let currentQuestion = 0;
let userAnswers = {}; // Store user answers: { questionIndex: answerIndex }

// Initialize
totalQuestionsEl.innerText = questions.length;

function showQuestion() {
  // Reset display
  answersEl.innerHTML = "";
  
  // Get current question
  let q = questions[currentQuestion];
  questionEl.innerText = q.question;
  currentQuestionEl.innerText = currentQuestion + 1;

  // Show/hide previous button
  if (currentQuestion === 0) {
    prevBtn.classList.add("hide");
  } else {
    prevBtn.classList.remove("hide");
  }

  // Disable next button unless answer is selected
  nextBtn.disabled = !(currentQuestion in userAnswers);

  // Create answer buttons
  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.innerText = answer.text;
    btn.className = "answer-btn";
    
    // Highlight selected answer
    if (userAnswers[currentQuestion] === index) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectAnswer(index, btn);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(answerIndex, button) {
  // Store the user's answer
  userAnswers[currentQuestion] = answerIndex;
  
  // Update button styling
  const buttons = answersEl.children;
  for (let btn of buttons) {
    btn.classList.remove("selected");
  }
  button.classList.add("selected");

  // Enable next button
  nextBtn.disabled = false;
}

nextBtn.onclick = () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    // Show review section
    showReview();
  }
};

prevBtn.onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
};

function showReview() {
  quizSection.classList.add("hide");
  reviewSection.classList.remove("hide");

  const reviewContent = document.getElementById("review-content");
  reviewContent.innerHTML = "";

  questions.forEach((q, index) => {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";

    const questionTitle = document.createElement("h4");
    questionTitle.innerText = `Question ${index + 1}: ${q.question}`;
    reviewItem.appendChild(questionTitle);

    const answerDiv = document.createElement("div");
    answerDiv.className = "review-answer";

    if (index in userAnswers) {
      const selectedAnswer = q.answers[userAnswers[index]];
      answerDiv.innerHTML = `<strong>Your Answer:</strong> ${selectedAnswer.text}`;
    } else {
      answerDiv.innerHTML = `<strong>Not Answered</strong>`;
    }

    reviewItem.appendChild(answerDiv);
    reviewContent.appendChild(reviewItem);
  });
}

document.getElementById("back-to-quiz-btn").onclick = () => {
  successNotification.classList.add("hide");
  reviewSection.classList.add("hide");
  quizSection.classList.remove("hide");
};

document.getElementById("submit-btn").onclick = () => {
  // Calculate score
  let score = 0;
  questions.forEach((q, index) => {
    if (index in userAnswers) {
      if (q.answers[userAnswers[index]].correct) {
        score++;
      }
    }
  });

  // Store score for results page
  window.quizScore = score;

  // Show success notification popup
  successNotification.classList.remove("hide");
};

document.getElementById("view-results-btn").onclick = () => {
  successNotification.classList.add("hide");
  showResults(window.quizScore);
};

function showResults(score) {
  reviewSection.classList.add("hide");
  resultSection.classList.remove("hide");

  scoreEl.innerText = score;
  totalScoreEl.innerText = questions.length;
  const percentage = Math.round((score / questions.length) * 100);
  percentageEl.innerText = percentage + "%";

  // Show detailed results
  const resultsContent = document.getElementById("results-content");
  resultsContent.innerHTML = "";

  questions.forEach((q, index) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    const questionTitle = document.createElement("h4");
    questionTitle.innerText = `Question ${index + 1}: ${q.question}`;
    resultItem.appendChild(questionTitle);

    const correctAnswer = q.answers.find(a => a.correct);
    const correctDiv = document.createElement("div");
    correctDiv.className = "result-correct";
    correctDiv.innerHTML = `<strong>Correct Answer:</strong> ${correctAnswer.text}`;
    resultItem.appendChild(correctDiv);

    if (index in userAnswers) {
      const userAnswer = q.answers[userAnswers[index]];
      const userDiv = document.createElement("div");
      userDiv.className = userAnswer.correct ? "result-correct" : "result-wrong";
      userDiv.innerHTML = `<strong>Your Answer:</strong> ${userAnswer.text}`;
      resultItem.appendChild(userDiv);
    } else {
      const notAnswered = document.createElement("div");
      notAnswered.className = "result-wrong";
      notAnswered.innerHTML = `<strong>Your Answer:</strong> Not Answered`;
      resultItem.appendChild(notAnswered);
    }

    resultsContent.appendChild(resultItem);
  });
}

document.getElementById("restart-btn").onclick = () => {
  currentQuestion = 0;
  userAnswers = {};
  quizSection.classList.remove("hide");
  reviewSection.classList.add("hide");
  resultSection.classList.add("hide");
  successNotification.classList.add("hide");
  showQuestion();
};

// Start quiz
showQuestion();
