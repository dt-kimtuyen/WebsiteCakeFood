const Order = require('../models/Order');

// CREATE
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');
const User = require('../models/User');
const { use } = require('../routes/homeRoutes');
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id
    const { products } = req.body;
    console.log(products)
    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Thông tin đơn hàng không hợp lệ.' });
    }
    const user =await User.findById(userId);
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user,
      total,
      status : 'pending'
    });

    const orderDetails = await Promise.all(
      products.map(async item => {
        const product = await Product.findById(item.id);
        return {
          order: order._id,
          product: product._id, // dùng _id thôi, mongoose sẽ tự populate khi cần
          quantity: item.quantity,
          price: item.price
        };
      })
    );
    

    await OrderDetail.insertMany(orderDetails);

    res.status(201).json({
      message: 'Tạo đơn hàng thành công!',
      orderId: order._id
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng.' });
  }
};



// READ
exports.getOrders = async (req, res) => {
  try {
    // Lấy tất cả các đơn hàng của user hiện tại
    const orders = await Order.find({ user: req.user.id });

    // Với mỗi đơn hàng, tìm các order detail liên quan
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderDetail.find({ order: order._id })
          .populate('product', 'name price image'); // populate thêm sản phẩm

        return {
          ...order.toObject(),
          items 
        };
      })
    );

    res.status(200).json(ordersWithItems);
    console.log(ordersWithItems[0].items)
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username');

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderDetail.find({ order: order._id })
          .populate('product', 'name price image'); // populate thêm sản phẩm

        return {
          ...order.toObject(),
          items 
        };
      })
    );

    res.status(200).json(ordersWithItems);
    console.log(ordersWithItems[0].items)
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Cập nhật thành công', updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xoá đơn hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
