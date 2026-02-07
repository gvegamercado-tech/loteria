const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 🔗 MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado ✅'))
  .catch(err => console.error('Error MongoDB:', err));

// 📦 MODELO (SIN unique)
const Jugada = mongoose.model('Jugada', {
  nombre: String,
  contacto: String,
  numero: String,
  fecha: { type: Date, default: Date.now }
});

// 🏠 PÁGINA PRINCIPAL
app.get('/', async (req, res) => {
  const jugadas = await Jugada.find().sort({ numero: 1 });

  let filas = jugadas.map(j => `
    <tr>
      <td>${j.numero}</td>
      <td>${j.nombre}</td>
      <td>${j.contacto}</td>
      <td>
        <form action="/editar/${j._id}" method="POST" style="display:inline">
          <input name="numero" placeholder="Nuevo #" required style="width:70px">
          <button>✏️</button>
        </form>
        <form action="/eliminar/${j._id}" method="POST" style="display:inline">
          <button onclick="return confirm('¿Eliminar número?')">🗑️</button>
        </form>
      </td>
    </tr>
  `).join('');

  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Gran Sorteo</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>

<h1>🎉 GRAN SORTEO 🎉</h1>
<p>Valor: <b>$1.000</b> | Premio: <b>$200.000</b></p>

<form method="POST" action="/jugar">
  <input name="nombre" placeholder="Nombre" required>
  <input name="contacto" placeholder="Contacto" required>
  <input name="numero" placeholder="Número (000-999)" required>
  <button type="submit">Guardar número</button>
</form>

<h2>Números registrados</h2>

<table>
<tr>
  <th>Número</th>
  <th>Nombre</th>
  <th>Contacto</th>
  <th>Acciones</th>
</tr>
${filas || '<tr><td colspan="4">Sin registros</td></tr>'}
</table>

<p><b>Responsable:</b> Gustavo Vega</p>
<p>📞 322 631 4209</p>

</body>
</html>
`);
});

// ➕ GUARDAR
app.post('/jugar', async (req, res) => {
  try {
    const { nombre, contacto, numero } = req.body;

    if (!/^\d{3}$/.test(numero)) {
      return res.send('Número inválido <br><a href="/">Volver</a>');
    }

    const existe = await Jugada.findOne({ numero });
    if (existe) {
      return res.send('Número repetido <br><a href="/">Volver</a>');
    }

    await Jugada.create({ nombre, contacto, numero });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.send('Error al guardar <br><a href="/">Volver</a>');
  }
});

// ✏️ EDITAR
app.post('/editar/:id', async (req, res) => {
  const { numero } = req.body;

  if (!/^\d{3}$/.test(numero)) {
    return res.send('Número inválido <br><a href="/">Volver</a>');
  }

  const existe = await Jugada.findOne({ numero });
  if (existe) {
    return res.send('Número ya existe <br><a href="/">Volver</a>');
  }

  await Jugada.findByIdAndUpdate(req.params.id, { numero });
  res.redirect('/');
});

// 🗑️ ELIMINAR
app.post('/eliminar/:id', async (req, res) => {
  await Jugada.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});
