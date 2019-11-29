//-------------- DOM --------------
const output = document.getElementById('output')
const spinner = document.querySelector('.sk-circle')
const header = document.querySelector('.header')

let userInput = document.querySelector('#user-input')
const modalBtns = document.querySelector('.modal-footer')

const languageToggle = document.querySelector('#language')

const table = document.querySelector('.table')
const tableHead = document.querySelector('.table-head')
// const enTable
// let languageSelector


//-------------- LANGUAGE --------------

languageToggle.checked = localStorage.getItem('language') === null || localStorage.getItem('language') === 'uk' ? true : false

const languageHead = {
    uk: `
        <tr>
            <th scope="col">Номер потягу</th>
            <th scope="col">Пункт відправлення</th>
            <th scope="col">Пункт прибуття</th>
            <th scope="col">День тижня</th>
            <th scope="col">Відправлення</th>
            <th scope="col">Прибуття</th>
            <th scope="col">Вартість</th>
        </tr>
    `,
    en: `
        <tr>
            <th scope="col">Number</th>
            <th scope="col">City of Departure</th>
            <th scope="col">City of Arrival</th>
            <th scope="col">Day</th>
            <th scope="col">Dep Day/Time</th>
            <th scope="col">Arr Day/Time</th>
            <th scope="col">Price</th>
        </tr>
    `
}


//-------------- DATA --------------

// dates
const m = moment()
const today = m.get('day')
const currentHours = m.get('hour')
const currentMinutes = m.get('minute')

const letters = [ 'Ш', 'К', 'Б', 'С', 'П', 'В' ]

const daysOfWeek = {
    uk: [
        'Неділя',
        'Понеділок',
        'Вівторок',
        'Середа',
        'Четвер',
        'Пятниця',
        'Субота'
    ],
    en: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
}

const cities = {
    uk: [
        'Київ',
        'Харків',
        'Львів',
        'Одеса',
        'Дніпро'
    ],
    en: [
        'Kyiv',
        'Kharkiv',
        'Lviv',
        'Odesa',
        'Dnipro'
    ]
}

const distances = [
    [232, 434, 234, 543],
    [431, 321, 543, 341],
    [547, 265, 365, 763],
    [493, 512, 546, 325],
    [653, 432, 296, 632]
]

//-------------- PURE FUNCTIONS --------------

const getRandomItem = (item) => {
    let random = Math.floor(Math.random() * item.length)
    return random
}

const getRandomNum = (max, min) => {
    let random
    if(min === undefined) {
        random = Math.floor(Math.random() * max)
        return random
    } else {
        random = Math.floor(Math.random() * (max - min)) + min
        return random
    }
}

const getNumberOfTrains = (userDefinedNOfTrains) => {
    let defaultNTrains = 2 * (cities.uk.length * (cities.uk.length - 1) / 2)
    return userDefinedNOfTrains !== null ? Number(userDefinedNOfTrains) : defaultNTrains
}

//-------------- OBJECTS --------------

class Destination {
    constructor(language) {
        // initiate current distination's time
        this.trainsDayTime = moment()

        //*********** LANGUAGE ***********
        this.currentLanguage = language
        this.engTest = this.currentLanguage === 'uk' ? true : false

        //*********** TRAIN N && L ***********
        this.trainNumber = getRandomNum(150, 100)
        this.trainLetter = letters[getRandomItem(letters)]

        //*********** DEPARTURE CITY ***********
        this.cityASelector = this.currentLanguage !== 'uk' ? getRandomItem(cities.en) : getRandomItem(cities.uk)
        this.cityA = this.currentLanguage !== 'uk' ? cities.en[this.cityASelector] : cities.uk[this.cityASelector]
        this.avaliableCities = this.currentLanguage !== 'uk' ? [...cities.en.filter(city => city !== this.cityA)] : [...cities.uk.filter(city => city !== this.cityA)]

        //*********** ARRIVAL CITY ***********
        this.cityBSelector = getRandomItem(this.avaliableCities)
        this.cityB = this.avaliableCities[this.cityBSelector]

        //*********** DEPARTURE DAY ***********
        // day of week
        this.setDepartureDay = this.currentLanguage !== 'uk' ? this.trainsDayTime.set('day', getRandomItem(daysOfWeek.en)).get('day') : this.trainsDayTime.set('day', getRandomItem(daysOfWeek.uk)).get('day')
        this.departureDayOfWeek = this.currentLanguage !== 'uk' ? daysOfWeek.en[this.setDepartureDay] : daysOfWeek.uk[this.setDepartureDay]
        this.departureDay = this.currentLanguage !== 'uk' ?
                            daysOfWeek.en[this.setDepartureDay] === daysOfWeek.en[today] ? 'Today' : daysOfWeek.en[this.setDepartureDay] :
                            daysOfWeek.uk[this.setDepartureDay] === daysOfWeek.uk[today] ? 'Сьогодні' : daysOfWeek.uk[this.setDepartureDay]
        // highlight today's ticket
        this.departureToday = daysOfWeek.uk[this.setDepartureDay] === daysOfWeek.uk[today]

        //*********** DEPARTURE TIME ***********
        // if today, departure time starts from the current time
        this.departureH = this.departureToday ?
                        this.trainsDayTime.set('hour', getRandomNum(23, currentHours)).get('hour') : this.trainsDayTime.set('hour', getRandomNum(23, 0)).get('hour')
        this.departureM = this.departureToday ?
                        this.trainsDayTime.set('minute', getRandomNum(59, currentMinutes + 10)).get('minute') : this.trainsDayTime.set('minute', getRandomNum(59, 0)).get('minute')
        this.departureTime = `${this.departureH < 10 ? '0' + this.departureH : this.departureH}:${this.departureM < 10 ? '0' + this.departureM : this.departureM}`

        //*********** TICKET'S PRICE ***********
        // average train speed
        this.averageSpeed = getRandomNum(120, 80)
        // distance to cityB
        this.distanceToCityB = distances[this.cityASelector][this.cityBSelector]
        // commute time        
        this.commuteTime = this.distanceToCityB / this.averageSpeed
        this.commuteTimeMinutes = this.commuteTime * 60
        // ticket's price
        this.ticketPrice = this.commuteTime * 40.251
        this.ticketPriceFormated = this.ticketPrice.toFixed(2)

        //*********** ARRIVAL TIME && DAY ***********
        // arrival time
        this.setArrivalTime = this.trainsDayTime.add(this.commuteTimeMinutes.toFixed(0), 'm')
        this.arrivalTime = `${this.trainsDayTime.get('hour') < 10 ?
                        '0' + this.trainsDayTime.get('hour') : this.trainsDayTime.get('hour')}:${this.trainsDayTime.get('minute') < 10 ?
                        '0' + this.trainsDayTime.get('minute') : this.trainsDayTime.get('minute')}`
        // arrival day
        this.arrivalDay = this.currentLanguage !== 'uk' ?
                        this.departureToday && (today + 1) === this.trainsDayTime.get('day') ?
                        'Завтра' : this.departureToday && today === this.trainsDayTime.get('day') ?
                        'Сьогодні' : daysOfWeek.en[this.trainsDayTime.get('day')] :
                        this.departureToday && (today + 1) === this.trainsDayTime.get('day') ?
                        'Завтра' : this.departureToday && today === this.trainsDayTime.get('day') ?
                        'Сьогодні' : daysOfWeek.uk[this.trainsDayTime.get('day')]
    }
}

