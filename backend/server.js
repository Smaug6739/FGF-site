require('babel-register');
const express = require('express');
const app = express();
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./assets/swagger.json');
//const expressOasGenerator = require('express-oas-generator');
//expressOasGenerator.init(app, {}); // to overwrite generated specification's values use second argument.
const  morgan = require('morgan')('dev');
const bodyParser = require('body-parser');
const config = require('./config.js');

const {checkAndChange} = require('./util/functions');

const apiRouterV1Members = require('./routes/member')
const apiRouterV1Articles = require('./routes/articles')
const apiRouterV1Album = require('./routes/album')
const apiRouterV1Forum = require('./routes/forum')
const apiRouterV1DirectMessage = require('./routes/dm')
const apiRouterV1Request = require('./routes/requests')

    if(!config.prod) app.use(morgan)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true}))

    

    //ROUTES
    app.use("/api/v1/members", apiRouterV1Members);
    app.use("/api/v1/articles", apiRouterV1Articles);
    app.use("/api/v1/album", apiRouterV1Album);
    app.use("/api/v1/forum", apiRouterV1Forum);
    app.use("/api/v1/dm", apiRouterV1DirectMessage);
    app.use("/api/v1/request", apiRouterV1Request);

    app.all('*', (req, res)=>{
        res.status(404)
        res.json(checkAndChange(new Error("404 not found")))
    })
  

app.listen(config.port, () => console.log('Started on port '+ config.port));
    

