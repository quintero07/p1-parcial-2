'use strict';
import { Producto } from './producto.js';
let categoriaSeleccionada = 'all';

const fetchProductos = async () => {
    const respuesta = await fetch("./productos.json");
    const productos = await respuesta.json();
    return productos;
}

const llenaModalProducto = (prod) => {
    document.getElementById('modal-product-img').src = prod.imagen;
    document.getElementById('modal-product-img').alt = prod.nombre;
    document.querySelector('.card-title').textContent = prod.nombre;
    document.querySelector('.card-text').textContent = prod.descripcion;
    document.getElementById('modal-product-price').textContent = `$${prod.precio}`;

    const modalAddToCartButton = document.getElementById('modal-add-to-cart');
    modalAddToCartButton.onclick = () => {
        agregaAlCarrito(prod);
    };
}

const agregaAlCarrito = (prod) => {
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
    celdaPrecio.textContent = '$' + prod.precio;
    fila.appendChild(celdaPrecio);

    const celdaBorrar = document.createElement('td');
    const botonBorrar = document.createElement('a');
    botonBorrar.href = '#';
    botonBorrar.className = 'text-primary remove-from-cart';
    botonBorrar.innerHTML = '<i class="fa-solid fa-trash"></i>';
    celdaBorrar.appendChild(botonBorrar);
    fila.appendChild(celdaBorrar);

    botonBorrar.addEventListener('click', (event) => {
        event.preventDefault();
        borrarDelCarrito(fila, prod.precio);
    });

    cuerpoCarrito.appendChild(fila);

    actualizaTotal(prod.precio);
    actualizaIconoCarrito(1);
};

const borrarDelCarrito = (fila, precio) => {
    fila.remove();
    actualizaTotal(-precio);
    actualizaIconoCarrito(-1);
};

const actualizaTotal = (precio) => {
    const totalCarrito = document.getElementById('total-price');
    const totalActual = parseFloat(totalCarrito.textContent.substring(1)) || 0;
    const nuevoTotal = totalActual + parseFloat(precio);
    totalCarrito.textContent = `$${nuevoTotal.toFixed(2)}`;
};

const actualizaIconoCarrito = (qty) => {
    const badge = document.querySelector('.badge');
    badge.textContent = parseInt(badge.textContent) + qty
}

const renderProductos = (productos) => {
    const contenedorProductos = document.querySelector('#productos');
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de renderizar
    productos.forEach((p, index) => {
        const prod = new Producto({ ...p });
        const cardProd = prod.toHTML(index);
        contenedorProductos.appendChild(cardProd);
        
        cardProd.querySelector('.view-product').addEventListener('click', () => {
            llenaModalProducto(prod);
        });
        
        cardProd.querySelector('.add-to-cart').addEventListener('click', (event) => {
            event.preventDefault();
            agregaAlCarrito(prod);
        });
    });
};

const filtros = document.querySelectorAll('.contenedorFiltros button.filtro');
const botonesOrden = document.querySelectorAll('.contenedorFiltros button.orden');

botonesOrden.forEach(botonOrden => {
    botonOrden.addEventListener('click', (e) => {
        botonesOrden.forEach(orden => {
            orden.classList.remove('active-filter-btn');
        });
        e.target.classList.add('active-filter-btn');
        const filtroAplicado = e.target.textContent.toLowerCase();
        ordenarProductosPorPrecio(filtroAplicado);
    });
});

const ordenarProductosPorPrecio = (tipoOrden) => {
    const productosFiltrados = aplicarFiltro(categoriaSeleccionada);
    productosFiltrados.sort((a, b) => {
        const precioA = parseFloat(a.precio);
        const precioB = parseFloat(b.precio);

        if (tipoOrden === 'mayor precio') {
            return precioB - precioA;
        } else if (tipoOrden === 'menor precio') {
            return precioA - precioB;
        }
        return 0;
    });
    renderProductos(productosFiltrados);
};

  filtros.forEach(botonFiltro => {
    botonFiltro.addEventListener('click', (e) => {
        filtros.forEach(filtro => {
            filtro.classList.remove('active-filter-btn');
        });
        e.target.classList.add('active-filter-btn');
        categoriaSeleccionada = e.target.textContent.toLowerCase();
        const productosFiltrados = aplicarFiltro(categoriaSeleccionada);
        renderProductos(productosFiltrados);
    });
});

const aplicarFiltro = (categoria) => {
    if (categoria === 'all') {
        return productos;
    } else {
        return productos.filter(prod => prod.categoria === categoria);
    }
};

const productos = await fetchProductos();
document.addEventListener('DOMContentLoaded', renderProductos(aplicarFiltro(categoriaSeleccionada)));