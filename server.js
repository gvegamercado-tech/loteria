require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 🔑 MIDDLEWARES NECESARIOS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 CONEXIÓN MONGODB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado 🔥'))
  .catch(err => console.error('Error MongoDB:', err));

// 📦 MODELO
const Jugada = mongoose.model('Jugada', {
  nombre: String,
  numero: String,
  fecha: { type: Date, default: Date.now },
  valor: { type: Number, default: 1000 }
});

// 🏠 RUTA PRINCIPAL (UNA SOLA)
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Lotería Tavo</title>
<style>
body {
  font-family: Arial;
  background: #0f172a;
  color: white;
  text-align: center;
  padding: 40px;
}
.box {
  background: #1e293b;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  margin: auto;
}
input, button {
  padding: 10px;
  margin: 8px;
  width: 90%;
  font-size: 16px;
}
button {
  background: #22c55e;
  border: none;
  cursor: pointer;
}
</style>
</head>
<body>
<div class="box">
<h1>🎰 GRAN SORTEO</h1>
<p>Lotería 3 cifras</p>
<p>Valor: <b>$1.000</b></p>
<p>Premio: <b>$200.000</b></p>

<form method="POST" action="/jugar">
<input name="nombre" placeholder="Nombre del cliente" required />
<input name="numero" placeholder="Número (000 - 999)" required />
<button type="submit">Guardar número</button>
</form>

<hr />
<p>Responsable: Gustavo Vega</p>
<p>📞 3226314209</p>
</div>
</body>
</html>
`);
});

// 🎟️ GUARDAR JUGADA
app.post('/jugar', async (req, res) => {
  try {
    const { nombre, numero } = req.body;

    const jugada = new Jugada({ nombre, numero });
    await jugada.save();

    res.send('<h2>✅ Número guardado con éxito</h2><a href="/">Volver</a>');
  } catch (error) {
    res.status(500).send('❌ Error al guardar');
  }
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});
