const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const QUALTRICS_TOKEN = process.env.QUALTRICS_TOKEN;
const DATACENTER = process.env.DATACENTER;
const DIRECTORY_ID = process.env.DIRECTORY_ID;

app.get('/buscar-hijos', async (req, res) => {
  const dni = req.query.dni;
  if (!dni) return res.status(400).json({ error: 'DNI requerido' });

  try {
    const response = await axios.get(`https://${DATACENTER}.qualtrics.com/API/v3/directories/${DIRECTORY_ID}/contacts`, {
      headers: { 'X-API-TOKEN': QUALTRICS_TOKEN },
      params: { 'embeddedData.DNI': dni }
    });

    const contacto = response.data.result.elements[0];
    const hijos = contacto?.embeddedData?.hijos || '';

    res.json({ hijos });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Error al buscar en Qualtrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
