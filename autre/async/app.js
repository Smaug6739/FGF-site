require('babel-register');
console.log('Debut')
new  Promise((resolve, reject) => {
    setTimeout(() =>{
        //resolve("OK")
        reject((new Error('Error')))
    }, 1500)
})
.then( message => console.log(message))
.catch(err => console.log(err.message))

console.log('Fin')
