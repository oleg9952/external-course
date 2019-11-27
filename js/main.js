//-------------- DOM --------------

const run = document.getElementById('run')
const output = document.getElementById('output')

//-------------- DATA --------------

// dates
const m = moment()
const today = m.get('day')
const currentHours = m.get('hour')
const currentMinutes = m.get('minute')

const letters = [ 'Ш', 'К', 'Б', 'С', 'П', 'В' ]

const cities = [
    'Київ',
    'Харків',
    'Львів',
    'Одеса',
    'Дніпро'
]

const daysOfWeek = [
    'Неділя',
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'Пятниця',
    'Субота'
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
        this.departureDayRandom = daysOfWeek[getRandomItem(daysOfWeek)]
        this.departureDay = this.departureDayRandom === daysOfWeek[today] ? `Сьогодні` : this.departureDayRandom
        // highlight today's train
        this.departureToday = this.departureDayRandom == daysOfWeek[today]

        //*********** DEPARTURE TIME ***********
        this.trainsDayTime = moment()
        // if today, departure time starts from the current time
        this.departureH = this.departureToday ? this.trainsDayTime.set('hour', getRandomNum(23, currentHours)).get('hour') : this.trainsDayTime.set('hour', getRandomNum(23, 0)).get('hour')
        this.departureM = this.departureToday ? this.trainsDayTime.set('minute', getRandomNum(59, currentMinutes + 10)).get('minute') : this.trainsDayTime.set('minute', getRandomNum(59, 0)).get('minute')
        this.departureTime = `${this.departureH < 10 ? '0' + this.departureH : this.departureH}:${this.departureM < 10 ? '0' + this.departureM : this.departureM}`



        //*********** TICKET PRICE ***********
        // average train speed
        this.averageSpeed = getRandomNum(120, 80)
        // distance to cityB
        this.distanceToCityB = distances[this.cityASelector][this.cityBSelector]
        // commute time        
        this.commuteTime = this.distanceToCityB / this.averageSpeed
        // ticket price
        this.ticketPrice = this.commuteTime * 40.251
        this.ticketPriceFormated = this.ticketPrice.toFixed(2)

        //*********** ARRIVAL TIME && DAY ***********
        // arrival time
        
    }
}

//-------------- MAIN LOGIC --------------

run.addEventListener('click', () => {
    output.innerHTML = ''
    // get Avaliable trains
    let numberOfTrainsAvaliable = getNumberOfTrains(prompt('Enter the number of trains...'))
    // array with destinations
    let tickets = []
    // create tickets
    for(let i = 0; i < numberOfTrainsAvaliable; i++) {
        let ticket = new Destination()
        tickets.push(ticket)
    }
    // forEach/map array to the table
    
    tickets.forEach(ticket => {
        output.innerHTML += `
            <tr class="${ticket.departureToday ? 'bg-info' : ''}">
                <td>${ticket.trainNumber}${ticket.trainLetter}</td>
                <td>${ticket.cityA}</td>
                <td>${ticket.cityB}</td>
                <td>${ticket.departureDayRandom}</td>
                <td>${ticket.departureDay} <br> ${ticket.departureTime} </td>
                <td>Неділя <br> 16:00</td>
                <td>${ticket.ticketPriceFormated}</td>
            </tr>
        `
    })
})