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

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
let score = 0;

function showQuestion() {
  resetAnswers();
  let q = questions[currentQuestion];
  questionEl.innerText = q.question;

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer.text;
    btn.onclick = () => selectAnswer(btn, answer.correct);
    answersEl.appendChild(btn);
  });
}

function resetAnswers() {
  answersEl.innerHTML = "";
}

function selectAnswer(button, correct) {
  const buttons = answersEl.children;
  for (let btn of buttons) {
    btn.disabled = true;
  }

  if (correct) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
  }
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  questionEl.classList.add("hide");
  answersEl.classList.add("hide");
  nextBtn.classList.add("hide");
  resultEl.classList.remove("hide");
  scoreEl.innerText = `${score} / ${questions.length}`;
}

restartBtn.onclick = () => {
  currentQuestion = 0;
  score = 0;
  questionEl.classList.remove("hide");
  answersEl.classList.remove("hide");
  nextBtn.classList.remove("hide");
  resultEl.classList.add("hide");
  showQuestion();
};

showQuestion();
