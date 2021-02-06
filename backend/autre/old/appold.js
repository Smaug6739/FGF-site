require('babel-register');
const express = require('express');
const path = require("path")//NODE
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
//const expressOasGenerator = require('express-oas-generator');
//expressOasGenerator.init(app, {}); // to overwrite generated specification's values use second argument.
const  morgan = require('morgan')('dev');
const {checkAndChange, success} = require('./assets/functions');
const bodyParser = require('body-parser');
const config = require('./assets/config.json');
const originAccess = "http://localhost:8081"

db = require("./util/mongoose");
db.init();


    let MembersRouter = express.Router()
    let Members = require('./assets/classes/members-class')(db, config)
    console.log(Members)
    app.use(morgan)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true}))
    app.use(`${config.rootAPI}api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if(req.method === 'OPTIONS'){
            res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
        }
        next()
      });

    MembersRouter.route('/')
        .get(async(req, res)=>{
            let Allmembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(Allmembers))
        })
        .post(async (req, res) =>{
        let addMember = await Members.add(
            req.body.pseudo,
            req.body.password,
            req.body.firstName,
            req.body.lastName,
            req.body.age,
            req.body.email,
            req.body.phoneNumber
            )
            .then((r) =>{ 
                res.json(checkAndChange(success(r)))
            })
            .catch((err) => { 
               res.json(checkAndChange(new Error(err)))
            })
        })

    MembersRouter.route('/:id')
        .post(async (req, res)=>{
            let member = await Members.getByID(req.params.id)
            res.json(checkAndChange(member))
        })
        .delete(async(req,res, next) =>{
            //REQ .BODY
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })
    MembersRouter.route('/:pseudo/:password')
        .get(async (req, res)=>{
            let member = await Members.getUser(req.params.pseudo, req.params.password)
            res.json(checkAndChange(member))
        })

    MembersRouter.route('/:id/update')
        .post(async(req, res) => {
            let updateMember = await Members.put(
            req.params.id, 
            req.body.pseudo,
            req.body.password,
            req.body.firstName,
            req.body.lastName,
            req.body.age,
            req.body.email,
            req.body.phoneNumber
            )
            .then((result) =>{ 
                res.json(checkAndChange(success(result)))
            })
            .catch((err) => { 
                res.json(checkAndChange(new Error(err)))
            })
        })
        .put(async(req, res) =>{
           let updateMember = await Members.put(
               req.params.id, 
               req.body.pseudo,
               req.body.password,
               req.body.firstName,
               req.body.lastName,
               req.body.age,
               req.body.email,
               req.body.phoneNumber
               )
           res.json(checkAndChange(updateMember))
        })

    MembersRouter.route('/:id/delete')
        .post(async(req,res) =>{
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))          
        })
        .get(async(req,res) =>{
            Members.delete(req.params.id)
            res.redirect('/admin')

        })
        .delete(async(req,res, next) =>{
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })

        
app.use(config.rootAPI+'members',MembersRouter)
app.listen(config.port, () => console.log('Started on port '+ config.port));
    

