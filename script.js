const form = document.querySelector('.container__form')
const question = document.getElementById('question')
const digits = document.getElementById('digits')
const base = document.getElementById('base')
const duration = document.getElementById('duration')
const durationCounter = document.querySelector('.multiply__duration-time')
const questionDisplay = document.getElementById('questionDisplay')
const questionBase = document.getElementById('quetsionBase')
const answer = document.getElementById('answer')
const next = document.getElementById('multiply__submit')
if (location.pathname === '/') {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const error = validateInputs()
        if (error.length > 0) {
            displayErrors(error)
            return;
        };
        storeInputs()
        window.location.href = './multiply.html'

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

    function storeInputs() {
        const data = {
            question: question.value,
            digits: digits.value,
            base: base.value,
            duration: duration.value
        }
        localStorage.setItem('data', JSON.stringify(data))
    }
    function storeInputs() {
        const data = {
            question: question.value,
            digits: digits.value,
            base: base.value,
            duration: duration.value
        }
        localStorage.setItem('data', JSON.stringify(data))
    }
} else {



    const data = JSON.parse(localStorage.getItem('data'))
    let trackQuestion = 0;
    const submittedAnswers = []
    const questionLength = Number(data.question)
    const questionList = generateQuestions(questionLength)
    const answers = questionList.map(question => question * data.base)
    let cancel
    Run()

    function Run() {
        cancel = countDown()
        if (trackQuestion === questionLength - 1) {
            next.innerText = 'Submit'
            displayResults()
            return;
        }
        questionDisplay.innerText = questionList[trackQuestion]
        questionBase.innerText = data.base


    }

    next.addEventListener('click', () => {
        cancel()
        Next('28')
    })
    function countDown() {
        let a = questionList[trackQuestion].toString().length < 3 ? 10 : 20

        const id = setInterval(() => {

            a -= 1
            if (a === 0) {
                clearInterval(id);
                Next()
            }
            durationCounter.innerText = a

        }, 1000)

        return () => clearInterval(id)
    }


    function generateQuestions(questionLength) {
        const questions = []
        for (let index = 0; index < questionLength; index++) {
            questions.push(recul(data.digits))
        }
        return questions
    }

    function recul() {
        const gen = Math.floor(Math.random() * 1000)
        if (!data.digits) return
        if (gen.toLocaleString().length == data.digits) {
            return gen
        }
        return recul()
    }

    function Next() {
        trackQuestion += 1
        submittedAnswers.push(answer.value)
        Run()
    }
    function displayResults() {
        const output = answers.map((answer, index) => {
            return answer == submittedAnswers[index]
        })
        console.log('answers', answers)
        console.log('sub', submittedAnswers)
        alert(output.reduce((a, c) => a + c, 0))
       
    }
}




