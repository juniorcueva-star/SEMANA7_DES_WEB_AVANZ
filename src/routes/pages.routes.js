import express from 'express';

const router = express.Router();
router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', (req, res) => res.render('signIn', { title: 'Iniciar sesión' }));
router.get('/signUp', (req, res) => res.render('signUp', { title: 'Crear cuenta' }));
router.get('/profile', (req, res) => res.render('profile', { title: 'Mi cuenta' }));
router.get('/dashboard/user', (req, res) => res.render('userDashboard', { title: 'Panel de usuario' }));
router.get('/dashboard/admin', (req, res) => res.render('adminDashboard', { title: 'Panel de administración' }));
router.get('/admin/users/:id', (req, res) => res.render('adminUserDetail', { title: 'Detalle del usuario', userId: req.params.id }));
router.get('/403', (req, res) => res.status(403).render('403', { title: 'Acceso denegado' }));
router.use((req, res) => res.status(404).render('404', { title: 'Página no encontrada' }));

export default router;
