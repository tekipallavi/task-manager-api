const { MongoClient, ObjectID}= require('mongodb');
const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = 'task-manager';
const id  = new ObjectID();
//console.log(id.id.length);
//console.log(id.toHexString().length);
//console.log(id.getTimestamp());

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => {

    if(error){
        return console.log("Unable to connect to database");
    }    
    const db = client.db(databaseName);
    //begin delete multiple documents
    db.collection('tasks').deleteMany({
        description : "read javascript"
    }).then(result => {
        console.log(result)
    }).catch(error => {
        console.log("unable to delte docs",error)
    })
    //end delete multiple documents

     //begin update multiple documents
    /*  db.collection('tasks').updateMany({
        completed :  false
    },{
        $set: {
          completed : true
        }
    }).then(res => {
        console.log(res);
    }).catch( error => {
        console.log("unable to update docs", error);
    }) */
    //end update multiple documents


    //begin update single document
  /*   db.collection('users').updateOne({
        _id: new ObjectID("601c0c9bfd658153d883f9ce")
    },{
        $inc: {
            age: 1
        }
    }).then(res => {
        console.log(res);
    }).catch( error => {
        console.log("unable to update doc", error);
    }) */
    //end update single document

    //begin read multiple docs
  /*   db.collection('tasks').find({completed: false}).toArray((error, res) => {
        if(error){
            return console.log("Unable to read documents", error);
        }   
        console.log(res);
    }); */
    //end read multiple docs

    //begin read single document
   /*  db.collection('tasks').findOne({_id: new ObjectID("601c1032058f3107d47d1df2")}, (error, res) => {
        if(error){
            return console.log("Unable to read document", error);
        }   
        console.log(res);
    }) */
    //end read single document

    //begin create a single document with id
  /*   db.collection('users').insertOne({_id: id, name: 'hemanth', age: 25},(err, result) => {
        if(error){
            return console.log("Unable to insert document", err);
        }   
    }); */
    //end create a single document with id

    // begin create bulk documents
 /*    db.collection('tasks').insertMany([
        {
            description: 'read node js tutorial',
            completed : false
        },{
            description: 'read javascript',
            completed : false
        },{
            description: 'read angular tutorial',
            completed : true
        }

    ], (err, result) => {
        if(error){
            return console.log("Unable to insert document");
        }   
        console.log(result.ops); 
    }) */
    // end create documents

})



