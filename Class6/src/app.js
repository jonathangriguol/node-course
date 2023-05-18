import express from 'express';
import { cartsRouter } from './routers/carts.router.js';
import { productsRouter } from './routers/products.router.js';

const app = express();

// Seteo carpeta public como raiz de servidor estatico
app.use(express.static('public'));

// Middelare para parseo de json
app.use(express.json());
// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));

// Utilizo ruta de products para "/api/products"
app.use('/api/products', productsRouter);
// Utilizo ruta de carts para "/api/carts"
app.use('/api/carts', cartsRouter);


app.listen(8080, () => {
  console.log("Server started at port: 8080");
});