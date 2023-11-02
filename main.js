//Select Element
let numberOfQuestion = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
//Set Option
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
//The Function That Receive The Question From Json File
function getQuestion() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;
      //Create Bullets
      createBullets(questionCount);
      //Add Question Data
      addQuestionData(questionObject[currentIndex], questionCount);
      //Counter
      countDown(15, questionCount);
      //When Submit The Answer
      submitButton.onclick = () => {
        let correctAnswer = questionObject[currentIndex].correct_answer;
        currentIndex++;
        checkAnswer(correctAnswer, questionCount);
        //Remove Old Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //Add New Question
        addQuestionData(questionObject[currentIndex], questionCount);
        //Handle Bullets Class
        handleBullets();
        //Show Result
        showResult(questionCount);
        //Counter
        clearInterval(countDownInterval);
        countDown(15, questionCount);
      };
    }
  };
  request.open("GET", "file.json", true);
  request.send();
}
getQuestion();
//Create Bullets
function createBullets(num) {
  numberOfQuestion.innerHTML = num;
  //Create Spans
  for (let i = 0; i < num; i++) {
    let bullets = document.createElement("span");
    if (i === 0) {
      bullets.className = "on";
    }
    bulletsSpanContainer.appendChild(bullets);
  }
}
//The Function That Add Questions To The Body
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let QuestionTitle = document.createElement("h2");
    let QuestionText = document.createTextNode(obj.question);
    QuestionTitle.appendChild(QuestionText);
    quizArea.appendChild(QuestionTitle);
    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer-${i + 1}`;
      radioInput.dataset.answer = obj.answers[i];
      let label = document.createElement("label");
      label.htmlFor = `answer-${i + 1}`;
      let labelText = document.createTextNode(obj.answers[i]);
      label.appendChild(labelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(correctAnswer, count) {
  let answers = document.getElementsByName("question");
  let chosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (correctAnswer === chosenAnswer) {
    rightAnswers++;
  }
}
function handleBullets() {
  // let bulletsSpan =document.querySelectorAll(".spans span")
  let arrayOfSpan = Array.from(document.querySelectorAll(".spans span"));
  arrayOfSpan.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResult(count) {
  let results;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      results = `<span class="good">Good</span> , ${rightAnswers} From ${count} `;
    } else if (rightAnswers === count) {
      results = `<span class="perfect">Perfect</span> , All Answers Is Good`;
    } else {
      results = `<span class="bad">Bad</span> , ${rightAnswers} From ${count} `;
    }
    resultContainer.innerHTML = results;
    resultContainer.style.padding = "10px";
    resultContainer.style.marginTop = "10px";
    resultContainer.style.backgroundColor = "white";
  }
}
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, second;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      second = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      second = second < 10 ? `0${second}` : second;
      countDownElement.innerHTML = `${minutes}:${second}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