//-------------- EXECUTION LOGIC --------------

const generateTable = (nOfTrains) => {
    // save default language to LocalStorage
    if(localStorage.getItem('language') === null) {
        localStorage.setItem('language', 'uk')
    }
    let language = localStorage.getItem('language')
    // clear table
    output.innerHTML = ''
    // array with tickets
    let tickets = []
    // create tickets
    for(let i = 0; i < nOfTrains; i++) {
        let ticket = new Destination(language)
        tickets.push(ticket)
    }
    // animation delay counter
    let animDelay = 0
      
    // display en or uk table heading
    if(language === 'uk') {
        tableHead.innerHTML = languageHead.uk
    } else {
        tableHead.innerHTML = languageHead.en
    }
    // render all tickets 
    tickets.forEach(ticket => {
        // increment delay
        animDelay += 40
        output.innerHTML += `
            <tr class="ticket ${ticket.departureToday ? 'bg-info' : ''}"
                style="animation-delay: ${animDelay}ms"
            >
                <td>${ticket.trainNumber}${ticket.trainLetter}</td>
                <td>${ticket.cityA}</td>
                <td>${ticket.cityB}</td>
                <td>${ticket.departureDayOfWeek}</td>
                <td>${ticket.departureDay} <br> ${ticket.departureTime} </td>
                <td>${ticket.arrivalDay} <br> ${ticket.arrivalTime}</td>
                <td>${ticket.ticketPriceFormated}</td>
            </tr>
        `
    })
    table.classList.add('active')
}

// emulating server request
const requestTickets = numberOfTrains => {
    output.innerHTML = ''
    spinner.classList.add('active')

    let serverStatus = true
    let proccessingTime = 0

    if(numberOfTrains < 50) {
        proccessingTime = 1000
    } else if(numberOfTrains >= 50 && numberOfTrains < 100) {
        proccessingTime = 2000
    } else {
        proccessingTime = 5000
    }

    return new Promise((resolve, reject) => setTimeout(() => {
        if(serverStatus) {
            resolve(numberOfTrains)
        } else {
            reject('Server is not responding')
        }
    }, proccessingTime))
}

// run the program
const executeApp = (nOfTrains) => {
    table.classList.remove('active')
    requestTickets(nOfTrains)
        .then(nOfTrains => {
            spinner.classList.remove('active')
            generateTable(nOfTrains)
        }) 
        .catch(error => console.error(error))
}

// listen to click events
header.addEventListener('click', e => {
    if(e.target.id === 'run') {
        
    } else {
        localStorage.clear()
    }
})

const changeLanguage = () => {
    let currentLanguage = localStorage.getItem('language')
    if(currentLanguage === null || currentLanguage === 'uk') {
        localStorage.setItem('language', 'en')
    } else {
        localStorage.setItem('language', 'uk')
    }
}


modalBtns.addEventListener('click', e => {
    if(e.target.id === 'cancel') {
        executeApp(getNumberOfTrains(null))
    } else {
        e.preventDefault()
        executeApp(userInput.value)
    }
    userInput.value = null
})