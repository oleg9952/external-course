//-------------- DOM --------------
const output = document.getElementById('output')
const spinner = document.querySelector('.sk-circle')

const userInput = document.querySelector('#user-input')
const modalBtns = document.querySelector('.modal-footer')
const saveBtn = document.querySelector('#save')

const languageToggle = document.querySelector('#language')

const table = document.querySelector('.table')
const tableHead = document.querySelector('.table-head')

const search = document.querySelector('.search_holder')
const searchInput = document.querySelector('#search_input')
const searchCategory = document.querySelector('#search_category')

//-------------- LANGUAGE --------------

//set default checkbox state
languageToggle.checked = localStorage.getItem('language') === null || localStorage.getItem('language') === 'uk' ? true : false

const languageHead = {
    uk: `
        <tr class="table_head-row">
            <th scope="col" id="by_number">Номер потягу</th>
            <th scope="col" id="by_dep-city">Пункт відправлення</th>
            <th scope="col" id="by_arr-city">Пункт прибуття</th>
            <th scope="col" id="by_day">День тижня</th>
            <th scope="col" id="by_dep-timer">До відправлення</th>
            <th scope="col" id="by_dep_time">Відправлення</th>
            <th scope="col" id="by_arr-day">Прибуття</th>
            <th scope="col" id="by_price">Вартість</th>
        </tr>
    `,
    en: `
        <tr class="table_head-row">
            <th scope="col" id="by_number">Number</th>
            <th scope="col" id="by_dep-city">City of Departure</th>
            <th scope="col" id="by_arr-city">City of Arrival</th>
            <th scope="col" id="by_day">Day</th>
            <th scope="col" id="by_dep-timer">Till departure</th>
            <th scope="col" id="by_dep_time">Dep. Day/Time</th>
            <th scope="col" id="by_arr-day">Arr. Day/Time</th>
            <th scope="col" id="by_price">Price</th>
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

//-------------- FUNCTIONS --------------

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

const saveToFile = (fileName, data) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

let displayTimer
const renderTable = () => {
    output.innerHTML = ''
    // animation delay counter
    let animDelay = 0
    // render all tickets 
    tickets.forEach(ticket => {
        // increment delay
        animDelay += 40
        output.innerHTML += `
            <tr class="ticket ${ticket.departureToday ? 'bg-info' : ''}"
                style="animation-delay: ${animDelay}ms"
            >
                <td
                    class="${ticket.trainNumberSearch ? 'bg-warning' : ''}"
                >${ticket.trainNumber}${ticket.trainLetter}</td>
                <td
                    class="${ticket.departureSearch ? 'bg-warning' : ''}"
                >${ticket.cityA}</td>
                <td
                    class="${ticket.arrivalSearch ? 'bg-warning' : ''}"
                >${ticket.cityB}</td>
                <td
                    class="${ticket.departureDaySearch ? 'bg-warning' : ''}"
                >${ticket.departureDayOfWeek}</td>
                <td class="timer">...</td>
                <td>${ticket.departureDay} <br> ${ticket.departureTime} </td>
                <td
                    class="${ticket.arivalDaySearch ? 'bg-warning' : ''}"
                >${ticket.arrivalDay} <br> ${ticket.arrivalTime}</td>
                <td>${ticket.ticketPriceFormated}</td>
            </tr>
        `
    })

    //*********** TIMER ***********
    
    let timerOutput = Array.from(document.getElementsByClassName('timer'))
    // reset timer
    clearInterval(displayTimer)
    // start timer
    displayTimer = setInterval(() => {
        tickets.forEach((item, index) => {
            timerOutput[index].innerText = item.timer()
        })
    }, 1000)
}

let sortDescending = selector => {
    return (a, b) => {
        if ( a[selector] < b[selector] ){
          return -1;
        }
        if ( a[selector] > b[selector] ){
          return 1;
        }
        return 0;
    }
}

let sortAscending = selector => {
    return (a, b) => {
        if (a[selector] > b[selector]) {
          return -1;
        }
        if (a[selector] < b[selector]) {
          return 1;
        }
        return 0;
    }
}

//-------------- OBJECT --------------

class Destination {
    constructor(language) {
        // initiate current distination's time
        this.trainsDayTime = moment()
        this.timeNowMilliseconds = this.trainsDayTime.unix()

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
        // this.addRundomNumOfDays = this.trainsDayTime.add(getRandomNum(1), 'd')
        this.setDepartureDay = this.currentLanguage !== 'uk' ? this.trainsDayTime.add(getRandomNum(6), 'd').get('day') : this.trainsDayTime.add(getRandomNum(6), 'd').get('day')
        this.departureDayOfWeek = this.currentLanguage !== 'uk' ? daysOfWeek.en[this.setDepartureDay] : daysOfWeek.uk[this.setDepartureDay]
        this.departureDay = this.currentLanguage !== 'uk' ?
                            daysOfWeek.en[this.setDepartureDay] === daysOfWeek.en[today] ? 'Today' : daysOfWeek.en[this.setDepartureDay] :
                            daysOfWeek.uk[this.setDepartureDay] === daysOfWeek.uk[today] ? 'Сьогодні' : daysOfWeek.uk[this.setDepartureDay]
        // highlight today's ticket
        this.departureToday = daysOfWeek.uk[this.setDepartureDay] === daysOfWeek.uk[today]

        //*********** DEPARTURE TIME ***********
        // if today, departure time starts from the current time
        this.departureH = this.departureToday ?
                        this.trainsDayTime.set('hour', getRandomNum(24, currentHours)).get('hour') : this.trainsDayTime.set('hour', getRandomNum(24, 0)).get('hour')
        this.departureM = this.departureToday ?
                        this.trainsDayTime.set('minute', getRandomNum(59, currentMinutes + 10)).get('minute') : this.trainsDayTime.set('minute', getRandomNum(59, 0)).get('minute')
        this.departureTime = `${this.departureH < 10 ? '0' + this.departureH : this.departureH}:${this.departureM < 10 ? '0' + this.departureM : this.departureM}`

        // units for timer
        this.departureMilliseconds = this.trainsDayTime.unix()
        this.diffTime = this.departureMilliseconds - this.timeNowMilliseconds
        this.durationTime = moment.duration(this.diffTime * 1000, 'milliseconds')

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
                        this.departureToday && ((today + 1) === 7 ? 0 : (today + 1)) === this.trainsDayTime.get('day') ?
                        'Tomorrow' : this.departureToday && today === this.trainsDayTime.get('day') ?
                        'Today' : daysOfWeek.en[this.trainsDayTime.get('day')] :
                        this.departureToday && ((today + 1) === 7 ? 0 : (today + 1)) === this.trainsDayTime.get('day') ?
                        'Завтра' : this.departureToday && today === this.trainsDayTime.get('day') ?
                        'Сьогодні' : daysOfWeek.uk[this.trainsDayTime.get('day')] 
        this.arrivalMiliseconds = this.trainsDayTime.unix()
        
        //*********** SEARCH ***********
        this.trainNumberSearch = false
        this.departureSearch = false
        this.arrivalSearch = false
        this.departureDaySearch = false
        this.arivalDaySearch = false
    }
        
    // display remaining time till departure
    timer() {
        this.durationTime = moment.duration(this.durationTime - 1000, 'milliseconds')

        let day = this.durationTime.get('day') < 10 ? '0' + this.durationTime.get('day') : this.durationTime.get('day')
        let hour = this.durationTime.get('hour') < 10 ? '0' + this.durationTime.get('hour') : this.durationTime.get('hour')
        let minute = this.durationTime.get('minute') < 10 ? '0' + this.durationTime.get('minute') : this.durationTime.get('minute')
        let second = this.durationTime.get('second') < 10 ? '0' + this.durationTime.get('second') : this.durationTime.get('second')

        return `${day} ${hour}:${minute}:${second}`
    }
}

//-------------- EXECUTION LOGIC --------------
// array with tickets
let tickets = []

const generateTable = (nOfTrains) => {
    // empty tickets array
    tickets = []
    // save default language to LocalStorage
    if(localStorage.getItem('language') === null) {
        localStorage.setItem('language', 'uk')
    }
    let language = localStorage.getItem('language')
    // create tickets
    for(let i = 0; i < nOfTrains; i++) {
        let ticket = new Destination(language)
        tickets.push(ticket)
    }
    // display en or uk table heading
    if(language === 'uk') {
        tableHead.innerHTML = languageHead.uk
    } else {
        tableHead.innerHTML = languageHead.en
    }

    renderTable()

    // show table
    table.classList.add('active')
}

// emulating server request
const requestTickets = numberOfTrains => {
    output.innerHTML = ''
    spinner.classList.add('active')

    let serverStatus = true
    let processingTime = 0

    if(numberOfTrains < 50) {
        processingTime = 1000
    } else if(numberOfTrains >= 50 && numberOfTrains < 100) {
        processingTime = 3000
    } else {
        processingTime = 5000
    }

    return new Promise((resolve, reject) => setTimeout(() => {
        if(serverStatus) {
            resolve(numberOfTrains)
        } else {
            reject('Server is not responding')
        }
    }, processingTime))
}

const executeApp = (nOfTrains) => {
    table.classList.remove('active')
    requestTickets(nOfTrains)
        .then(nOfTrains => {
            spinner.classList.remove('active')
            generateTable(nOfTrains)
            saveBtn.disabled = false
        }) 
        .catch(error => console.error(error))
}

// change language of schedule on btn toggle
const changeLanguage = () => {
    let currentLanguage = localStorage.getItem('language')
    if(currentLanguage === null || currentLanguage === 'uk') {
        localStorage.setItem('language', 'en')
    } else {
        localStorage.setItem('language', 'uk')
    }
}

// save generated schedule to a TXT file
saveBtn.addEventListener('click', () => {
    let data = []
    let language = tickets[0].engTest
    let date = `${m.get('date') < 10 ? '0' + m.get('date') : m.get('date')}.${m.get('month')}.${m.get('year')}`
    let counter = 0
    let fileName = language ? `Розклад_${date}.txt` : `Schedule_${date}.txt`

    // language defined descriptions
    let departure = language ? 'Відправлення:' : 'Departure:'
    let arrival = language ? 'Прибуття:' : 'Arrival:'
    let price = language ? 'Ціна:' : 'Price:'

    tickets.forEach(ticket => {
        counter++
        let record = `${counter}. ${ticket.trainNumber}${ticket.trainLetter} - ${ticket.cityA} - ${ticket.cityB} - ${departure} ${ticket.departureDay} ${ticket.departureTime} - ${arrival} ${ticket.arrivalDay} ${ticket.arrivalTime} - ${price} ${ticket.ticketPriceFormated}`
        data.push(record)
    })
    // add spaces && replace '"
    let modified = JSON.stringify(data, null, " ").replace(/]|[[]|[,'"]+/g, '')

    saveToFile(fileName , modified)
})

// modal btns events
modalBtns.addEventListener('click', e => {
    e.preventDefault()
    if(e.target.id === 'cancel') {
        executeApp(getNumberOfTrains(null))
    } else if(e.target.id === 'get_schedule') {
        if(!userInput.value.match(/^[0-9]+$/) && userInput.value.length !== 0) {
            alert('Only digits are allowed!')
        } else if(userInput.value > 100) {
            alert("You've exceeded the maximum number of trains! Enter a number which is below or equal 100")
        } else if(userInput.value === '' || userInput.value < 1) {
            alert("You forgot to enter the number of trains!")
        } else {
            executeApp(userInput.value)
        }  
    }
    userInput.value = null
})

// sorting
tableHead.addEventListener('click', e => {
    if(e.target.id === 'by_number') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('trainNumber')) : tickets.sort(sortAscending('trainNumber'))
    } else if(e.target.id === 'by_dep-city') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('cityA')) : tickets.sort(sortAscending('cityA'))
    } else if(e.target.id === 'by_arr-city') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('cityB')) : tickets.sort(sortAscending('cityB'))
    } else if(e.target.id === 'by_day') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('departureDayOfWeek')) : tickets.sort(sortAscending('departureDayOfWeek'))
    } else if(e.target.id === 'by_dep-timer' || e.target.id === 'by_dep_time') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('departureMilliseconds')) : tickets.sort(sortAscending('departureMilliseconds'))
    } else if(e.target.id === 'by_arr-day') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('arrivalMiliseconds')) : tickets.sort(sortAscending('arrivalMiliseconds'))
    } else if(e.target.id === 'by_price') {
        e.target.classList.toggle('reverse')
        e.target.className === 'reverse' ? tickets.sort(sortDescending('ticketPrice')) : tickets.sort(sortAscending('ticketPrice'))        
    }
    renderTable()
}) 


// searching
search.addEventListener('submit', e => {
    e.preventDefault()
    let category = searchCategory.value
    let searchValue = searchInput.value

    let searchKeys = [
        'trainNumberSearch',
        'departureSearch',
        'arrivalSearch',
        'departureDaySearch',
        'arivalDaySearch'
    ]

    let patt = new RegExp(searchValue.toLowerCase())

    if(tickets.length !== 0) {
        if(searchValue.length === 0) {
            alert('You forgot to enter your search...')
            return
        }
        tickets.forEach(item => {
            searchKeys.forEach(key => item[key] = false)
            if(category === 'trainNumber') {
                if(patt.test(item[category])) {
                    item.trainNumberSearch = true
                }
            } else if(category === 'cityA') {
                if(patt.test(item[category].toLowerCase())) {
                    item.departureSearch = true
                }
            } else if(category === 'cityB') {
                if(patt.test(item[category].toLowerCase())) {
                    item.arrivalSearch = true
                } 
            } else if(category === 'departureDayOfWeek') {
                if(patt.test(item[category].toLowerCase())) {
                    item.departureDaySearch = true
                } 
            } else if(category === 'arrivalDay') {
                if(patt.test(item[category].toLowerCase())) {
                    item.arivalDaySearch = true
                } 
            }
        })
    } else {
        alert('Generate the schedule first!')
    }

    

    renderTable()
    searchInput.value = ''
})