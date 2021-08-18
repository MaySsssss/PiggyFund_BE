const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var cors = require('cors');
var ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test@cluster0.cbjkw.mongodb.net/PiggyFund?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.get('/getall', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})


app.get('/getallincome', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Income').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Income').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})

app.get('/getallbudget', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Budgets').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Budgets').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})

app.get('/updatebudget', (req, res) => {
  // http://localhost:3000/updatebudget?amount=100&month=April
  var category = req.query.category ? req.query.category : "Food";
  var amount = req.query.amount ? req.query.amount : 0;
  var currency = req.query.currency ? req.query.currency : "Aud";
  var month = req.query.month ? req.query.month : "January";
  var userid = req.query.userid ? req.query.userid : "1"; 
  console.log("updatebudget");
  console.log(userid);
  let requestJson = {
    "Category": category,
    "Amount": parseInt(amount),
    "Currency": currency,
    "Month": month,
    "UserID": parseInt(userid)  
  }
  console.log(requestJson);
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Budgets');
    cursor.findOne({"Category": category, "Month": month, "UserID": parseInt(userid)}, {$exists: true}, function(err, res){
        if (!res) {
          cursor.insertOne(requestJson);
        } else {
          console.log(res + " : respo5555nese\n")
          cursor.findOneAndUpdate({"Category": category, "Month": month, "UserID": parseInt(userid)}, { $inc: {"Amount": parseInt(amount)} });
        }
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Budgets');
      cursor.findOne({"Category": category, "Month": month, "UserID": parseInt(userid)}, {$exists: true}, function(err, res){
        console.log(res + " : responese\n")
        if (!res) {
          cursor.insertOne(requestJson);
        } else {
          console.log(res + " : respo555nese\n")
          cursor.findOneAndUpdate({"Category": category, "Month": month, "UserID": parseInt(userid)}, { $inc: {"Amount": parseInt(amount)} });
        }
    });
    });
  }
  res.send("done");
})

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function removeDuplicates(array) {
  output = [];
  array.forEach(function(item){
    var i = output.findIndex(x => x.value == item.value);
    if(i <= -1){
      output.push({"value": item.value, "label": item.value});
    }
  });

  return output;
}
app.get('/getallcategory', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(removeDuplicates(arr));
      }
        if (item){
          arr.push({"value": item["Category"], "label": item["Category"]})
        }
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(removeDuplicates(arr));
        }
        if (item){
          arr.push({"value": item["Category"], "label": item["Category"]})
        }
      });
    })
  };
})

app.get('/deletebudget', (req, res) => {
  // http://localhost:3000/deletebudget?id=5f8f8edaa315790067f562ed
  var id = req.query.id;
  if (!id){res.send("id required")}
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Budgets');
    cursor.remove({ _id: new ObjectId(id)});
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Budgets');
      cursor.remove({ _id: new ObjectId(id)});
    });
  }
  res.send("done");
})


app.get('/getallusers', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Users').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Users').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})

app.get('/validate', (req, res) => {
  if (!req.query.email){return res.send("email required")}
  var email = req.query.email ? req.query.email : "may@gmail.com";
  if (!req.query.password){return res.send("password required")}
  var password = req.query.password;

  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Users');
    cursor.findOne({"Email": email, "Password": password}, {$exists: true}, function(err, resp){
    if (!resp){
      console.log("doenst exist");
      res.send({"valid": false});
    }
    res.send({"valid": true});
  });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Users');
      cursor.findOne({"Email": email, "Password": password}, {$exists: true}, function(err, resp){
        if (!resp){
          console.log("doenst exist");
          res.send({"valid": false});
        }
        res.send({"valid": true});
      });
    });
  }
})


app.get('/spending', (req, res) => {
  // http://localhost:3000/spending?category=Clothes&amount=-50&userid=2
  var category = req.query.category ? req.query.category : "Food";
  var amount = req.query.amount ? req.query.amount : "0";
  var currency = req.query.currency ? req.query.currency : "Aud";
  var now = new Date();
  var isoString = req.query.time ? req.query.time : now.toISOString();
  var userid = req.query.userid ? req.query.userid : "1";
  let requestJson = {
    "Category": category,
    "Amount": amount,
    "Currency": currency,
    "Time": isoString,
    "UserID": parseInt(userid) 
  }
  if (client.isConnected()) {
    // collection.findOne({"_id": new ObjectId(id)}, function(err, doc) {
    var cursor = client.db("PiggyFund").collection('Spendings');
    cursor.insertOne(requestJson);
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings');
      cursor.insertOne(requestJson);
    });
  }
  res.send("done");
})




