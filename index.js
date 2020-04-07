const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());

mongoose.connect('mongodb://localhost:27017/aws_test',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        if (err) {
            console.log("Failed to connect")
        }
    })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', require("./Routes/authentication"))
app.use('/add', require('./Routes/logentry'))


app.listen(process.env.PORT || 4000, () => {
    console.log('Server listening')
})