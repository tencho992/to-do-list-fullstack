const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://tenzinc:tenzinc@burn-notice.ofi7dnh.mongodb.net/?retryWrites=true&w=majority";
const dbName = "todolist";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`! on port 3000");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('task').find().toArray((err, result) => {
    if (err) return console.log(err)
    const completeCount = getCount(result)
    res.render('index.ejs', {messages: result, count: completeCount})
  })
})
function getCount(arrayResults){
  const newArray = arrayResults.filter(item => item.completed === false)
  return newArray.length
}
app.post('/messages', (req, res) => {
  console.log('1')
  db.collection('task').insertOne({ 
    msg: req.body.msg, 
    completed: false
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


app.put('/messages/completed', (req, res) => {
  console.log('2')
  db.collection('task').findOneAndUpdate({msg: req.body.msg}, {
    
    $set: {
      completed: req.body.completed
    }
  }, {
    sort: {_id: -1}, 
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  console.log('3')
  db.collection('task').deleteMany({}, (err, result) => {
    if (err) {
      console.error('Error deleting collection:', err);
      res.status(500).json({ error: 'Failed to delete collection' });
    } else {
      console.log('Collection deleted successfully.');
      res.json({ message: 'Collection deleted successfully!' });
    }
  })
})
 
