import bcrypt from 'bcrypt';
import roleRepository from '../repositories/RoleRepository.js';
import userRepository from '../repositories/UserRepository.js';

export default async function seedUsers() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('Admin de demostración omitido: configura ADMIN_EMAIL y ADMIN_PASSWORD en .env');
    return;
  }

  const adminRole = await roleRepository.findByName('admin');
  if (!adminRole) throw new Error('No se encontró el rol admin');

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    if (!existing.roles.some((role) => role.name === 'admin')) {
      await userRepository.updateById(existing._id, { roles: [...existing.roles.map((role) => role._id), adminRole._id] });
      console.log(`Se asignó el rol admin a la cuenta de demostración: ${email}`);
    } else {
      console.log(`Usuario administrador disponible: ${email}`);
    }
    return;
  }

  const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    await userRepository.create({
      email,
      password: hashedPassword,
      name: 'Administrador',
      lastName: 'Demo',
      phoneNumber: '999999999',
      birthdate: new Date('1990-01-01'),
      address: 'Cuenta de demostración',
      roles: [adminRole._id]
    });
    console.log(`Usuario administrador de demostración creado: ${email}`);
  } catch (error) {
    if (error.code !== 11000) throw error;
    console.log(`Usuario administrador disponible: ${email}`);
  }
}
