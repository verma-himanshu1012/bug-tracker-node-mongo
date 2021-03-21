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

app.get('/', (req, res) => { 
    let today = new Date();

    bugsModel.find((err, data) => {
        if(err) res.status(500).send(err);
        else {

            data.forEach((bug) => {
                let date = new Date(bug.reported);
                //date.setDate(date.getDate() + 3);

                let today = new Date();

                bug.daysLeft = 3 - (dateTimeHelper.dateDiffInDays(date, today));

            });

            res.render('index.ejs', { 
                message: " ",
                reported : today,
                time: `${dateTimeHelper.formatAmPm(today)}`,
                date: `${dateTimeHelper.formatDate(today)}`,
                bugs: data
            });
        }
    });
});


app.post('/', (req, res) =>{

    let today = new Date();

    bugsModel.create(req.body, (err, data) => {
        if(err) res.status(500).send(err);
        else {

            bugsModel.find((err, data) => {
                if(err) res.status(500).send(err);
                else {

                    data.forEach((bug) => {
                        let date = new Date(bug.reported);
                        //date.setDate(date.getDate() + 3);
        
                        let today = new Date();
        
                        bug.daysLeft = 3 - (dateTimeHelper.dateDiffInDays(date, today));
        
                    });

                    res.render('index.ejs', {
                        message : 'Bug Added to Tracker',
                        reported : today,
                        time: `${dateTimeHelper.formatAmPm(today)}`,
                        date: `${dateTimeHelper.formatDate(today)}`,
                        bugs: data
                    });
                }
            });
        }
    });
});


////////  Server
const port = 3000;
app.listen(port, (err) => {
    if(err) console.log(err);
    console.log(`listening on port ${port}`);
});