import rateLimit from 'express-rate-limit';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('RateLimit');

export const createRateLimiter = (options = {}) => {
  const limiter = rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutos por defecto
    max: options.max || 100, // límite de 100 peticiones por ventana
    message: {
      error: 'Demasiadas peticiones, por favor intente más tarde'
    },
    handler: (req, res) => {
      logger.warn(`Rate limit excedido para IP: ${req.ip}`);
      res.status(429).json({
        error: 'Demasiadas peticiones, por favor intente más tarde'
      });
    }
  });

  return limiter;
}; 