const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number, // đơn giá tại thời điểm đặt hàng
    required: true
  }
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
