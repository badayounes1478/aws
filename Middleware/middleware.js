const multer = require('multer')
const jwt = require('jsonwebtoken');


//verify the token
 const verifyToken = (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    //Check if token is undefined
    if (typeof bearerToken !== 'undefined') {
      //split the space
      const bearer = bearerToken.split(' ')
      //get token from the array
      const token = bearer[1]
      //set to the req
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            res.sendStatus(403)
          } else {
              next()
          }
      })
    } else {
      res.sendStatus(403)
    }
  }

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


  module.exports ={
    upload,
    verifyToken
  } 