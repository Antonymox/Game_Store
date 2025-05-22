const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { createConnection } = require("typeorm")
const routes = require("./routes")
const dbConfig = require("./config/database")

// Cargar variables de entorno
dotenv.config()

// Crear la aplicación Express
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:4201", "http://127.0.0.1:4201"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  }),
)
app.use(express.json())

// Rutas
app.use("/api", routes)

// Conectar a la base de datos y luego iniciar el servidor
createConnection(dbConfig)
  .then(() => {
    console.log("Conexión a la base de datos establecida")
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error)
  })
