const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdiiu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 500;

app.get('/', (req, res) =>{
    res.send("heroku is not workingsdfdf")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");

  app.post('/addAppointment', (req, res) =>{
      const appointment = req.body;
      appointmentCollection.insertOne(appointment)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  });

  app.get('/appointments', (req, res) =>{
      appointmentCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents);
        })
  })

  app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    appointmentCollection.find({date: date.date})
                .toArray((err, documents) => {
                    res.send(documents);
                })
            
        
})


    

});

app.listen(process.env.PORT || port);