// routes/blogRoute.js
const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')
const { verifyToken, isAdmin } = require('../middlewares/authorization')
const multer = require('multer')

// Cấu hình lưu ảnh vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

// Blog API Routes
router.get('/', blogController.getAllBlogs)
router.post('/', verifyToken, isAdmin, upload.single('image'), blogController.createBlog)
router.put('/:id', verifyToken, isAdmin, upload.single('image'), blogController.updateBlog)
router.delete('/:id', verifyToken, isAdmin, blogController.deleteBlog)

module.exports = router
