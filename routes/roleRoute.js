const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, isAdmin } = require('../middlewares/authorization'); 


router.post('/create', verifyToken, isAdmin, roleController.createRole);  
router.get('/', verifyToken, roleController.getAllRoles);       
router.get('/:id', verifyToken, roleController.getRoleById);   
router.put('/:id', verifyToken, isAdmin, roleController.updateRole);    
router.delete('/:id', verifyToken, isAdmin, roleController.deleteRole);  

  
module.exports = router;
