import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ email }).populate('roles').exec();
  }

  async findById(id) {
    return User.findById(id).populate('roles').exec();
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('roles').exec();
  }

  async getAll() {
    return User.find().select('-password').populate('roles').exec();
  }
}

export default new UserRepository();
