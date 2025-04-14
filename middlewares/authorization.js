
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  
  if (!token) return res.status(403).json({ message: 'Không có token' });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: 'Token không hợp lệ' });
    
 
    req.user = user;
    next();  
  });
};


const isAdmin = async (req, res, next) => {
  try {

    const user = await User.findById(req.user.id).populate('role');  
    if (!user || user.role.name !== 'admin') {
      console.log('check')
      return res.status(403).json({ message: 'Bạn không có quyền admin' });
    }

    next();
  } catch (err) {
    console.error("Lỗi khi kiểm tra quyền Admin:", err);
    res.status(500).json({ message: 'Lỗi server khi kiểm tra quyền Admin' });
  }
};



module.exports = { verifyToken, isAdmin };  
