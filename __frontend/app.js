require('babel-register');
const express = require('express');
const session = require('express-session');
const path = require("path")//NODE
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')
const app = express();
const  morgan = require('morgan')('dev');
const bodyParser = require('body-parser');
const config = require('./config.js');
const {statusUser} = require('./functions')
const routerMembers = require('./routes/members')
const routerAdmin = require('./routes/admin')
const routerForum = require('./routes/forum')
const routerSite = require('./routes/site')
const routerArticles = require('./routes/articles')
const routerAlbum = require('./routes/album')
const routerRequests = require('./routes/requests')



/*db = require("./util/mongoose");
db.init();*/

const mongooseDB = "mongodb://localhost:27017/fgfsitefrontend"
const mongOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds //5000
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity  //45000
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.connect(mongooseDB,mongOptions)
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: "A5H2G2V",
    name: 'member-space',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    expires: new Date(Date.now() + (6 * 60 * 1000)/*(30 * 86400 * 1000)*/),
    cookie: {}
}));
    
    if(!config.prod) app.use(morgan)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true}))
    const server = app.listen(config.port, () => console.log('Started on port '+ config.port));
    /*const io = require('socket.io')(server);  
   
    io.sockets.on("connection", function (socket) {
    // Everytime a client logs in, display a connected message
    console.log("Server-Client Connected!");
   
    socket.join("_room" + socket.handshake.query.room_id);
   
    socket.on('connected', function (data) {
   
      });
   });*/
   
   //const socketIoObject = io;
   //module.exports.ioObject = socketIoObject;
    app.use('/member',routerMembers)
    app.use('/forum',routerForum)
    app.use('/site',routerSite)
    app.use('/admin',routerAdmin)
    app.use('/articles',routerArticles)
    app.use('/album',routerAlbum)
    app.use('/request',routerRequests)
    app.use('/static', express.static(path.join(__dirname, 'public')));
    app.get('/', async(req, res) => {
        res.render(`${__dirname}/pages/index.ejs`,{
            userConnected : await statusUser(req.session)
        })
    });
    
    app.get('/uploads/:dir/:image', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, `uploads/${req.params.dir}/${req.params.image}`));
    });
    app.get('/error', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'pages/error.ejs'));
    });
    app.get('/config-api', (req, res) => {
        res.status(200).send({api:config.urlAPI})
    });
    

    app.use(async function(err, req, res, next) {
        if(err){
            if(err.message.match('File too large')){
                res.render(path.join(__dirname, '/pages/error.ejs'),{
                    userConnected : await statusUser(req.session),
                    error : "Le fichier est trop gros."
                })
            }
        }
    });
    app.get('/terms', async (req, res)=>{
        res.status(404)
        res.render(path.join(__dirname, '/pages/terms.ejs'),{
            userConnected : await statusUser(req.session),
        })
    })
    app.get('/privacy', async (req, res)=>{
        res.status(404)
        res.render(path.join(__dirname, '/pages/privacy.ejs'),{
            userConnected : await statusUser(req.session),
        })
    })
      app.all('*', async (req, res)=>{
        res.status(404)
        res.render(path.join(__dirname, '/pages/404.ejs'),{
            userConnected : await statusUser(req.session),
        })
    })

    /*io.on('connection', () =>{
        console.log('A user is connected')
    })*/
    /*app.get('/admin',(req,res) => {
        if(req.session.user){
            if(req.session.user.userAdmin){
                const userConnected = statusUser(req)
                console.log("ADMIN : YES")
                axios.get(`http://localhost:8080/api/v1/members/`, {
                    userID: req.session.user.userID,
                    userAdmin: req.session.user.userAdmin
                })
                .then((responce) => {
                    console.log(responce.data.status)
                    res.render(`${__dirname}/pages/admin.ejs`,{
                        members : responce.data.result,
                        userConnected : userConnected
                    })
                })
                .catch((error) => {
                    res.render(`${__dirname}/pages/error.ejs`, {
                        error : error,
                        userConnected : userConnected
                    })
                });
            } else res.redirect("/")
        } else res.redirect("/")
        
    })*/
    /*app.get('/admin/update/:id',(req,res) => {
        if(req.session.user){
            if(req.session.user.userAdmin){
                axios.get(`http://localhost:8080/api/v1/members/${req.params.id}`, {
                    userID: req.session.user.userID,
                    userAdmin: req.session.user.userAdmin
                })
                .then((responce) => {
                    console.log(responce.data.status)
                    res.render(`${__dirname}/pages/adminupdate.ejs`,{
                        member : responce.data.result,
                        userConnected : 'admin'
                    })
                })
                .catch((error) => {
                    console.log(error)
                    res.render(`${__dirname}/pages/error.ejs`,{
                        error : error,
                        userConnected : 'admin'
                    })
                });
            } else res.redirect("/")
        } else res.redirect("/")
        
    })*/



   /* app.post('/login', (req, res) => {
            axios.get(`http://localhost:8080/api/v1/members/${req.body.pseudo}/${req.body.pass}`)
            .then(result =>{
                responce = result.data 
                if(responce.status === "success"){
                    req.session.user = {
                        userID: responce.result.userID,
                        userAdmin : responce.result.userAdmin
                    }
                      res.redirect('/account')
                }else res.redirect('/login')
            })
            .catch(error =>{
                res.render(`${__dirname}/pages/error.ejs`,{
                    error : error,
                    userConnected : false
                })
            })
    });*/
    /*app.post('/members/add', (req, res) => {
        function redirect(url){
            res.redirect(url)
        }
        axios.post('http://localhost:8080/api/v1/members', {
            pseudo : req.body.pseudo,
            password :req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        })
        .then((res) => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
            if(res.data.status === 'error'){
                redirect('/error?error=' + res.data.message);
            }else if(res.data.status === 'success') redirect('/login');
        })
        .catch((error) => {
            res.render(`${__dirname}/pages/error.ejs`,{
                error : error,
                userConnected : false
            })
        })
    });*/
    /*app.post('/:id/update', (req, res) => {
        const userConnected = statusUser(req);
        axios.put(`http://localhost:8080/api/v1/members/${req.params.id}`, {
            pseudo : req.body.pseudo,
            password :req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        })
        .then((responce) => {
            if(responce.data.status === 'error'){
                res.render(`${__dirname}/pages/error.ejs`,{
                    error : responce.data.message,
                    userConnected : userConnected
                })
            }else if(responce.data.status === 'success') res.redirect('/account');
        })
        .catch((error) => {
            res.render(`${__dirname}/pages/error.ejs`,{
                error : error,
                userConnected : userConnected
            })
        })
    });*/
    /*app.post('/:id/delete', (req, res) => {
        const userConnected = statusUser(req)
        axios.delete(`http://localhost:8080/api/v1/members/${req.params.id}`)
        .then((res) => {

            if(res.data.status === 'error'){
                res.render(`${__dirname}/pages/error.ejs`,{
                    error : res.data.message,
                    userConnected : userConnected
                })
            }else if(res.data.status === 'success') res.redirect('/destroyusersession');
        })
        .catch((error) => {
            console.error(error)
        })
    });*/


    /*app.post('/admin/updatemember/:id', (req, res) => {
        const userConnected = statusUser(req)
        axios.put(`http://localhost:8080/api/v1/members/${req.params.id}`, {
            pseudo : req.body.pseudo,
            password :req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        })
        .then((responce) => {
            if(responce.data.status === 'error'){
                res.render(`${__dirname}/pages/error.ejs`,{
                    error : responce.data.message,
                    userConnected : userConnected
                })
            }else if(responce.data.status === 'success') res.redirect('/admin');
        })
        .catch((error) => {
            res.render(`${__dirname}/pages/error.ejs`,{
                error : error,
                userConnected : userConnected
            })
        })
    });*/
    /*app.post('/admin/deletemember/:id', (req, res) => {
        const userConnected = statusUser(req)
        axios.delete(`http://localhost:8080/api/v1/members/${req.params.id}`)
        .then((responce) => {
            if(responce.data.status === 'error'){
                res.render(`${__dirname}/pages/error.ejs`,{
                    error : responce.data.message,
                    userConnected : userConnected
                })
            }else if(responce.data.status === 'success') redirect('/admin');
        })
        .catch((error) => {
            res.render(`${__dirname}/pages/error.ejs`,{
                error : error,
                userConnected : userConnected
            })
        })
    });*/
    
        
    

