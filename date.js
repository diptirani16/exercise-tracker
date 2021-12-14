let yourDate = new Date()
console.log(yourDate)
console.log(yourDate.toISOString().split('T')[0])
// const offset = yourDate.getTimezoneOffset()
// yourDate = new Date(yourDate.getTime() - (offset*60*1000))
// console.log(yourDate.toISOString().split('T')[0])

