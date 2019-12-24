const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const app = express();

mongoose.connect('mongodb://localhost/hitman');
let db = mongoose.connection;

app.use(express.static(path.join(__dirname,'views')));

//Load View Engine

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//Check connection 
db.once('open',()=>{
    console.log("Connected to MongoDB");
})

//Check for db errors 
db.on('error', function(err){
    console.log(err);
})

//Bring in Models
let info1 = require('./models/info');



//Landing page
app.get('/', (req, res)=>{
    res.render('index', {
    })
})

//Customer main page
app.get('/cust', (req, res)=>{
    res.render('cust', {})
})

//Available hitmen for customer
app.get('/cust/available', (req,res) => {
    info1.find({}, (err, response)=> {
        if(err){
            console.log(err);
        }
        else {
            res.render('cust-available', {
                title : 'Info',
                info: response
            })
        }
        
    })
})

//GET Customer booking page
app.get('/cust/book/:nick', (req, res)=> {
    res.render('cust-book', {
        nick : req.params.nick
    })
})



//Info page for hitmen
app.get('/info', (req,res) => {
    info1.find({}, (err, response)=> {
        if(err){
            console.log(err);
        }
        else {
            res.render('info', {
                title : 'Info',
                info: response
            })
        }
        
    })
})
// let info = new info1();
app.get('/info/add', (req, res)=>{
    res.render("add", {
        title: "SignUp for Hitmen"
    })
})


//Dashboard for Hitman
app.get('/info/:nick', (req, res) => {
    info1.find({nick: req.params.nick}, (err, response) =>{
        res.render('dashboard', {
            response1:response[0]
        })
    })
})


//Edit Hitman Details page
app.get('/info/edit/:nick', (req, res)=>{
    info1.find({nick: req.params.nick},(err, response)=>{
        res.render('editinfo', {
            response:response
        })
    })
})


//POST Booking
app.post('/cust/book/:nick', (req, res) => {
    let infoUpdate = {target :{ }};
    infoUpdate.target.name = req.body.name;
    infoUpdate.target.address = req.body.address;
    infoUpdate.target.way = req.body.description;
    infoUpdate.target.latitude = req.body.latitude;
    infoUpdate.target.longitude = req.body.longitude;
    infoUpdate.status = 'On Mission';

    console.log(infoUpdate);

    let query={ nick: req.params.nick}
    console.log(`query ${query}`);
    console.log(info1);
    
    info1.update(query, infoUpdate, (err) => {
        if(err) {
            console.log(err);
            return;
        }
        else{
            res.redirect('/');
        }
    })
})


//Removing orders
// app.post('/info/:nick', (req, res) => {
//     let infoUpdate = {target :{ }};
//     infoUpdate.target.name = '';
//     infoUpdate.target.address = '';
//     infoUpdate.target.way = '';
//     infoUpdate.status = 'Active';

//     console.log(infoUpdate);

//     let query={ nick: req.params.nick}
//     console.log(`query ${query}`);
//     console.log(info1);
    
//     info1.update(query, infoUpdate, (err) => {
//         if(err) {
//             console.log(err);
//             return;
//         }
//         else{
//             res.redirect('/info/'+req.params.nick);
//         }
//     })
// })


//Edit Hitman Details page POST
app.post('/info/edit/:nick', (req, res) => {
    let infoUpdate = {};
    infoUpdate.nick = req.body.nick;
    infoUpdate.email = req.body.email;
    infoUpdate.description = req.body.description;
    infoUpdate.password = req.body.password;

    let query={ nick: req.params.nick}
    
    info1.update(query, infoUpdate, (err) => {
        if(err) {
            console.log(err);
            return;
        }
        else{
            res.redirect('/info');
        }
    })
})


//Deleting user

app.delete('/info/:nick', (req, res) =>{
    let query = {nick : req.params.nick}
    info1.remove(query, (err)=>{
        if(err){
            console.log(err);
        }
        res.send('Success');
    })
});

//SignUp page

app.post('/info/add', (req, res) => {
    let info = new info1();
    info.nick = req.body.nick;
    info.email = req.body.email;
    info.description = req.body.description;
    info.password = req.body.password;
    info.target.name = '';
    info.target.address = '';
    info.target.way = '';
    info.status='Active';


    info.save((err) => {
        if(err) {
            console.log(err);
            return;
        }
        else{
            res.redirect('/info');
        }
    })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));