class ProductManager {
	#code = 0;

	constructor() {
		this.products = [];
	}

	getProductos() {
		return this.products;
	}

	/**
	 * Permite agregar un producto a la lista de Productos
	 * @param {string} title Nombre del Producto
	 * @param {string} description Descripcion del Producto
	 * @param {number} price Precio del Producto
	 * @param {string} thumbnail Path de la imagen
	 * @param {number} code Id del Producto
	 * @param {number} stock Cantidad de piezas disponibles
	 */
	agregarProducto(title, description, price, thumbnail, stock = 0) {
		const product = {
			title,
			description,
			price,
			thumbnail,
			stock,
		};

		// Valida que todas las properties del producto a crear tengan algun valor
		const isValid = !Object.values(product).some(p => p === null || p === '');

		if(!isValid)
			console.error('ERROR!!', 'All fields must be completed');

		product.code = this.#getCode();

		this.products.push(product);
	}

	#getCode() {
		this.#code++;
		return this.#code;
	}

	/**
	 * Retorna el Producto por Code
	 * @param {number} code ID del Producto
	 * @returns product
	 */
	getProductByCode(code) {
		const product = this.products.find(
			p => p.code === code
		);

		if(product)
			return product;


		return "Product Not Found";
	}
}

// TESTING
const productManager = new ProductManager();
productManager.agregarProducto('Mouse Wireless Logi', 'Mouse inalambrico Logitech', '7500', '/images/mouse-logi.png', 20);
productManager.agregarProducto('Teclado Logitech', 'Teclado Logitech ES-es USB', '12500', '/images/teclado-logi.png', 18);
productManager.agregarProducto('Auriculares Razr', 'Auriculares gamer pro', '15900', '/images/auri-razr.png', 20);
productManager.agregarProducto('Monitor EPS', 'Monitor Samsung OLED', '120500', '/images/monitor.png', 7);
productManager.agregarProducto('DIMM RAM', 'Memoria RAM DDR 1Gb 1333 mhz', '2500', '/images/memo.png');
productManager.agregarProducto('DIMM RAM', 'Memoria RAM DDR 4Gb 1333 mhz', '2500', null, null);

console.log('Listado de productos', productManager.getProductos());

console.log('Producto #code: 1', productManager.getProductByCode(1));
console.log('Producto #code: 4', productManager.getProductByCode(4));
console.log('Producto #code: 100', productManager.getProductByCode(100));

