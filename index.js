const express = require('express')
const app = express()
const port = process.env.PORT||4100;
require('dotenv').config();
const  bodyParser = require('body-parser')
const cors=require('cors');
app.use(cors());
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.77ufn.mongodb.net/ClothStore?retryWrites=true&w=majority`;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ProductCollection = client.db("ClothStore").collection("Products");
  const OrderCollection=client.db('ClothStore').collection('Order');


app.post('/addProduct',(req,res)=>{
    const NewProduct=req.body;
    ProductCollection.insertOne(NewProduct)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
})

 app.post('/productByKey',(req,res)=>{
        const productkey=req.body;
        ProductCollection.find({key:{ $in: productkey}})
        .toArray((err,document)=>{
            res.send(document)
        })
    })

    app.post('/addOrder',(req,res)=>{
      const Products=req.body;
      OrderCollection.insertOne(Products)
      .then(result=>{
         res.send(result.insertedCount>0);
      })
  })

app.get('/products',(req,res)=>{

    ProductCollection.find({})
    .toArray((err,document)=>{
        res.send(document)
    })
})

//Delete One Product
app.get('/deleteProduct/:id',(req,res)=>{
    console.log(req.params.id)
    ProductCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((result)=>{
        res.send(result.deletedCount>0)
    })
})

//Get One Product
app.get('/productbykey/:id',(req,res)=>{

  ProductCollection.find({_id:ObjectId(req.params.id)})
  .toArray((err,document)=>{
    res.send(document[0]);
    // console.log(err);
  })
})
app.get('/orders', (req, res) => {
  OrderCollection.find({email:req.query.email })
  .toArray((err, result) => {
    res.send(result);
  })
})



  console.log("Database connected")
});
