//-------------- DOM --------------

const run = document.getElementById('run')
const output = document.getElementById('output')

//-------------- DATA --------------

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
    constructor(cityA) {
        this.trainNumber = getRandomNum(150, 100)
        this.trainLetter = letters[getRandomItem(letters)]
        this.cityA = cityA
        this.avaliableCities = [...cities.filter(city => city !== this.cityA)]
        this.cityB = this.avaliableCities[getRandomItem(this.avaliableCities)]
    }
}

//-------------- MAIN LOGIC --------------

const today = new Date().getDay()

run.addEventListener('click', () => {
    output.innerHTML = ''
    // get Avaliable trains
    let numberOfTrainsAvaliable = getNumberOfTrains(prompt('Enter the number of trains...'))
    // array with destinations
    let tikets = []
    // create tikets
    for(let i = 0; i < numberOfTrainsAvaliable; i++) {
        let ticket = new Destination(cities[getRandomItem(cities)])
        tikets.push(ticket)
    }
    // forEach/map array to the table
    
    tikets.forEach(tiket => {
        output.innerHTML += `
            <tr>
                <td>${tiket.trainNumber}${tiket.trainLetter}</td>
                <td>${tiket.cityA}</td>
                <td>${tiket.cityB}</td>
                <td>субота</td>
                <td>Субота 06:30</td>
                <td>Неділя 16:00</td>
                <td>425,00</td>
            </tr>
        `
    })
})




