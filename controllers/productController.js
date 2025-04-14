const Category = require('../models/Category');
const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null
    console.log(image);
    const newProduct = new Product({
      name,
      description,
      price,
      categoryId,
      image
    })

    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    console.error('Create Product Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    const updateData = {
      name,
      description,
      price,
      categoryId
    }

    if (image) {
      updateData.image = image
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(updatedProduct)
  } catch (error) {
    console.error('Update Product Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
  
  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      console.error(' Lỗi khi lấy sản phẩm:', err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

exports.deleteProduct = async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
  
      if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  
      res.json({ message: 'Xoá thành công' });
    } catch (err) {
      console.error(' Lỗi xoá:', err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

