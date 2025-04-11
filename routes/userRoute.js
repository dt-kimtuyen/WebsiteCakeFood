const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authorization');  // Import verifyToken từ file authorization.js

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', verifyToken, isAdmin, userController.getAll);  
router.delete('/:id', verifyToken, isAdmin, userController.delete);  
router.put('/:id', verifyToken, isAdmin, userController.update);  



module.exports = router;
