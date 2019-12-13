let arr = []



const genRandN = (max, min) => {
    return Math.floor(Math.random() * (max - min)) + min
}

class Train {
    constructor(name, departure, price) {
        this.name = name
        this.departure = departure
        this.price = price
    }
}

let increment = 0

for(let i = 0; i < 10; i++) {
    increment++
    let obj = new Train(`Name${increment}`, genRandN(50, 10), genRandN(250, 100))
    arr.push(obj)
}

console.log(arr)

let compare = (a, b) => {
    const orderA = a.price;
    const orderB = b.price;
    let comparison = 0;
    if(orderA > orderB) {
        comparison = 1;
    } else if(orderA < orderB) {
        comparison = -1;
    }
    return comparison;
}



arr.sort(compare)

console.log(arr)


