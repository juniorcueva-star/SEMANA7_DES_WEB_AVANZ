import Role from '../models/Role.js';

class RoleRepository {
  async findByName(name) {
    return Role.findOne({ name }).exec();
  }

  async create(roleData) {
    return Role.create(roleData);
  }

  async getAll() {
    return Role.find().exec();
  }
}

export default new RoleRepository();
