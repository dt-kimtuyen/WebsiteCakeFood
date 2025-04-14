
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authorization');  


router.get('/',verifyToken ,orderController.getOrders);  
router.get('/all',verifyToken ,orderController.getAllOrders); 

router.post('/', verifyToken, orderController.createOrder);  
router.put('/:id', verifyToken, isAdmin, orderController.updateOrder); 
router.delete('/:id', verifyToken, isAdmin, orderController.deleteOrder); 
module.exports = router;
