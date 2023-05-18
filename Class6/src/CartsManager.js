import fs from "fs";

export default class CartsManager {
  constructor(path) {
    this.path = path;

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([]));
    }
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (err) {
      console.log("Error trying get Carts.");
    }
  }

  /**
   * Permite agregar un Cart a la lista de Carts
   * @param {Array<object>} products
   * @returns cart
   */
  async addCart(
    products = []
  ) {
    const cart = {
      products
    };

    try {
      const carts = await this.getCarts() ?? [];
      const lastId = carts?.slice(-1)[0]?.id;
      cart.id = lastId ? lastId + 1 : 1;

      carts.push(cart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts));

      return cart;
    } catch (err) {
      console.log(err, "Error creating a Cart.");
    }
  }

  /**
   * Retorna el listado de productos por Cart Id
   * @param {number} id Id del Cart
   * @returns products
   */
  async getProductsByCartId(id) {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      const cart = carts.length && JSON.parse(carts).find((c) => c.id === id);

      if (cart.products) return cart.products;

      console.log("Cart Not Found");
    } catch (err) {
      console.log("Error on find product by Code");
    }
  }

  /**
   * Agrega un producto al carrito
   * @param {number} cartId Id del Producto
   * @param {number} productId Id del Producto
   * @returns cart
   */
  async addProductByCartId(cartId, productId) {
    try {
      const carts = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
      const currentCart = carts?.find((c) => c.id === cartId);

      if(currentCart.products.length && currentCart.products.find((p) => p.product === productId)) {
        
        currentCart.products.map((p) => p.product === productId && p.quantity++);
      } else {
        currentCart.products.push({product: productId, quantity:0})
      }
      
      await fs.promises.writeFile(this.path, JSON.stringify(carts));

      if (currentCart) return carts;

      throw new Error("Cart does not exist.");
    } catch (err) {
      console.error("Error on find Cart by Id");
      return err;
    }
  }
}