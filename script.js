const lightModeBtn = document.getElementById("lightModeBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const resetBtn = document.getElementById("resetBtn");
const welcomeMessage = document.getElementById("welcomeMessage");
const mostUsed = document.getElementById("mostUsed");
const studyMode = document.getElementById("studyMode");
const dashboardCards = document.getElementById("dashboardCards");
const recommendationText = document.getElementById("recommendationText");
const quizFeedback = document.getElementById("quizFeedback");
const lowScoreBtn = document.getElementById("lowScoreBtn");
const highScoreBtn = document.getElementById("highScoreBtn");

let usageData = JSON.parse(localStorage.getItem("usageData")) || {
  quiz: 0,
  tips: 0,
  resources: 0,
  progress: 0
};

let quizLevel = localStorage.getItem("quizLevel") || "";
let savedTheme = localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  localStorage.setItem("theme", theme);
}

function getMostUsedSection() {
  let maxSection = "No activity yet";
  let maxValue = 0;

  for (const section in usageData) {
    if (usageData[section] > maxValue) {
      maxValue = usageData[section];
      maxSection = section;
    }
  }
  return maxValue === 0 ? "No activity yet" : maxSection;
}

function updateAdaptiveContent() {
  const topSection = getMostUsedSection();
  mostUsed.textContent = topSection;

  if (topSection === "quiz") {
    welcomeMessage.textContent = "Welcome back! You seem focused on quiz practice today.";
    studyMode.textContent = "Practice Mode";
    recommendationText.textContent = "Recommended: Attempt more quiz-based activities and challenge questions.";
  } else if (topSection === "tips") {
    welcomeMessage.textContent = "Welcome back! You seem to prefer guided learning and study tips.";
    studyMode.textContent = "Guided Learning Mode";
    recommendationText.textContent = "Recommended: Review learning tips and structured explanations.";
  } else if (topSection === "resources") {
    welcomeMessage.textContent = "Welcome back! You seem interested in learning resources and references.";
    studyMode.textContent = "Resource Exploration Mode";
    recommendationText.textContent = "Recommended: Explore curated articles and supporting materials.";
  } else if (topSection === "progress") {
    welcomeMessage.textContent = "Welcome back! You seem to like tracking your academic progress.";
    studyMode.textContent = "Performance Tracking Mode";
    recommendationText.textContent = "Recommended: Review your learning progress and next improvement steps.";
  } else {
    welcomeMessage.textContent = "Welcome! Your dashboard will adapt based on how you use it.";
    studyMode.textContent = "Start interacting to get a recommendation";
    recommendationText.textContent = "The system will recommend content based on your behavior and quiz performance.";
  }

  if (quizLevel === "low") {
    quizFeedback.textContent = "Adaptive response: You may need easier practice and extra hints.";
    recommendationText.textContent += " The system suggests beginner-friendly materials.";
  } else if (quizLevel === "high") {
    quizFeedback.textContent = "Adaptive response: You are performing well, so advanced content is recommended.";
    recommendationText.textContent += " The system suggests advanced exercises and fewer hints.";
  } else {
    quizFeedback.textContent = "Your quiz-based recommendation will appear here.";
  }

  reorderCards();
}

function reorderCards() {
  const cards = Array.from(document.querySelectorAll(".card"));
  cards.sort((a, b) => {
    const sectionA = a.dataset.section;
    const sectionB = b.dataset.section;
    return usageData[sectionB] - usageData[sectionA];
  });

  cards.forEach(card => dashboardCards.appendChild(card));
}

document.querySelectorAll(".use-btn").forEach(button => {
  button.addEventListener("click", function () {
    const section = this.parentElement.dataset.section;
    usageData[section]++;
    localStorage.setItem("usageData", JSON.stringify(usageData));
    updateAdaptiveContent();
  });
});

lightModeBtn.addEventListener("click", () => applyTheme("light"));
darkModeBtn.addEventListener("click", () => applyTheme("dark"));

lowScoreBtn.addEventListener("click", () => {
  quizLevel = "low";
  localStorage.setItem("quizLevel", "low");
  updateAdaptiveContent();
});

highScoreBtn.addEventListener("click", () => {
  quizLevel = "high";
  localStorage.setItem("quizLevel", "high");
  updateAdaptiveContent();
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("usageData");
  localStorage.removeItem("quizLevel");
  localStorage.removeItem("theme");
  usageData = { quiz: 0, tips: 0, resources: 0, progress: 0 };
  quizLevel = "";
  applyTheme("light");
  updateAdaptiveContent();
});

applyTheme(savedTheme);
updateAdaptiveContent();