app.get('/deletespending', (req, res) => {
  // http://localhost:3000/deletespending?id=5f8f8edaa315790067f562ed
  var id = req.query.id;
 
  if (!id){res.send("id required")}
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings');
    cursor.remove({ _id: new ObjectId(id)});
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings');
      cursor.remove({ _id: new ObjectId(id)});
    });
  }
  res.send("done");
})

app.get('/updateuser', (req, res) => {
  // http://localhost:3000/spending?category=Clothes&amount=50
  if (!req.query.userid){return res.send("object id required")}
  var userID = req.query.userid ? req.query.userid : 1;
  if (!req.query.objid){return res.send("object id required")}
  var requestID = req.query.objid;
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Users');
    cursor.findOneAndUpdate({"UserID": parseInt(userID)}, { $push: {"Spendings": new ObjectId(requestID)} });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Users');
      cursor.findOneAndUpdate({"UserID": parseInt(userID)}, { $push: {"Spendings": new ObjectId(requestID)} });
    });
  }
  res.send("done");
})




app.get('/updateincome', (req, res) => {

  // http://localhost:3000/updateincome?userid=1&month=March&income=6000

  if (!req.query.userid){return res.send("Userid required")}
  var userid = req.query.userid;
  if (!req.query.month){return res.send("month required")}
  var month2 = req.query.month;
  if (!req.query.income){return res.send("income required")}
  var income = req.query.income;


  let requestJson = {
    "UserId": parseInt(userid) ,
  }
  requestJson[month2] =parseInt(income);

  let varJson = {};
  varJson[month2] =parseInt(income);
  
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Income');
    cursor.findOne({"UserId": parseInt(userid)}, {$exists: true}, function(err, res){
        if (!res) {
          cursor.insertOne(requestJson);
        } else {
          cursor.findOneAndUpdate({"UserId": parseInt(userid)}, { $set: varJson});
        }
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Income');
      cursor.findOne({"UserID": parseInt(userid)}, {$exists: true}, function(err, res){
          if (!res) {
            cursor.insertOne(requestJson);
          } else {
            cursor.findOneAndUpdate({"UserId": parseInt(userid)}, { $set: varJson});
          }
      });
    });
  }
  res.send("done");



})



// user information
app.get('/getuserinfo', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('UserInfo').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('UserInfo').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})

app.get('/updateuserinfo', (req, res) => {
  // http://localhost:3000/updateuserinfo?firstname=mm&lastname=LL&userid=1
  if (!req.query.userid){return res.send("object id required")}

  var firstname = req.query.firstname ? req.query.firstname : "Meisi";
  var lastname = req.query.lastname ? req.query.lastname : "LI";
  var userid = req.query.userid ? req.query.userid : "1"; 

  let requestJson = {
    "firstname": firstname,
    "lastname": lastname,
    "UserID": parseInt(userid) 
  }
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('UserInfo');
    cursor.findOne({"UserID": parseInt(userid)}, {$exists: true}, function(err, res){
        if (!res) {
          cursor.insertOne(requestJson);
        } else {
          // console.log(res + " : responese\n")
          cursor.findOneAndUpdate({"UserID": parseInt(userid)}, { $set: { "firstname" : firstname, "lastname" : lastname} });
        }
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('UserInfo');
      cursor.findOne({"UserID": parseInt(userid)}, {$exists: true}, function(err, res){
          if (!res) {
            cursor.insertOne(requestJson);
          } else {
            // console.log(res + " : responese\n")
            cursor.findOneAndUpdate({"UserID": parseInt(userid)}, { $set: { "firstname" : firstname, "lastname" : lastname} });
          }
      });
    });
  }
  res.send("done");
})


// Reminder 
app.get('/getreminder', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Reminder').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Reminder').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})

app.get('/addreminder', (req, res) => {
  // http://localhost:3000/addreminder?message=test&time=${data}&userid=1
  var message = req.query.message ? req.query.message : "test message";
  var now = new Date();
  var isoString = req.query.time ? req.query.time : now.toISOString();
  var userid = req.query.userid ? req.query.userid : "1";
  let requestJson = {
    "Time": isoString,
    "Message": message,
    "UserID": parseInt(userid) 
  }
  if (client.isConnected()) {
    // collection.findOne({"_id": new ObjectId(id)}, function(err, doc) {
    var cursor = client.db("PiggyFund").collection('Reminder');
    cursor.insertOne(requestJson);
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Reminder');
      cursor.insertOne(requestJson);
    });
  }
  res.send("done");
})

app.get('/deletereminder', (req, res) => {
  // http://localhost:3000/deletereminder?id=5f8f8edaa315790067f562ed
  var id = req.query.id;
 
  if (!id){res.send("id required")}
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Reminder');
    cursor.remove({ _id: new ObjectId(id)});
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Reminder');
      cursor.remove({ _id: new ObjectId(id)});
    });
  }
  res.send("done");
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})