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
}

export default new UserService();
