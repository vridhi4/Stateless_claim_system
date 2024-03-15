const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const app = express();

const PORT = 8001;

// connection

mongoose
.connect('mongodb://localhost:27017/database-3')
.then(() => console.log("MongoDB connected") )
.catch((err) => console.log("Mongo error", err));


//schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: false
    },
    email: {
        type: String, 
        required: false,
        unique: true
    },
    gender: {
        type: String, 
        required: false
    }
});

//model

const User = mongoose.model("user", userSchema);
//const users = require("./MOCK_DATA.json")

//middleware/plugin 
app.use(express.urlencoded({extended : false}));


//routes
app.get("/api/users", (req,res)=> {
    return res.json(users);
})

app.get("/api/users/:id", (req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user)
})

app.post("/api/users", (req,res)=> {
    const body = req.body;
    console.log("Body", body);
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        return res.json({status : "Success", id: users.length});
    })
});

app.patch("/api/users/:id", (req,res)=> {
    const id = Number(req.params.id);
    //read file
    const body = req.body;
    console.log("Body", body);
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
        return res.json({status : "Success", id: users.length});
    })
});

app.delete("/api/users/:id", (req,res)=>{
    const id = Number(req.params.id)
    
    fs.readFile('./MOCK_DATA.json', 'utf8', (err, data)=>{
        if(err)
        {
            return res.status(500).json({ message: "Error reading users file" });
        }
    

    const index = users.findIndex(user => user.id === id);
    console.log("index :", index);

   if (index !== -1) {
    users.splice(index, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), () => {
        return res.json({ status: "Success" });
    });
}
  
});
    



})



app.listen(PORT, () => console.log(`server started at ${PORT}`));
