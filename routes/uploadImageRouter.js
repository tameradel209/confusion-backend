const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const authentication = require('../authentication')
const cors = require('./cors')

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{callback(null, 'public/images')},
    filename: (req, file, callback) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const spliting = file.originalname.split('.')
        const extention = spliting[spliting.length-1]
        callback(null, file.fieldname+ '-' + uniqueSuffix+'.'+extention)
    }
})

const fileFilter = (req, file, callback) =>{
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)){
        return callback(new Error('file uploaded is not an image'))
    }
    callback(null, true)
}

const upload = multer({storage: storage, fileFilter: fileFilter})

const UploadImageRouter = express.Router()

UploadImageRouter.use(bodyParser.json())


UploadImageRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{res.sendStatus(200)})

.get(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    const err = new Error('GET operation is not supported')
    err.status = 403
    next(err)
})

.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, upload.array('images', 3), (req, res) =>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(req.files)
})

.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    const err = new Error('PUT operation is not supported')
    err.status = 403
    next(err)
})

.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyAdmin, (req, res, next) =>{
    const err = new Error('DELETE operation is not supported')
    err.status = 403
    next(err)
})

module.exports = UploadImageRouter