// warehouseRoute.js
const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const { verifyToken, isAdmin } = require('../middlewares/authorization');  

router.get('/', warehouseController.getAllWarehouses);  
router.post('/', verifyToken, isAdmin, warehouseController.createWarehouse);  
router.put('/:id', verifyToken, isAdmin, warehouseController.updateWarehouse); 
router.delete('/:id', verifyToken, isAdmin, warehouseController.deleteWarehouse); 

module.exports = router;  
