export class Carrito {
  constructor(listaProductos = [], total = 0) {
    this.productos = listaProductos;
    this.total = total;
  }

  validarProductoEnCarrito = (id) => {
    return this.productos.some(prod => prod.id === id)
  }

  creaFila = (prod) => {
    const cuerpoCarrito = document.getElementById('cart-body');
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.setAttribute('scope', 'fila');
    celdaNombre.textContent = prod.nombre;
    fila.appendChild(celdaNombre);

    const celdaCategoria = document.createElement('td');
    celdaCategoria.textContent = prod.categoria;
    fila.appendChild(celdaCategoria);

    const celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = '$' + (prod.precio * prod.stock);
    fila.appendChild(celdaPrecio);

    const celdaCantidad = document.createElement('td');
    celdaCantidad.className = 'p-0'
    const cantidadContainer = document.createElement('div');
    cantidadContainer.className = 'input-group input-group-sm';
    cantidadContainer.style.height = '18px';

    const botonMenos = document.createElement('button');
    botonMenos.className = 'btn p-2';
    botonMenos.type = 'button';
    botonMenos.textContent = '-';

    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.className = 'form-control text-center';
    inputCantidad.style.width = '20px';
    inputCantidad.value = prod.stock;
    inputCantidad.min = 1;
    inputCantidad.readOnly = true;

    const botonMas = document.createElement('button');
    botonMas.className = 'btn p-2';
    botonMas.type = 'button';
    botonMas.textContent = '+';

    cantidadContainer.appendChild(botonMenos);
    cantidadContainer.appendChild(inputCantidad);
    cantidadContainer.appendChild(botonMas);
    celdaCantidad.appendChild(cantidadContainer);
    fila.appendChild(celdaCantidad);

    botonMenos.addEventListener('click', () => {
      if (inputCantidad.value > 1) {
        inputCantidad.value--;
        prod.stock--;
      } else {
        fila.remove();
        this.eliminarProductoPorId(prod.id);
      }
      this.calcularTotal();
      this.actualizarTotal();
      this.actualizarIconoCarrito();
      celdaPrecio.textContent = '$' + (prod.precio * prod.stock);
      this.guardarCarrito()
    });

    botonMas.addEventListener('click', () => {
      inputCantidad.value++;
      prod.stock++;
      this.calcularTotal();
      this.actualizarTotal();
      this.actualizarIconoCarrito();
      celdaPrecio.textContent = '$' + (prod.precio * prod.stock);
      this.guardarCarrito();
    });

    const celdaBorrar = document.createElement('td');
    const botonBorrar = document.createElement('a');
    botonBorrar.href = '#';
    botonBorrar.className = 'text-primary remove-from-cart';
    const iconoBorrar = document.createElement('i');
    iconoBorrar.className = 'fa-solid fa-trash';
    botonBorrar.appendChild(iconoBorrar);
    celdaBorrar.appendChild(botonBorrar);
    fila.appendChild(celdaBorrar);

    botonBorrar.addEventListener('click', (event) => {
      event.preventDefault();
      fila.remove();
      this.eliminarProductoPorId(prod.id);
      this.calcularTotal();
      this.actualizarTotal();
      this.actualizarIconoCarrito();
      this.guardarCarrito();
    });
    cuerpoCarrito.appendChild(fila);
  }

  calcularTotal = () => {
    const total = this.productos.reduce((total, prod) => total + parseFloat(prod.precio) * prod.stock, 0);
    this.total = total.toFixed(2);
  }

  // llenarModalCarrito = () => {
  //   this.productos.forEach(prod => this.agregarAlCarrito(prod));
  // }

  obtenerCantidadArticulos = () => {
    return this.productos.reduce((total, prod) => total + parseFloat(prod.stock), 0);
  }

  actualizarIconoCarrito = () => {
    const badge = document.querySelector('.badge');
    badge.textContent = this.obtenerCantidadArticulos();
  }

  actualizarTotal = () => {
    const totalCarrito = document.getElementById('total-price');
    totalCarrito.textContent = `$${this.total}`;
  }

  vaciarModalCarrito = () => {
    const cuerpoCarrito = document.getElementById('cart-body');
    cuerpoCarrito.replaceChildren();
    this.guardarCarrito();
  }

  llenarModalCarrito = () => {
    this.productos.forEach(prod => this.creaFila(prod));
  }

  eliminarProductoPorId = (idEliminar) => {
    const indexEliminar = this.productos.findIndex(prod => prod.id == idEliminar);
    this.productos.splice(indexEliminar, 1);
  }

  agregarAlCarrito = (nuevoProd) => {
    const esUnProductoNuevo = this.validarProductoEnCarrito(nuevoProd.id);
    if (esUnProductoNuevo) {
      const productoExistente = this.productos.find(prod => prod.id == nuevoProd.id);
      productoExistente.stock += 1;
    } else {
      this.productos.push(nuevoProd);
    }
    this.calcularTotal();
    this.actualizarTotal();
    this.actualizarIconoCarrito();
    this.vaciarModalCarrito();
    this.llenarModalCarrito();
    this.guardarCarrito();
  };

  guardarCarrito = () => {
    localStorage.setItem('carritoTepuy', JSON.stringify(this));
  }

  vaciarCarrito = () => {
    this.productos = [];
    this.calcularTotal();
    this.actualizarTotal();
    this.actualizarIconoCarrito();
    this.vaciarModalCarrito();
    this.guardarCarrito();
  }
}

