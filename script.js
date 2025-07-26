const formContainer = document.querySelector('.container')
const form = document.querySelector('.container__form')
const question = document.getElementById('question')
const digits = document.getElementById('digits')
const base = document.getElementById('base')
const duration = document.getElementById('duration')
const durationCounter = document.querySelector('.multiply__duration-time')
const questionDisplay = document.getElementById('questionDisplay')
const questionBase = document.getElementById('quetsionBase')
const answer = document.getElementById('answer')
const testEnviron = document.querySelector('.multiply')
const resultEnviron = document.querySelector('.result')
const next = document.getElementById('multiply__submit')
const questionError = document.getElementById('questionValue')
const baseError = document.getElementById('baseValue')
const digitError = document.getElementById('digitValue')
const durationError = document.getElementById('durationValue')
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = validateInputs()
    if (error.length > 0) {
        displayErrors(error)
        return;
    };

    testConfigs['totalQuestions'] = question.value
    testConfigs['maxDuration'] = duration.value
    testConfigs['maxDigits'] = digits.value
    testConfigs['base'] = base.value

    startTest()
})

function validateInputs() {
    const errors = []
    const questionValue = question.value
    if (questionValue === '') errors.push({ questionValue: 'Please Enter Question Numbers' })
    const digitValue = digits.value
    if (digitValue === '') errors.push({ digitValue: 'Please Enter digits Numbers' })
    const baseValue = base.value
    if (baseValue === '') errors.push({ baseValue: 'Please Enter base Numbers' })
    const durationValue = duration.value
    if (durationValue === '') errors.push({ durationValue: 'Please Enter duration Numbers' })

    return errors
}

function displayErrors(errors) {
    errors.map((items) => {
        const keys = Object.keys(items)
        const value = Object.values(items)
        document.getElementById(keys[0]).innerText = value[0]
    })
}
const elements = [{
    element: question,
    errorTag: questionError
}, {
    element: base,
    errorTag: baseError
}, {
    element: digits,
    errorTag: digitError
}, {
    element: duration,
    errorTag: durationError
}]
elements.map(element => clearError(element.element, element.errorTag))
function clearError(element, errorTag) {
    element.addEventListener('input', () => {
        errorTag.innerText = ''
    })
}

const testConfigs = {}
let stats;
let correctionsCode;
function startTest() {
    formContainer.style.display = 'none'
    testEnviron.style.display = 'flex'
    const questions = generateQuestions()
    console.log(questions)

    let tracker = 0;
    let timeTracker;
    let cancelInterval;
    displayQuestion(questions[tracker])
    answer.focus()
    cancelInterval = countDown();
    next.addEventListener('click', () =>
        Next(cancelInterval)
    )
    function Run() {
        answer.focus()
        answer.value=''
        displayQuestion(questions[tracker])
        const id = countDown();
        if (tracker === testConfigs.totalQuestions - 1) {
            next.innerText = 'Submit'
        }
        return id
    }
    function Next(sessionId) {
        sessionId ? sessionId() : ''

        questions[tracker]['submittedAnswer'] = answer?.value ? answer?.value : '';
        questions[tracker]['timeTaken'] = timeTracker;
        tracker += 1
        if (next.innerText === 'Submit') {
            console.log(questions)
            stats = calculation(questions)
            correctionsCode=corrections(questions)
         
            result()
            return;
        }
        cancelInterval = Run()
    }

    function countDown() {
        let a = testConfigs.maxDuration
        durationCounter.innerText = a
        const id = setInterval(() => {
            if (a - 1 === 0) {
                timeTracker = a
                clearInterval(id);
                Next()
            }
            a -= 1
            timeTracker = a
            durationCounter.innerText = a

        }, 999)

        return () => clearInterval(id)
    }

}

function calculation(questions) {
    const correct = questions.reduce((a, b) => {
        if (b.answer == b.submittedAnswer) {
            return a + 1
        }
        return a
    }, 0)
    console.log(correct)
    const incorrect = questions.length - correct
    const totalTime = questions.reduce((a, b) => {
        return a + b.timeTaken
    }, 0)
    const averageTimePerQuestion = totalTime / questions.length

    return [correct, incorrect, totalTime, averageTimePerQuestion]
}

function displayQuestion(question) {
    questionDisplay.innerText = question.question
    questionBase.innerText = testConfigs.base
}
function generateQuestions() {
    const questions = []
    for (let index = 0; index < testConfigs.totalQuestions; index++) {
        const question = recul(testConfigs.maxDigits)
        const answer = Number(question) * Number(testConfigs.base)
        questions.push({ question, answer })
    }
    return questions
}

function recul(limit = 3) {
    const gen = Math.floor(Math.random() * Math.pow(10,limit))
    if (gen.toString().length == limit) {
        return gen
    }
    return recul()
}

function corrections(questions) {
   return questions.map((question, index) => {
        return `<div class="result__review-content ${(question.submittedAnswer == question.answer)?'correct':'incorrect'}">

                <div class="result__review-question  ${(question.submittedAnswer == question.answer)?'co':'in'}">
                    <span>Q${index+1}:</span>  <span>${question.question} </span> x <span>${testConfigs.base}</span> = ?
                </div>
                <div class="result__review-corrections">
                    <span>Your answer:</span><span>${question.submittedAnswer}</span> | <span>Correct answer:</span><span>${question.answer}</span>
                </div>
            </div>`
    })
}

function result() {
    testEnviron.style.display = 'none'
    resultEnviron.style.display = 'flex'
    resultEnviron.innerHTML = `<div class="result__outcome">
            <div class="result__outcome-item" id="totalQuestion">
                <p>
                    Total Questions:
                </p>
                <p>
                    ${stats[0] + stats[1]}
                </p>
            </div>
            <div class="result__outcome-item" id="correct">
                <p>
                    Correct Answers:
                </p>
                <p>
                    ${stats[0]}
                </p>
            </div>
            <div class="result__outcome-item" id="incorrect">
                <p>
                    Incorrect Answers:
                </p>
                <p>
                    ${stats[1]}
                </p>
            </div>
            <div class="result__outcome-item" id="totalQuestion">
                <p>
                    Total Time Taken:
                </p>
                <p>
                    ${stats[2]} s
                </p>
            </div>
            <div class="result__outcome-item" id="totalQuestion">
                <p>
                    Average Time Per Question:
                </p>
                <p>
                    ${stats[3]} s
                </p>
            </div>
        </div>
        
        <div class="result__review">
            <p class="result__review-header"> Question Review</p>

            ${correctionsCode.join('')}
            
        </div>
        
        <button  class="container__form-submit" onclick=restore() > Another Test</button>`

}


function restore() {
    location.reload()
}
