const express = require('express')
const { postUser, loginUser } = require('../controllers/userControllers')
const router = express.Router()
const multer = require("multer");
const upload = multer();

router.post('/', upload.none(), postUser);
router.post('/login', upload.none(), loginUser);

module.exports = router