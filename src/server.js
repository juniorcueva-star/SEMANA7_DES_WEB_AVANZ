import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';

const requiredEnvironment = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
if (missingEnvironment.length) {
  throw new Error(`Faltan variables de entorno: ${missingEnvironment.join(', ')}`);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
});

const port = Number(process.env.PORT || 3000);
try {
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
  console.log('MongoDB conectado');
  await seedRoles();
  app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
} catch (error) {
  console.error('No se pudo iniciar la aplicación:', error.message);
  process.exit(1);
}
