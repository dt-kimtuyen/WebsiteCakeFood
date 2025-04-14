const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Role = require('../models/Role');  


exports.register = async (req, res) => {
    const { username, password , role, status} = req.body;
    console.log(role)
    if (!username || !password) {
        return res.status(400).json({ message: 'Tên người dùng và mật khẩu không thể để trống' });
    }



    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
     
        const defaultRole = await Role.findOne({ name: role }); 

        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role: defaultRole._id, status:status });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.error("Lỗi đăng ký:", err);
        res.status(500).json({ message: 'Lỗi server khi đăng ký người dùng' });
    }
};



exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        const a = await Role.findById(user.role)
        const role = a.name;
        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        console.log(" Đăng nhập thành công:", role.name);

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Đăng nhập thành công', token, user,  role});
    } catch (err) {
        console.error(" Lỗi đăng nhập:", err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.getAll = async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.json({ message: 'Lấy users', users});
    } catch (err) {
        console.error(" Lỗi lấy users:", err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.delete = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }
  
      res.json({ message: 'Xoá người dùng thành công', user: deletedUser });
    } catch (error) {
      console.error('Lỗi khi xoá người dùng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

  exports.update = async (req, res) => {
    try {

      const { id } = req.params;
      const { username, rolee, status, password } = req.body;
      const role = await Role.findOne({ name: rolee });
      const hash = await bcrypt.hash(password,10);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {

          username,
          role,
          password:hash,
          status
          
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }
      res.json({ message: 'Cập nhật người dùng thành công', user: updatedUser });
    } catch (error) {
      console.error('Lỗi cập nhật người dùng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };
  