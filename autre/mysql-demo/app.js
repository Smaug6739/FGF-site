require('babel-register')
const mysql = require('mysql')
const db = mysql.createConnection({
    host:'localhost',
    database: 'nodejs',
    user: 'root',
    password: ''
})

db.connect((err) =>{
    if(err) console.log(err)
    else {
        console.log('Connecté avec sucès')
        db.query('INSERT  INTO members(name) VALUES("Jhon")', (err, result) =>{
            if(err){
                console.log(err.message)
            }else{
                console.log(result)
            }
        })
    }
})