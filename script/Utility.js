// Source: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
const getRandomItem = (items) => {
    return items[Math.floor(Math.random() * items.length)];
}

export {
    getRandomItem
}