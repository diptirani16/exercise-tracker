function add(num1, num2, cb) {
    if(isFinite(num1) && isFinite(num2)) cb(null, num1+ num2)
    else cb(new Error('num1 & num2 should be a number'), null)
}

add(1,2, (err, data) => {
    if(err) console.log(err)
    else console.log(data)
})


function addPromise(num1, num2) {
    return new Promise((resolve, reject) => {
        if(isFinite(num1) && isFinite(num2)) resolve(num1 + num2)
        else reject(new Error('num1 & num2 should be number'))
    })
}

(async function(){
    try {
        const x = await addPromise(1, 'jkjk')
        console.log(x)
    } catch (error) {
        console.log(error)
    }
})()
