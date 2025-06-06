import { ReminderService } from '../services/reminder.service.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ReminderController');
const reminderService = new ReminderService();

export class ReminderController {
  async getAll(req, res) {
    try {
      const reminders = await reminderService.getAll(req.user.id);
      res.json(reminders);
    } catch (error) {
      logger.error(`Error al obtener recordatorios: ${error.message}`);
      res.status(500).json({
        error: "Error al obtener los recordatorios"
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const reminder = await reminderService.getById(id, req.user.id);
      res.json(reminder);
    } catch (error) {
      logger.error(`Error al obtener recordatorio: ${error.message}`);
      res.status(404).json({
        error: "Recordatorio no encontrado"
      });
    }
  }

  async create(req, res) {
    try {
      const reminder = await reminderService.create(req.body, req.user.id);
      res.status(201).json(reminder);
    } catch (error) {
      logger.error(`Error al crear recordatorio: ${error.message}`);
      res.status(400).json({
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const reminder = await reminderService.update(id, req.body, req.user.id);
      res.json(reminder);
    } catch (error) {
      logger.error(`Error al actualizar recordatorio: ${error.message}`);
      res.status(404).json({
        error: "Recordatorio no encontrado"
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await reminderService.delete(id, req.user.id);
      res.status(204).end();
    } catch (error) {
      logger.error(`Error al eliminar recordatorio: ${error.message}`);
      res.status(404).json({
        error: "Recordatorio no encontrado"
      });
    }
  }
} 