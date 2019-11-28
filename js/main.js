//-------------- DOM --------------

const run = document.getElementById('run')
const output = document.getElementById('output')
const spinner = document.querySelector('.sk-circle')

//-------------- DATA --------------

// dates
const m = moment()
const today = m.get('day')
const currentHours = m.get('hour')
const currentMinutes = m.get('minute')

const letters = [ 'Ш', 'К', 'Б', 'С', 'П', 'В' ]

const daysOfWeek = [
    'Неділя',
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'Пятниця',
    'Субота'
]

const cities = [
    'Київ',
    'Харків',
    'Львів',
    'Одеса',
    'Дніпро'
]

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
    let defaultNTrains = 2 * (cities.length * (cities.length - 1) / 2)
    return userDefinedNOfTrains !== null ? Number(userDefinedNOfTrains) : defaultNTrains
}

//-------------- OBJECTS --------------

class Destination {
    constructor() {
        // initiate current distination's time
        this.trainsDayTime = moment()

        //*********** TRAIN N && L ***********
        this.trainNumber = getRandomNum(150, 100)
        this.trainLetter = letters[getRandomItem(letters)]

        //*********** DEPARTURE CITY ***********
        this.cityASelector = getRandomItem(cities)
        this.cityA = cities[this.cityASelector]
        this.avaliableCities = [...cities.filter(city => city !== this.cityA)]

        //*********** ARRIVAL CITY ***********
        this.cityBSelector = getRandomItem(this.avaliableCities)
        this.cityB = this.avaliableCities[this.cityBSelector]

        //*********** DEPARTURE DAY ***********
        // day of week
        this.setDepartureDay = this.trainsDayTime.set('day', getRandomItem(daysOfWeek)).get('day')
        this.departureDayOfWeek = daysOfWeek[this.setDepartureDay]
        this.departureDay = daysOfWeek[this.setDepartureDay] === daysOfWeek[today] ? 'Сьогодні' : daysOfWeek[this.setDepartureDay]
        // highlight today's ticket
        this.departureToday = daysOfWeek[this.setDepartureDay] === daysOfWeek[today]

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
        this.arrivalDay = this.departureToday && (today + 1) === this.trainsDayTime.get('day') ?
                        'Завтра' : this.departureToday && today === this.trainsDayTime.get('day') ?
                        'Сьогодні' : daysOfWeek[this.trainsDayTime.get('day')]
    }
}

//-------------- EXECUTION LOGIC --------------

const generateTable = (nOfTrains) => {
    // clear table
    output.innerHTML = ''
    // array with tickets
    let tickets = []
    // create tickets
    for(let i = 0; i < nOfTrains; i++) {
        let ticket = new Destination()
        tickets.push(ticket)
    }
    // render all tickets    
    tickets.forEach(ticket => {
        output.innerHTML += `
            <tr class="${ticket.departureToday ? 'bg-info' : ''}">
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

run.addEventListener('click', () => {
    let numberOfTrainsAvaliable = getNumberOfTrains(prompt('Enter the number of trains...'))
    requestTickets(numberOfTrainsAvaliable)
        .then(nOfTrains => {
            spinner.classList.remove('active')
            generateTable(nOfTrains)
        }) 
        .catch(error => console.error(error))
})