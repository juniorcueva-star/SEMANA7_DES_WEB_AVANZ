import userRepository from '../repositories/UserRepository.js';

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthdate: user.birthdate,
    url_profile: user.url_profile,
    address: user.address,
    roles: user.roles.map((role) => role.name),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

class UserService {
  async getAll() {
    const users = await userRepository.getAll();
    return users.map(publicUser);
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }
    return publicUser(user);
  }

  async updateMe(id, input) {
    const allowedFields = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'address'];
    const update = {};
    for (const field of allowedFields) {
      if (Object.hasOwn(input, field)) update[field] = input[field];
    }
    if (Object.keys(update).length === 0) {
      const error = new Error('No se recibieron campos válidos para actualizar');
      error.status = 400;
      throw error;
    }

    const user = await userRepository.updateById(id, update);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }
    return publicUser(user);
  }
}

export default new UserService();
