const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { verifyToken, isAdmin } = require('../middlewares/authorization');  // Import verifyToken và isAdmin từ authorization.js

router.get('/', blogController.getAllBlogs);  // Dành cho cả Admin và User
router.post('/', verifyToken, isAdmin, blogController.createBlog); 
router.put('/:id', verifyToken, isAdmin, blogController.updateBlog); 
router.delete('/:id', verifyToken, isAdmin, blogController.deleteBlog); 

module.exports = router;  
