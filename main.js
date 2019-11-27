//-------------- DOM --------------

const run = document.getElementById('run')
const output = document.getElementById('output')

//-------------- DATA --------------

// dates
const date = new Date()
const today = date.getDay() - 1
const currentHours = date.getHours()
const currentMinutes = date.getMinutes()

const letters = [ 'Ш', 'К', 'Б', 'С', 'П', 'В' ]

const cities = [
    'Київ',
    'Харків',
    'Львів',
    'Одеса',
    'Дніпро'
]

const daysOfWeek = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'Пятниця',
    'Субота',
    'Неділя'
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
        this.trainNumber = getRandomNum(150, 100)
        this.trainLetter = letters[getRandomItem(letters)]
        this.cityASelector = getRandomItem(cities)
        this.cityA = cities[this.cityASelector]
        this.avaliableCities = [...cities.filter(city => city !== this.cityA)]

        this.cityBSelector = getRandomItem(this.avaliableCities)
        this.cityB = this.avaliableCities[this.cityBSelector]
        // departure time
        this.hourOfDeparture = getRandomNum(23, currentHours)
        this.hourOfDepartureFormated = this.hourOfDeparture < 10 ? `0${this.hourOfDeparture}` : this.hourOfDeparture

        this.minuteOfDeparture = getRandomNum(59, currentMinutes + 5)
        this.minuteOfDepartureFormated = this.minuteOfDeparture < 10 ? `0${this.minuteOfDeparture}` : this.minuteOfDeparture

        this.timeOfDeparture = `${this.hourOfDepartureFormated}:${this.minuteOfDepartureFormated}`

        // day of week
        this.departureDayRandom = daysOfWeek[getRandomItem(daysOfWeek)]
        this.departureDayTime = this.departureDayRandom === daysOfWeek[today] ? `Сьогодні` : this.departureDayRandom
        this.departureToday = this.departureDayRandom == daysOfWeek[today]
        // average train speed
        this.averageSpeed = getRandomNum(120, 80)
        // distance to cityB
        this.distanceToCityB = distances[this.cityASelector][this.cityBSelector]
        // commute time        
        this.commuteTime = this.distanceToCityB / this.averageSpeed
        // ticket price
        this.ticketPrice = this.commuteTime * 40.251
        this.ticketPriceFormated = this.ticketPrice.toFixed(2)

        // arrival time
        // this.arrivalTime = Math.round(this.commuteTime) +
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
                <td>${ticket.departureDayTime} <br> ${ticket.timeOfDeparture} </td>
                <td>Неділя <br> 16:00</td>
                <td>${ticket.ticketPriceFormated}</td>
            </tr>
        `
    })
})




