const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const db = require('./db');

const app = express();
const port = 3000;
const BASE_URL = "https://fakestoreapi.com/products";

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

app.get('/productos', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

app.get('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.promise().query('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

app.post('/productos', async (req, res) => {
    try {
      const { title, price, description, category, image } = req.body;
  
      if (!title || !price || !description || !category || !image) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }
  
      const sql = 'INSERT INTO productos (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)';
      const [result] = await db.promise().query(sql, [title, price, description, category, image]);
  
      res.status(201).json({ message: 'Producto agregado correctamente', id: result.insertId });
    } catch (error) {
      console.error('Error al agregar producto:', error);
      res.status(500).json({ message: 'Error al agregar el producto' });
    }
  });
  

app.put('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;

    const sql = 'UPDATE productos SET title = ?, price = ?, description = ?, category = ?, image = ? WHERE id = ?';
    await db.promise().query(sql, [updatedProduct.title, updatedProduct.price, updatedProduct.description, updatedProduct.category, updatedProduct.image, id]);

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

app.delete('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.promise().query('DELETE FROM productos WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});