import { object, string, boolean, optional } from 'valibot';

export const reminderSchema = object({
  content: string(),
  important: optional(boolean())
});

export const updateReminderSchema = object({
  content: optional(string()),
  important: optional(boolean())
});

export function validateReminder(data, isUpdate = false) {
  try {
    const schema = isUpdate ? updateReminderSchema : reminderSchema;
    const result = schema(data);
    
    // Validaciones adicionales
    if (result.content) {
      if (result.content.trim().length === 0) {
        throw new Error('El contenido no puede estar vacío');
      }
      if (result.content.length > 120) {
        throw new Error('El contenido no puede tener más de 120 caracteres');
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
} 