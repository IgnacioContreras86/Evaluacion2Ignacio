import express from "express";
import { AuthController } from "./src/controllers/auth.controller.js";
import { ReminderController } from "./src/controllers/reminder.controller.js";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import { createRateLimiter } from "./src/middlewares/rate-limit.middleware.js";
import { createLogger } from "./src/utils/logger.js";

const PORT = process.env.PORT ?? 3000;
const app = express();
const logger = createLogger('App');

// Configuración de middleware
app.use(express.static("public"));
app.use(express.json());

// Rate limiting
app.use(createRateLimiter());

// Middleware para logging
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}`);
	res.status(500).json({
		error: "Ha ocurrido un error en el servidor"
	});
});

// Middleware para CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Authorization");
	res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// Instanciar controladores
const authController = new AuthController();
const reminderController = new ReminderController();

// Rutas de autenticación
app.post("/api/auth/login", authController.login.bind(authController));
app.post("/api/auth/logout", authMiddleware, authController.logout.bind(authController));

// Rutas de recordatorios
app.get("/api/reminders", authMiddleware, reminderController.getAll.bind(reminderController));
app.post("/api/reminders", authMiddleware, reminderController.create.bind(reminderController));
app.patch("/api/reminders/:id", authMiddleware, reminderController.update.bind(reminderController));
app.delete("/api/reminders/:id", authMiddleware, reminderController.delete.bind(reminderController));

// Ruta para verificar el estado del servidor
app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
});

// Manejo de rutas no encontradas
app.use((req, res) => {
	logger.warn(`Ruta no encontrada: ${req.method} ${req.url}`);
	res.status(404).json({
		error: "Ruta no encontrada"
	});
});

// Iniciar el servidor
app.listen(PORT, (error) => {
	if (error) {
		logger.error(`No se puede ocupar el puerto ${PORT}`);
		return;
	}
	logger.info(`Servidor iniciado en el puerto ${PORT}`);
	logger.info(`Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
});

export default app;
