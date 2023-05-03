import fs from "fs";

export default class ProductManager {
  #id = 0;

  constructor(path) {
    this.products = [];
    this.path = path;

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([]));
    }
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (err) {
      console.log("Error trying get products.");
    }
  }

  /**
   * Permite agregar un producto a la lista de Productos
   * @param {number} code code del Producto
   * @param {string} title Nombre del Producto
   * @param {string} description Descripcion del Producto
   * @param {number} price Precio del Producto
   * @param {string} thumbnail Path de la imagen
   * @param {number} stock Cantidad de piezas disponibles
   */
  async agregarProducto(code, title, description, price, thumbnail, stock = 0) {
    const product = {
      code,
      title,
      description,
      price,
      thumbnail,
      stock,
    };

    // Valida que todas las properties del producto a crear tengan algun valor
    const isValid = !Object.values(product).some((p) => p === null || p === "");

    if (!isValid) {
      console.error("ERROR!!", "All fields must be completed");
      return false;
    }

    try {
      const products = await this.getProducts();
      product.id = this.#getID();

      products.push(product);

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (err) {
      console.log(err, "Error on create product.");
    }
  }

  /**
   * Permite modificar un producto
   * @param {number} code code del Producto
   * @param {string} title Nombre del Producto
   * @param {string} description Descripcion del Producto
   * @param {number} price Precio del Producto
   * @param {string} thumbnail Path de la imagen
   * @param {number} stock Cantidad de piezas disponibles
   */
  async editarProducto(
    id,
    code,
    title,
    description,
    price,
    thumbnail,
    stock = 0
  ) {
    const product = {};

    // Valida que todas las properties del producto a crear tengan algun valor
    const isValid = !Object.values(product).some((p) => p === null || p === "");

    if (!isValid) console.error("ERROR!!", "All fields must be completed");

    const current = await this.getProductByID(id);

    const editado = {
      ...current,
      code,
      title,
      description,
      price,
      thumbnail,
      stock,
    };

    try {
      const products = await this.getProducts();

      const updatedList = products.map((p) => (p.id === id ? editado : p));

      await fs.promises.writeFile(this.path, JSON.stringify(updatedList));
    } catch (err) {
      console.log(err, "Error on edit a product.");
    }
  }

  #getID() {
    this.#id++;
    return this.#id;
  }

  /**
   * Retorna el Producto por Code
   * @param {string} code Code del Producto
   * @returns product
   */
  async getProductByCode(code) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const product = JSON.parse(products).find((p) => p.code === code);

      if (product) return product;

      console.log("Product Not Found");
    } catch (err) {
      console.log("Error on find product by Code");
    }
  }

  /**
   * Retorna el Producto por Code
   * @param {number} id ID del Producto
   * @returns product
   */
  async getProductByID(id) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const product = JSON.parse(products).find((p) => p.id === id);

      if (product) return product;

      throw new Error("Product does not exist.");
    } catch (err) {
      console.error("Error on find product by ID");
	  return e;
    }
  }

  /**
   * Elimina el Producto por ID
   * @param {number} id ID del Producto
   * @returns void
   */
  async deleteProductByID(id) {
    try {
      const products = await this.getProducts();

      const index = products.findIndex((p) => p.id === id);
      products.splice(index, 1);

      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (err) {
      console.log(err, `Error on delete product with ID: ${id}`);
    }
  }
}

// TESTING
const test = async () => {
  try {
    const productManager = new ProductManager("./productos.json");
    console.log("Vacio:", productManager.getProducts());
    await productManager.agregarProducto(
      "A001",
      "Mouse Wireless Logi",
      "Mouse inalambrico Logitech",
      "7500",
      "/images/mouse-logi.png",
      20
    );
    await productManager.agregarProducto(
      "COD1",
      "Teclado Logitech",
      "Teclado Logitech ES-es USB",
      "12500",
      "/images/teclado-logi.png",
      18
    );
    await productManager.agregarProducto(
      "ARG0",
      "Auriculares Razr",
      "Auriculares gamer pro",
      "15900",
      "/images/auri-razr.png",
      20
    );
    await productManager.agregarProducto(
      "COD2",
      "Monitor EPS",
      "Monitor Samsung OLED",
      "120500",
      "/images/monitor.png",
      7
    );
    await productManager.agregarProducto(
      "COD3",
      "DIMM RAM",
      "Memoria RAM DDR 1Gb 1333 mhz",
      "2500",
      "/images/memo.png"
    );
    await productManager.agregarProducto(
      "COD4",
      "DIMM RAM",
      "Memoria RAM DDR 4Gb 1333 mhz",
      "2500",
      null,
      null
    );

    // Just for test purposes. Products created dinamically
    for (let i = 0; i < 10; i++) {
      await productManager.agregarProducto(
        "DEMO" + i,
        "Test Product No. " + i,
        "Lorem ipsum...",
        "2500",
        "/images/test.png",
        10
      );
    }

    console.log("Listado de productos", await productManager.getProducts());

    const testProd1 = await productManager.getProductByCode("A001");
    console.log("Producto #code: A001", testProd1);

    const testProd2 = await productManager.getProductByCode("COD3");
    console.log("Producto #code: COD3", testProd2);

    // Va a retornar un not found
    await productManager.getProductByCode("COD100");

    let listLength = await productManager.getProducts();
    console.log("Cantidad:", listLength.length);

    await productManager.deleteProductByID(1);
    listLength = await productManager.getProducts();
    console.log("Cantidad despues de borrar 1 producto:", listLength.length);

    await productManager.editarProducto(
      4,
      "COD3",
      "EDITADO",
      "Editado....",
      "editado",
      "/images/memo.png"
    );
  } catch (error) {
    console.log(error, "Something was wrong when testing...");
  }
};

/*
	TESTS WILL NOT BE EXECUTED!!
*/
//test();
