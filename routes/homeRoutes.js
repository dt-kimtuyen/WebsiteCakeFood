const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.homePage); // Khi người dùng truy cập vào '/', sẽ gọi homePage
module.exports = router;
