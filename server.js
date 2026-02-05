const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔹 Conexión MongoDB (NO se cae si falla)
if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB conectado 🔥"))
    .catch(err => console.error("Error MongoDB:", err.message));
} else {
  console.warn("⚠️ MONGO_URL no definida");
}

// 🔹 Modelo
const Jugada = mongoose.model("Jugada", {
  nombre: String,
  numero: String,
  fecha: { type: Date, default: Date.now },
  valor: Number,
  estado: { type: String, default: "pendiente" }
});

// 🔹 Ruta
app.post("/jugar", async (req, res) => {
  try {
    const { nombre, numero } = req.body;

    if (!nombre || numero === undefined) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const jugada = new Jugada({
      nombre,
      numero,
      valor: 500
    });

    await jugada.save();
    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar jugada" });
  }
});

// 🔹 Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
