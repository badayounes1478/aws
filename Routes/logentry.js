const express = require('express');
const {addLog, getLogAsPerPage, deleteLogAndImages, sendImageData} = require('../controller/logentry')
const { verifyToken, upload } = require('../Middleware/middleware')
const router = express.Router();


//uploading the log information
router.post('/log', verifyToken, upload, addLog )

//getting all logs
router.get('/log',verifyToken, getLogAsPerPage)

//delete the folder
router.delete('/log/:id', verifyToken, deleteLogAndImages)

//send the image data
router.get('/uploads/:path', sendImageData)



module.exports = router
