const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuvex.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hi, This is a proper Database.....")
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const laptopCollection = client.db("laptopmela").collection("products");
    const orderCollection = client.db("laptopmela").collection("orders");

    app.post('/addProduct', (req, res) => {
        const newLaptop = req.body;
        laptopCollection.insertOne(newLaptop)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    });

    app.get('/products', (req, res) => {
        laptopCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.get('/product/:id', (req, res) => {
        laptopCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orderHistory', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        mobileCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
})



app.listen(port)