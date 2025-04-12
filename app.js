const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const Category = require('./models/Category');
const Product = require('./models/Product');

const homeRoutes = require('./routes/homeRoutes');
const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Để load CSS, ảnh tĩnh
app.use('/uploads', express.static('uploads')); // Load ảnh từ thư mục uploads

// View Engine - PUG
app.set('view engine', 'pug');
app.set('views', './views');

mongoose.connect('mongodb://localhost:27017/websitefood1')
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.log("Lỗi kết nối MongoDB:", err));


  // Route để hiển thị trang chủ với danh mục và sản phẩm
app.get('/', async (req, res) => {
  try {
    // Lấy danh mục và sản phẩm từ cơ sở dữ liệu
    const categories = await Category.find({});
    const products = await Product.find({});

    res.render('index', { categories, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy dữ liệu');
  }
});

// API Routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/categories', require('./routes/categoryRoute'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/feedbacks', require('./routes/feedbackRoute'));
app.use('/api/warehouses', require('./routes/warehouseRoute'));
app.use('/api/blogs', require('./routes/blogRoute'));
app.use('/api/roles', require('./routes/roleRoute'));

app.use('/', homeRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
