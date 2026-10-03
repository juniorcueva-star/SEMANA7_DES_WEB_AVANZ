import authService from '../services/AuthService.js';

class AuthController {
  async signUp(req, res, next) {
    try {
      const { email, password, name, lastName, phoneNumber, birthdate, url_profile, address } = req.body;
      if (!email || !password || !name || !lastName || !phoneNumber || !birthdate) {
        return res.status(400).json({
          message: 'email, password, name, lastName, phoneNumber y birthdate son obligatorios'
        });
      }
      const user = await authService.signUp({
        email, password, name, lastName, phoneNumber, birthdate, url_profile, address
      });
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'El email y password son requeridos' });
      }
      return res.status(200).json(await authService.signIn({ email, password }));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
