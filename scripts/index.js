'use strict';
import { Producto } from './producto.js';
import { Carrito } from './carrito.js';
let categoriaSeleccionada = 'all';
let carritoGuardado = JSON.parse(localStorage.getItem('carritoTepuy')) || [];
const carrito = new Carrito(carritoGuardado.productos,carritoGuardado.total);

const fetchProductos = async () => {
    const respuesta = await fetch("./productos.json");
    const productos = await respuesta.json();
    return productos;
}

const btnVaciarCarrito = document.querySelector('#cart button.btn.btn-secondary');
btnVaciarCarrito.addEventListener('click', () => {
    if(carrito.productos.length == 0) return
    carrito.vaciarCarrito();
})

const renderProductos = (productos) => {
    const contenedorProductos = document.querySelector('#productos');
    contenedorProductos.replaceChildren();
    productos.forEach((p, index) => {
        const prod = new Producto({ ...p });
        const cardProd = prod.toHTML(index);
        contenedorProductos.appendChild(cardProd);

        cardProd.querySelector('.view-product').addEventListener('click', () => {
            prod.llenaModalProducto(carrito);
        });

        cardProd.querySelector('.add-to-cart').addEventListener('click', (event) => {
            event.preventDefault();
            carrito.agregarAlCarrito({...prod, stock: 1});
        });
    });

    const modalOfertas = document.getElementById('oferta');
    modalOfertas.addEventListener('shown.bs.modal', () => {
        setTimeout(() => {
            const bootstrapModal = bootstrap.Modal.getInstance(modalOfertas);
            bootstrapModal.hide();
        }, 3000); // TODO cambiar a 10000
    });
};

document.getElementById('metodoPago').addEventListener('change', function () {
    const cuotasGroup = document.getElementById('cuotasGroup');
    if (this.value === 'credito') {
      cuotasGroup.classList.remove('d-none');
    } else {
      cuotasGroup.classList.add('d-none');
    }
});
const filtros = document.querySelectorAll('.contenedorFiltros button.filtro');
// const botonesOrden = document.querySelectorAll('.contenedorFiltros button.orden');

// botonesOrden.forEach(botonOrden => {
//     botonOrden.addEventListener('click', (e) => {
//         botonesOrden.forEach(orden => {
//             orden.classList.remove('active-filter-btn');
//         });
//         e.target.classList.add('active-filter-btn');
//         const filtroAplicado = e.target.textContent.toLowerCase();
//         ordenarProductosPorPrecio(filtroAplicado);
//     });
// });

const botonesOrden = document.querySelectorAll('.orden');

// Añade un evento a cada botón de ordenación
botonesOrden.forEach(botonOrden => {
    botonOrden.addEventListener('click', (e) => {
        // Quita la clase activa de todos los botones
        botonesOrden.forEach(boton => {
            boton.classList.remove('active-filter-btn');
        });

        // Añade la clase activa al botón seleccionado
        e.currentTarget.classList.add('active-filter-btn');

        // Obtén el tipo de orden del atributo data-order
        const tipoOrden = e.currentTarget.getAttribute('data-order');

        // Llama a la función de ordenación según el tipo
        ordenarProductosPorPrecio(tipoOrden);
    });
});

// const ordenarProductosPorPrecio = (tipoOrden) => {
//     const productosFiltrados = aplicarFiltro(categoriaSeleccionada);
//     productosFiltrados.sort((a, b) => {
//         const precioA = parseFloat(a.precio);
//         const precioB = parseFloat(b.precio);

//         if (tipoOrden === 'mayor precio') {
//             return precioB - precioA;
//         } else if (tipoOrden === 'menor precio') {
//             return precioA - precioB;
//         }
//         return 0;
//     });
//     renderProductos(productosFiltrados);
// };
const ordenarProductosPorPrecio = (tipoOrden) => {
    const productosFiltrados = aplicarFiltro(categoriaSeleccionada);
    productosFiltrados.sort((a, b) => {
        const precioA = parseFloat(a.precio);
        const precioB = parseFloat(b.precio);

        if (tipoOrden === 'desc') {
            return precioB - precioA;
        } else if (tipoOrden === 'asc') {
            return precioA - precioB;
        }
        return 0;
    });

    // Renderiza los productos ordenados
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
        llenarModalOferta(categoriaSeleccionada);
        renderProductos(productosFiltrados);
    });
});

const llenarModalOferta = (categoriaSeleccionada) => {
    const imagenOferta = document.getElementById('modal-oferta-img');
    switch (categoriaSeleccionada) {
        case 'new':
            imagenOferta.src = 'images/bannerNew.png';
            break;
        case 'off':
            imagenOferta.src = 'images/bannerOff.png';
            break;
        case 'sale':
            imagenOferta.src = 'images/bannerSale.png';
            break;
    }
}

const aplicarFiltro = (categoria) => {
    if (categoria === 'all') {
        return productos;
    } else {
        return productos.filter(prod => prod.categoria === categoria);
    }
};

const productos = await fetchProductos();

const inciaAplicacion = () => {
    carrito.llenarModalCarrito();
    carrito.actualizarIconoCarrito();
    carrito.calcularTotal();
    carrito.actualizarTotal();
    const productosFiltrados = aplicarFiltro(categoriaSeleccionada);
    renderProductos(productosFiltrados);
}

document.addEventListener('DOMContentLoaded', inciaAplicacion());