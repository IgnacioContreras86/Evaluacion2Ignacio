import { UserRepository } from '../repositories/user.repository.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AuthService');
const userRepository = new UserRepository();

export class AuthService {
  async login(username, password) {
    logger.info(`Intento de login para usuario: ${username}`);
    const user = await userRepository.login(username, password);

    if (!user) {
      logger.warn(`Login fallido para usuario: ${username}`);
      throw new Error('Credenciales inválidas');
    }

    logger.info(`Login exitoso para usuario: ${username}`);
    return {
      username: user.username,
      token: user.token,
      name: user.name
    };
  }

  async logout(token) {
    logger.info('Intento de logout');
    const success = await userRepository.logout(token);

    if (!success) {
      logger.warn('Logout fallido - token inválido');
      throw new Error('Token inválido');
    }

    logger.info('Logout exitoso');
    return true;
  }
} 