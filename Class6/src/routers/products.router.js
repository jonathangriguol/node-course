import { Router } from "express";
import { imgUploader } from "../configs/uploadImg.js";
import ProductManager from "./../ProductManager.js";

const products = [];

const productsRouter = Router();
const productManager = new ProductManager("./productos.json");

// Le digo a la ruta que utilice un middleware que defino yo
productsRouter.use((req, res, next) => {
  // si el type de mascota es Perro
  if (req.body.type === "Perro") {
    // Retorno un error
    res.status(403).send("No Quiero alimañas");
  }
  // Sigo
  next();
});

productsRouter.get("/", async (req, res) => {
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

productsRouter.get("/:pid", async (req, res) => {
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

/** Add product */
productsRouter.post("/", async (req, res) => {
  const {
    code,
    title,
    description,
    price,
    thumbnails,
    stock,
    category,
    status,
  } = req.body;

  try {
    const createdProduct = await productManager.agregarProducto(
      code,
      title,
      description,
      price,
      thumbnails,
      stock,
      category,
      status
    );

    if (createdProduct) {
      res.status(200).send(createdProduct);
    }
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: POST products/" });
  }
});

/**
 * Updates a Product
 */
productsRouter.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const {
    code,
    title,
    description,
    price,
    thumbnails,
    stock,
    category,
    status,
  } = req.body;

  try {
    const editedProduct = await productManager.editProductById(
      pid,
      code,
      title,
      description,
      price,
      thumbnails,
      stock,
      category,
      status
    );

    if (editedProduct.id) {
        res.status(200).send(editedProduct);
      } else {
        throw new Error(editedProduct);
      }
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: PUT products/:pid" });
  }
});

/** Deletes a product by id */
productsRouter.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);

  try {
    await productManager.deleteProductByID(pid);
    const products = await productManager.getProducts();
    res.status(200).send(products);    
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: DELETE products/" });
  }
});

export { productsRouter };
