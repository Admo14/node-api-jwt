 const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt')
const {sign} = require('jsonwebtoken')
const app = express();
const dotenv = require('dotenv').config()
const personschema = new mongoose.Schema({
	name: String
}, {collection: 'person'})
const userSchema = new mongoose.Schema({
		username: String,
		password: String
}, {collection: 'user'});
mongoose.connect('mongodb://localhost:27017/test5', {useNewUrlParser: true, useUnifiedTopology: true});
const User = mongoose.model('User', userSchema)
const Person = mongoose.model('Person', personschema)
app.use(express.json());
const auth = jwt({secret: process.env.SECRET, algorithms: ['HS256'] })
app.post('/register',  (req,res)=>{
		new User({username: req.body.username, password: req.body.password}).save().then(()=>res.send({'message': 'user registered'})) 
})
app.get('/token', (req,res)=>{
User.findOne({username: req.body.username, password: req.body.password}).select('username -_id').then((data)=>res.send({token: sign({user: data}, process.env.SECRET)}))
})
app.get('/people', auth, (req,res)=>{
 Person.find({}).then((data)=>res.send({data}))
})


app.post('/people', auth, (req,res)=>{
new Person({name: req.body.name}).save().then(()=>{
	res.send({message: 'new person created succesfully'})
}).catch((err)=>res.send({error: err}))
})
app.put('/people/:id', auth, (req,res)=>{
const id = req.params.id;
Person.findByIdAndUpdate(id, {name: req.body.name}).then(()=>res.send({message:`Person with id ${id} is updated.`}))

})
app.delete('/people/:id', auth, (req,res)=>{
const id = req.params.id;
Person.deleteOne({_id: id}).then(()=>res.send({message: `Person with id ${id} is deleted.`}))
})
app.get('/people/:id', auth, (req,res)=>{
const id = req.params.id;
Person.findOne({_id: id}).then(data=>res.send({data}))
})
app.listen(3000, ()=>console.log('server listening on: http://localhost:3000'))
