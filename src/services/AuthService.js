import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;

class AuthService {
  async signUp({ email, password, name, lastName, phoneNumber, birthdate, url_profile, address }) {
    if (!passwordPattern.test(password)) {
      const error = new Error('La contraseña debe tener 8 caracteres, una mayúscula, un número y uno de estos símbolos: # $ % & * @');
      error.status = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error('El email ya se encuentra en uso');
      error.status = 409;
      throw error;
    }

    const role = await roleRepository.findByName('user');
    if (!role) {
      const error = new Error('No se encontró el rol user. Verifica la inicialización de roles.');
      error.status = 500;
      throw error;
    }

    const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await userRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      lastName,
      phoneNumber,
      birthdate,
      url_profile,
      address,
      roles: [role._id]
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName
    };
  }

  async signIn({ email, password }) {
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { sub: user._id.toString(), roles: user.roles.map((role) => role.name) },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    return { token };
  }
}

export default new AuthService();
