import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const productManager = new ProductManager("./productos.json");

app.use(express.urlencoded({ extended: true }));

// Products list by query string
app.get("/products/", async (req, res) => {
  const { limit } = req.query;

  try {
    const products = await productManager.getProducts();

    if (products.length) {
      const result = {
        products: limit ? products.slice(0, limit) : products,
        length: limit ?? products.length,
      };
      res.send(result);
    } else {
      throw new Error(e);
    }
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: GET products/" });
  }
});

app.get("/products/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductByID(pid);

    if (product) {
      res.send(product);
    } else {
      throw new Error(e);
    }
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: GET products/" });
  }
});

app.listen(8080, () => {
  console.log("Estoy en puerto 8080");
});
