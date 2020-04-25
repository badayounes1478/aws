const logs = require('../Schema/logentry');
const fs = require("fs");

const addLog = async (req, res) => {
  const file = req.files
  if (!file) {
    const error = new Error('Please upload a file')
    res.status(400).send(error)
  }
  const name = file.map(data => {
    return data.destination + data.filename
  })
  req.body.images = name
  try {
    const data = await logs.create(req.body)
    res.status(201).json({ message: 'created' })
  } catch (error) {
    res.status(500).json({ message: err })
  }
}

const getLogAsPerPage = async (req, res) => {
  const pagination = req.query.pagination ? parseInt(req.query.pagination) : 5;
  const page = req.query.page ? parseInt(req.query.page) : 1
  try {
    const data = await logs.find({})
      .skip((page - 1) * pagination)
      .limit(pagination)
    res.send(data)
  } catch (error) {
    res.status(500).json({ message: err })
  }
}

const deleteLogAndImages = async (req, res) => {
  try {
    const data1 = await logs.find({ _id: req.params.id })
    if (data1.length === 0) {
      return res.status(404).json({ message: "record not found" });
    } else {
      const data = await logs.deleteOne({ _id: req.params.id })
      let n = data1[0].images.length
      for (let index = 0; index < n; index++) {
        fs.unlinkSync(data1[0].images[index])
      }
      res.send("delete sucess")
    }
  } catch (error) {
    res.status(500).json({ message: err })
  }
}

const likeLog = async (req, res) => {
  try {
      const post = await logs.findById({ _id: req.params.logid })
      if (post.likedby.includes(req.params.userid)) {
          res.status(200).json({ message: "you allready liked" })
      } else {
          post.likedby.push(req.params.userid)
          post.likes++;
          const data = await post.save()
          res.status(200).json({ message: 'post liked' })
      }
  } catch (error) {
      res.status(500).send(error)
  }
}

const dislikeLog = async (req, res) => {
  try {
      const post = await logs.findById({ _id: req.params.logid })
      if (post.likedby.includes(req.params.userid)) {
          const arrayIndex = post.likedby.indexOf(req.params.userid);
          post.likedby.splice(arrayIndex, 1);
          post.likes--;
          const data = await post.save()
          res.status(200).json({ message: 'unliked'})
      } else {
          res.status(404).json({ message: 'you allready unliked' })
      }
  } catch (error) {
      res.status(500).send(error)
  }
}

const sendImageData = (req, res) => {
  const file = fs.createReadStream("uploads/" + req.params.path)
  res.writeHead(206, { 'Content-Type': 'image/jpg' });
  file.pipe(res);
}

module.exports = {
  addLog,
  getLogAsPerPage,
  deleteLogAndImages,
  sendImageData,
  likeLog,
  dislikeLog
}