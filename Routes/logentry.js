const express = require('express');
const logs = require('../Schema/logentry');
const multer = require('multer')
const fs = require("fs");


const router = express.Router();

//configuring the multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage }).array('photos', 10)


//uploading the log information
router.post('/log', upload, (req, res) => {
  const file = req.files
  if (!file) {
    const error = new Error('Please upload a file')
    res.status(400).send(error)
  }
  const name = file.map(data => {
    return data.destination + data.filename
  })
  req.body.images = name
  logs.create(req.body).then(data => {
    res.status(201).json({ message: 'created' })
  }).catch(err => {
    res.status(500).json({ message: err })
  })
})

//getting all logs
router.get('/log', (req, res) => {
  const pagination = req.query.pagination ? parseInt(req.query.pagination) : 5;
  const page = req.query.page ? parseInt(req.query.page) : 1
  logs.find({})
    .skip((page - 1) * pagination)
    .limit(pagination)
    .then(data => {
      res.send(data)
    })
})

//delete the folder
router.delete('/log/:id', (req, res) => {
  logs.find({ _id: req.params.id }).then(data1 => {
    if (data1.length === 0) {
      return res.status(404).json({ message: "record not found" });
    } else {
      logs.deleteOne({ _id: req.params.id }).then(data => {
        let n = data1[0].images.length
        for (let index = 0; index < n; index++) {
          fs.unlinkSync(data1[0].images[index])
        }
        res.send("delete sucess")
      })
    }
  })
})

router.get('/uploads/:path', (req, res) => {
  const file = fs.createReadStream("uploads/"+req.params.path)
  res.writeHead(206, { 'Content-Type': 'image/jpg' });
  file.pipe(res);
})


module.exports = router
