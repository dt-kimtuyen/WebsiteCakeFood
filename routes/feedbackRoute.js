// feedbackRoute.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, isAdmin } = require('../middlewares/authorization');


router.get('/', feedbackController.getAllFeedback);  
router.post('/', verifyToken, feedbackController.createFeedback);  
router.put('/:id', verifyToken, feedbackController.updateFeedback); 
router.delete('/:id', verifyToken, feedbackController.deleteFeedback); 

module.exports = router;  