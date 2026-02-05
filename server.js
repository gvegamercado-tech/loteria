require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// 👉 Servir archivos HTML
app.use(express.static(path.join(__dirname)));

// 👉 RUTA PRINCIPAL (ESTO FALTABA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado 🔥'))
  .catch(err => console.log(err));

// Modelo de jugada
const Jugada = mongoose.model('Jugada', {
  nombre: String,
  numero: String,
  fecha: { type: Date, default: Date.now },
  valor: { type: Number, default: 1000 }
});

// Guardar jugada
app.post('/jugar', async (req, res) => {
  const { nombre, numero } = req.body;

  const jugada = new Jugada({
    nombre,
    numero
  });

  await jugada.save();
  res.json({ ok: true });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});

