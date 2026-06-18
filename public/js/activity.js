// Questions for the Brazilian Wildlife Match activity
const questions = [
    {
        animal: "Capybara",
        correctAnswer: "Pantanal Wetlands",
        options: ["Pantanal Wetlands", "Jaguar Forest", "Arara Canopy"]
    },
    {
        animal: "Blue Macaw",
        correctAnswer: "Arara Canopy",
        options: ["Amazon River Trail", "Arara Canopy", "Cerrado Discovery Zone"]
    },
    {
        animal: "Jaguar",
        correctAnswer: "Jaguar Forest",
        options: ["Jaguar Forest", "Atlantic Forest Garden", "Pantanal Wetlands"]
    },
    {
        animal: "Giant Otter",
        correctAnswer: "Amazon River Trail",
        options: ["Amazon River Trail", "Cerrado Discovery Zone", "Arara Canopy"]
    },
    {
        animal: "Maned Wolf",
        correctAnswer: "Cerrado Discovery Zone",
        options: ["Pantanal Wetlands", "Cerrado Discovery Zone", "Amazon River Trail"]
    },
    {
        animal: "Poison Dart Frog",
        correctAnswer: "Atlantic Forest Garden",
        options: ["Atlantic Forest Garden", "Jaguar Forest", "Arara Canopy"]
    }
];

// Gets elements from the activity page
const animalQuestion = document.getElementById("animalQuestion");
const answerButtons = document.getElementById("answerButtons");
const activityFeedback = document.getElementById("activityFeedback");
const scoreElement = document.getElementById("score");
const nextQuestionButton = document.getElementById("nextQuestionButton");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// Only runs the activity if the page elements exist
if (animalQuestion && answerButtons && activityFeedback && scoreElement && nextQuestionButton) {
    showQuestion();

    nextQuestionButton.addEventListener("click", () => {
        currentQuestionIndex++;

        if (currentQuestionIndex >= questions.length) {
            showFinalScore();
            return;
        }

        showQuestion();
    });
}

// Displays the current question
function showQuestion() {
    answered = false;

    const currentQuestion = questions[currentQuestionIndex];

    animalQuestion.textContent = `Which habitat is the best match for the ${currentQuestion.animal}?`;
    activityFeedback.textContent = "";
    answerButtons.innerHTML = "";

    currentQuestion.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.className = "answer-button";

        button.addEventListener("click", () => {
            checkAnswer(option);
        });

        answerButtons.appendChild(button);
    });
}

// Checks if the selected answer is correct
function checkAnswer(selectedAnswer) {
    if (answered) {
        return;
    }

    answered = true;

    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
        score++;
        scoreElement.textContent = score;
        activityFeedback.textContent = "Correct! Well done.";
        activityFeedback.className = "activity-feedback correct-feedback";
    } else {
        activityFeedback.textContent = `Not quite. The correct answer is ${currentQuestion.correctAnswer}.`;
        activityFeedback.className = "activity-feedback wrong-feedback";
    }
}

// Displays the final score
function showFinalScore() {
    animalQuestion.textContent = "Activity complete!";
    answerButtons.innerHTML = "";
    activityFeedback.textContent = `You scored ${score} out of ${questions.length}.`;
    activityFeedback.className = "activity-feedback correct-feedback";
    nextQuestionButton.style.display = "none";
}