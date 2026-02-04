require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado 🔥'))
  .catch(err => console.log(err));

// Modelo de jugada
const Jugada = mongoose.model('Jugada', {
  nombre: String,
  numero: String,
  fecha: { type: Date, default: Date.now },
  valor: Number,
  estado: { type: String, default: 'pendiente' }
});

// Guardar jugada
app.post('/jugar', async (req, res) => {
  const { nombre, numero } = req.body;

  const jugada = new Jugada({
    nombre,
    numero,
    valor: 500
  });

  await jugada.save();
  res.json({ ok: true });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});
