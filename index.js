const express= require('express');
const cors=require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
const port=process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3moahdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
   
    //APIS----------------------------

    const galleryCollections= client.db('graphic-design-school').collection('gallery');
    const userCollections= client.db('graphic-design-school').collection('users');
    const aboutUsCollections = client.db('graphic-design-school').collection('aboutUs');
    

   app.get('/aboutus', async (req, res) => {
  const result = await aboutUsCollections.find().toArray();
  res.send(result);
});
    
// user related apis  
    app.post('/users', async (req, res) => {
    const user = req.body;
    try {
        // Check if the user with the given email already exists
        const existingUser = await userCollections.findOne({ email: user.email });
        
        if (existingUser) {
            
            const updatedUser = await userCollections.updateOne(
                { email: user.email },
                { $set: { name: user.name, phone: user.phone } }
            );
            
            
            res.send({
                name: user.name,
                phone: user.phone,
                email: user.email,
                _id: existingUser._id 
            });
        } else {
            
            const result = await userCollections.insertOne(user);
            res.send({
                name: user.name,
                phone: user.phone,
                email: user.email,
                _id: result.insertedId 
            });
        }
    } catch (err) {
        res.status(500).send({ error: 'Error processing request' });
    }
});

    

  
//getting user data

app.get('/users', async (req, res) => {
  const email = req.query.email;

  if (email) {
    const user = await userCollections.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send([user]); 
  }

  const users = await userCollections.find().toArray();
  res.send(users);
});


//make admin


app.patch('/users/admin/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      role: 'admin',
    },
  };
  const result = await userCollections.updateOne(filter, updateDoc);
  res.send(result);
});



// get user role by email 

app.get('/users/admin/:email', async (req, res) => {
  const email = req.params.email;
  const user = await userCollections.findOne({ email });
  res.send({ isAdmin: user?.role === 'admin' });
});


//add photo to gallery 

app.post('/gallery', async (req, res) => {
  const newPhoto = req.body;
  const result = await galleryCollections.insertOne(newPhoto);
  res.send(result);
});


//delete 


app.delete('/gallery/:id', async (req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result =await galleryCollections.deleteOne(query);
  res.send(result)
})



    app.get('/gallery', async(req,res)=>{
        const cursor =galleryCollections.find();
        const result=await cursor.toArray();
        res.send(result);

    })


 //Update about us --------------------------------------------------------

    app.patch('/aboutus/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      title: updatedData.title,
      description: updatedData.description
    }
  };
  const result = await aboutUsCollections.updateOne(filter, updateDoc);
  res.send(result);
});



// PATCH: Update About Us Photo
app.patch('/aboutus/photo/:id', async (req, res) => {
  const id = req.params.id;
  const { photo_url } = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      photo_url: photo_url
    }
  };
  const result = await aboutUsCollections.updateOne(filter, updateDoc);
  res.send(result);
});


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
   res.send("This is graphic server")
})

app.listen(port,()=>{
    console.log(`graphic server is running at : ${port}`)
})