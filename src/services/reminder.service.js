import { ReminderRepository } from '../repositories/reminder.repository.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ReminderService');
const reminderRepository = new ReminderRepository();

export class ReminderService {
  async getAll(userId) {
    logger.info(`Obteniendo recordatorios para usuario: ${userId}`);
    return await reminderRepository.findAll(userId);
  }

  async getById(id, userId) {
    logger.info(`Obteniendo recordatorio ${id} para usuario: ${userId}`);
    const reminder = await reminderRepository.findById(id, userId);

    if (!reminder) {
      logger.warn(`Recordatorio ${id} no encontrado para usuario: ${userId}`);
      throw new Error('Recordatorio no encontrado');
    }

    return reminder;
  }

  async create(data, userId) {
    logger.info(`Creando recordatorio para usuario: ${userId}`);
    
    const reminder = await reminderRepository.create({
      content: data.content.trim(),
      important: data.important ?? false
    }, userId);

    logger.info(`Recordatorio creado exitosamente para usuario: ${userId}`);
    return reminder;
  }

  async update(id, data, userId) {
    logger.info(`Actualizando recordatorio ${id} para usuario: ${userId}`);

    try {
      const reminder = await reminderRepository.update(id, {
        content: data.content?.trim(),
        important: data.important
      }, userId);

      logger.info(`Recordatorio ${id} actualizado exitosamente`);
      return reminder;
    } catch (error) {
      logger.warn(`Error al actualizar recordatorio ${id}: ${error.message}`);
      throw new Error('Recordatorio no encontrado');
    }
  }

  async delete(id, userId) {
    logger.info(`Eliminando recordatorio ${id} para usuario: ${userId}`);
    try {
      await reminderRepository.delete(id, userId);
      logger.info(`Recordatorio ${id} eliminado exitosamente`);
    } catch (error) {
      logger.warn(`Error al eliminar recordatorio ${id}: ${error.message}`);
      throw new Error('Recordatorio no encontrado');
    }
  }
} 