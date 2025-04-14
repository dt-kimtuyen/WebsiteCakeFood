
const Product = require('../models/Product');
const Category = require('../models/Category');

exports.homePage = async (req, res) => {
  try {
    const products = await Product.find({}); 
    const categories = await Category.find({}); 

    console.log(products); 
    console.log(categories); 
   
    res.render('index.pug', { products, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
