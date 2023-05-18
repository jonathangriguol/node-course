import { Router } from "express";
import { imgUploader } from "../configs/uploadImg.js";
import CartsManager from "./../CartsManager.js";

const cartsRouter = Router();
const cartsManager = new CartsManager("./carrito.json");

/** Add Cart */
cartsRouter.post("/", async (req, res) => {
  const { products } = req.body;

  try {
    const createdCart = await cartsManager.addCart(products);

    if (createdCart) {
      res.status(200).send(createdCart);
    }
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: POST cart/" });
  }
});

/** Get products by Cart Id */
cartsRouter.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);

  try {
    const products =  await cartsManager.getProductsByCartId(cartId);

    if (products) {
      res.status(200).send(products);
    } else {
		res.status(200).send([]);
	}
  } catch (e) {
    res.status(400).send({ error: e, description: "Endpoint: GET cart/:cid" });
  }
});

/** Add product by Cart Id */
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
	const cid = parseInt(req.params.cid);
	const pid = parseInt(req.params.pid);
  
	try {
	  const updatedCart = await cartsManager.addProductByCartId(cid, pid);
  
	  if (updatedCart) {
		res.status(200).send(updatedCart);
	  }
	} catch (e) {
	  res.status(400).send({ error: e, description: "Endpoint: POST /:cid/product/:pid" });
	}
  });

export { cartsRouter };
