const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const dbHost = process.env.DB_HOST, dbName = process.env.DB_NAME,
    dbUser = process.env.DB_USER, dbPass = process.env.DB_PASS;

const db = mongoose.connect(dbHost + '/' + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: dbUser,
    pass: dbPass
})

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const bugsModel = require('./models/bug');

const dateTimeHelper = require('./_util/helpers');

/////// Routes

let formatResponseData = (res, page, data, message) => {

    let today = new Date();

    data.forEach((bug) => {
        let date = new Date(bug.reported);
        bug.daysLeft = 3 - (dateTimeHelper.dateDiffInDays(date, today));
        bug.daysLeft = bug.daysLeft < 0 ? 0 : bug.daysLeft;
    });

    res.render(page, { 
        message: message,
        reported : today,
        time: `${dateTimeHelper.formatAmPm(today)}`,
        date: `${dateTimeHelper.formatDate(today)}`,
        bugs: data
    });
};


app.get('/', (req, res) => { 

    bugsModel.find((err, data) => {
        if(err) res.status(500).send(err);
        else {
            formatResponseData(res, 'index.ejs', data, " " );
        }
    });
});

Date.prototype.isValid = function () { 
              
    // If the date object is invalid it 
    // will return 'NaN' on getTime()  
    // and NaN is never equal to itself. 
    return this.getTime() === this.getTime(); 
}; 

app.post('/', (req, res) =>{

    if(!req.body.reported || !req.body.reported.isValid()) req.body.reported = new Date();

    bugsModel.create(req.body, (err, data) => {
        if(err) res.status(500).send(err);
        else {

            bugsModel.find((err, data) => {
                if(err) res.status(500).send(err);
                else {
                    formatResponseData(res, 'index.ejs', data, "Bug Added to Tracker");
                }
            });
        }
    });
});


app.get('/admin', (req, res) => { 

    bugsModel.find((err, data) => {
        if(err) res.status(500).send(err);
        else {
            formatResponseData(res, 'admin.ejs', data, " " );
        }
    });
});

app.post('/resolve/:id', (req, res) => {

    console.log(req.params.id);
    bugsModel.updateOne({ _id: req.params.id }, { resolved: true }, (err, result) => {
        if(err) console.log(err);
        res.redirect('/admin');
    });
});



////////  Server
const port = 3000;
app.listen(port, (err) => {
    if(err) console.log(err);
    console.log(`listening on port ${port}`);
});