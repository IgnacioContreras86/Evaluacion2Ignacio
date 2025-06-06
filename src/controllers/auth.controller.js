import { AuthService } from '../services/auth.service.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AuthController');
const authService = new AuthService();

export class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (error) {
      logger.error(`Error en login: ${error.message}`);
      res.status(401).json({
        error: "Nombre de usuario o contraseña incorrectos"
      });
    }
  }

  async logout(req, res) {
    try {
      const token = req.get("X-Authorization");
      await authService.logout(token);
      res.status(204).end();
    } catch (error) {
      logger.error(`Error en logout: ${error.message}`);
      res.status(401).json({
        error: "Token inválido"
      });
    }
  }
} 