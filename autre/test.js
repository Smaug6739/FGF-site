const express = require('express')
const  morgan = require('morgan')
const {success,error} = require('functions')
const bodyParser = require('body-parser')
const config = require('./config')

const app = express()

app.use(morgan('dev'))
//Permet de loguer l'URL utiliser a chaque requette

  const members = [
    {
      id : 1,
      name : 'Smaug 1'
    },
    {
      id : 2,
      name : 'Smaug 2'
    },
    {
      id : 3,
      name : 'Smaug 3'
    }
  ]
let MembersRouter = express.Router()
//Initialisation du routeur
console.log(members)
//Logue tous les membres de base
app.use(morgan('dev'))
//Permet de loguer l'URL utiliser a chaque requette
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
//Les deux lignes





MembersRouter.route('/:id')

        //Recupere un membre avec son ID
        .get((req,res)=>{
          let index =getIndex(req.params.id)
          if(typeof(index)=='string'){
        res.json(error(index))
          }else{
          res.json(success(members[index]))
          }
          res.json(success(members[(req.params.id)-1].name))
        })




        //Modifie un membre avec son ID
        .put((req,res)=>{
          let index =getIndex(req.params.id);

          if(typeof(index)=='string'){
        res.json(error(index))

          }else{
            let same = false
            for(let i = 0;i< members.length;i++){
            if(req.body.name == members[i].name && req.params.id != members[i].id){
              same = true
              break
            }
            
          }
          if (same){
        res.json(error('same name'))
          }else{
            members[index].name = req.body.name
            res.json(success(true))
          }
          }
        })




        //Suprimme un membre avec son ID
        .delete((req,res)=>{

          let index =getIndex(req.params.id);

          if(typeof(index)=='string'){
              res.json(error(index))

          }else{
            members.splice(index,1)
            res.json(success(members))
          }
        })





MembersRouter.route('/')
          //Recupere tous les membres
          .get((req,res)=>{
            if(req.query.max != undefined && req.query.max >0){
              res.json(success(members.slice(0,req.query.max)))
            }else if(req.query.max != undefined){
              res.json(error('Valeur inconue...'))
            }else{
              res.json(success(members))
            }
          })




          //Ajoute un membre avec son nom
          .post((req,res) => {
            if(req.body.name){
              let sameName = false
              for(let i = 0; i<members.length;i++){
                if (members[i].name == req.body.name ){
                  
                  sameName = true
                  break
                }

              }
              if(sameName){
                res.json(error('nom deja utiliser'))
              }else{
                let member = {
                  id : createID(),
                  name : req.body.name
                }
                members.push(member)
              res.json(success(member))
              }
              
              }else{
            
            res.json(error('Nom invalide'))
            }
          })





app.use(config.rootAPI+'members',MembersRouter)
//Donne le chemin de base du routeur MembersRouter
app.listen(config.port,() => console.log('API démarer avec succés sur le port ' +config.port ))
//Le code va ecouter sur le port définie dans le fichier config.json
//Le code va envoyer le message 'API démarer' a chaque fois que le serveur sera lancer

function getIndex(id){
for(let i = 0;i< members.length;i++){
if(members[i].id==id)
return i
 
}
return 'wrong id'
}
function createID(){
return members[members.length-1].id +1
}