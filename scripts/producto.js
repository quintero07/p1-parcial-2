export class Producto {
  constructor({id, nombre, descripcion, precio, imagen, categoria, stock = 0}) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = precio;
      this.imagen = imagen;
      this.categoria = categoria;
      this.stock = stock;
  }

  toHTML(index) {
    const cardProducto = document.createElement('div');
    cardProducto.className = 'col-md-6 col-lg-4 col-xl-3 p-2';
  
    const contenedorImagen = document.createElement('div');
    contenedorImagen.className = 'special-img position-relative overflow-hidden'
  
    const img = document.createElement('img');
    img.src = this.imagen;
    img.alt = this.nombre;
    img.className = 'w-100';
    contenedorImagen.appendChild(img);
  
    const categoriaProducto = document.createElement('span');
    categoriaProducto.className = 'position-absolute d-flex align-items-center justify-content-center bg-primary p-2 text-light rounded';
    categoriaProducto.textContent = this.categoria;
    contenedorImagen.appendChild(categoriaProducto);
  
    cardProducto.appendChild(contenedorImagen);
  
    const contenedorDescripcion = document.createElement('div');
    contenedorDescripcion.className = 'text-center'
  
    const descripcion = document.createElement('p');
    descripcion.className = 'text-capitalize mt-3 mb-1';
    descripcion.textContent = this.descripcion.trim().slice(0, 25) + '...';
    contenedorDescripcion.appendChild(descripcion);
  
    const precio = document.createElement('span');
    precio.className = 'fw-bold d-block';
    precio.textContent = '$' + this.precio;
    contenedorDescripcion.appendChild(precio);
  
    const botonVer = document.createElement('a');
    botonVer.href = '#';
    botonVer.className = 'btn btn-primary mt-3 view-product';
    botonVer.setAttribute('data-bs-toggle', 'modal');
    botonVer.setAttribute('data-bs-target', '#producto');
    botonVer.setAttribute('data-index', index);
    botonVer.textContent = 'Ver';
  
    const botonAgregar = document.createElement('a');
    botonAgregar.href = '#';
    botonAgregar.className = 'btn btn-primary mt-3 add-to-cart';
    botonAgregar.setAttribute('data-index', index);
    const iconoCarrito = document.createElement ('i');
    iconoCarrito.className = 'fa fa-shopping-cart px-1';
    const textoBoton = document.createTextNode('Agregar');
    botonAgregar.appendChild(iconoCarrito);
    botonAgregar.appendChild(textoBoton);
    
  
    const contenedorBotones = document.createElement('div');
    contenedorBotones.className = 'd-flex justify-content-around'
    contenedorBotones.appendChild(botonVer);
    contenedorBotones.appendChild(botonAgregar);
    contenedorDescripcion.appendChild(contenedorBotones)
  
    cardProducto.appendChild(contenedorDescripcion);
    return cardProducto;
  }

  llenaModalProducto = (carrito) => {
    document.getElementById('modal-product-img').src = this.imagen;
    document.getElementById('modal-product-img').alt = this.nombre;
    document.querySelector('.card-title').textContent = this.nombre;
    document.querySelector('.card-text').textContent = this.descripcion;
    document.getElementById('modal-product-price').textContent = `$${this.precio}`;

    const modalAddToCartButton = document.getElementById('modal-add-to-cart');
    modalAddToCartButton.onclick = () => {
        carrito.agregarAlCarrito({...this, stock: 1});
    };
}
}