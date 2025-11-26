const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes imports



// Middleware imports

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('public/uploads'));

// Routes

app.use('/api/welcome', require('./routes/welcome'));
app.use('/api/bookings',require('./routes/bookings'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/amenities', require('./routes/amenities'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));






mongoose.connect('mongodb+srv://kogila:1234@cluster0.6zacfyq.mongodb.net/resort_app?retryWrites=true&w=majority&appName=Cluster0').then(()=>{console.log('MongoDB connected successfully')})
.catch((err)=>{console.log('MongoDB connection error:' , err)});

app.listen(5000, ()=>{console.log("Server is connected")});