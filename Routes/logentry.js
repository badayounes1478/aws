const express = require('express');
const {dislikeLog ,likeLog ,addLog, getLogAsPerPage, deleteLogAndImages, sendImageData } = require('../controller/logentry')
const { verifyToken, upload } = require('../Middleware/middleware')
const logs = require('../Schema/logentry');
const router = express.Router();


//uploading the log information
router.post('/log', verifyToken, upload, addLog)

//getting all logs
router.get('/log', verifyToken, getLogAsPerPage)

//delete the folder
router.delete('/log/:id', verifyToken, deleteLogAndImages)

//send the image data
router.get('/uploads/:path', sendImageData)

//like the log
router.put('/like/:logid/:userid', likeLog)

//unlike the log
router.put('/dislike/:logid/:userid', dislikeLog)



module.exports = router
