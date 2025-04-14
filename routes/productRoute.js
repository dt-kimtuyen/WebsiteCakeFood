const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authorization');  
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


router.get('/', productController.getAllProducts);  
router.post('/', verifyToken, isAdmin, upload.single('image'), productController.createProduct);  
router.put('/:id', verifyToken, isAdmin, upload.single('image'), productController.updateProduct);  
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);  

module.exports = router;
