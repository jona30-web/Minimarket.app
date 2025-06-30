// app.js (Frontend)

// URL base de tu backend desplegado en Render.com
const BACKEND_BASE_URL = 'https://minimarket-chacha-backend.onrender.com';

// ----------------------------------------------------
// Funciones de UI y navegación (déjalas como están si ya funcionan)
// ----------------------------------------------------

// Función para abrir y cerrar el Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// ----------------------------------------------------
// Funciones para interactuar con el Backend (API)
// ----------------------------------------------------

// Función para cargar los datos reales del Dashboard desde el Backend
async function loadDashboard() {
    const tableBody = document.querySelector("#accounts-table tbody");
    
    // Limpiar la tabla antes de agregar datos
    tableBody.innerHTML = '<tr><td colspan="5">Cargando productos...</td></tr>'; // Mensaje de carga

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/productos`); 
        
        if (!response.ok) {
            const errorData = await response.json(); // Intentar leer el error del backend
            throw new Error(`Error HTTP: ${response.status} - ${errorData.message || response.statusText}`);
        }
        
        const result = await response.json(); // Tu backend devuelve { message: 'success', data: [...] }
        const productos = result.data; // Accedemos al array de productos dentro de 'data'

        tableBody.innerHTML = ''; // Limpiar el mensaje de carga

        if (!Array.isArray(productos) || productos.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">No se encontraron productos en el inventario.</td></tr>`;
            return;
        }
        
        // Agregar los datos de los productos dinámicamente a la tabla
        // Las propiedades deben coincidir con las que vienen de tu backend: id, nombre, categoria, precio, stock
        productos.forEach(producto => { 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.codigo || 'N/A'}</td> 
                <td>${producto.nombre}</td>
                <td>${producto.categoria || 'Sin Categoría'}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.stock}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Problema al obtener los productos:', error);
        tableBody.innerHTML = `<tr><td colspan="5">Error al cargar los datos: ${error.message}. Asegúrate que el servidor backend esté corriendo y sea accesible.</td></tr>`;
    }
}

// Función para agregar un nuevo Producto
async function addProduct() {
    // Idealmente, aquí deberías mostrar un modal o un formulario más elaborado.
    // Por simplicidad, usaremos prompts para obtener los datos.
    const codigo = prompt('Ingrese el CÓDIGO del nuevo producto (ej. ABC009):');
    const nombre = prompt('Ingrese el NOMBRE del nuevo producto:');
    const categoria = prompt('Ingrese la CATEGORÍA (ej. Abarrotes, Bebidas):');
    const precio = prompt('Ingrese el PRECIO del nuevo producto (ej. 1.50):');
    const stock = prompt('Ingrese el STOCK inicial (ej. 10):');

    if (!codigo || !nombre || !precio || !stock) {
        alert('Todos los campos son obligatorios para agregar un producto.');
        return;
    }

    const nuevoProducto = {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria: categoria ? categoria.trim() : 'General',
        precio: parseFloat(precio),
        stock: parseInt(stock)
    };

    // Validaciones básicas antes de enviar
    if (isNaN(nuevoProducto.precio) || nuevoProducto.precio < 0) {
        alert('El precio debe ser un número válido y no negativo.');
        return;
    }
    if (isNaN(nuevoProducto.stock) || nuevoProducto.stock < 0) {
        alert('El stock debe ser un número entero válido y no negativo.');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        const result = await response.json(); // Tu backend devuelve { message, data } o { message, error }

        if (!response.ok) {
            // Si la respuesta no es OK (ej. 400, 409), el backend envía un error en el cuerpo
            throw new Error(result.error || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        alert(`Producto "${result.data.nombre}" agregado exitosamente con ID: ${result.data.id}`);
        loadDashboard(); // Recarga el dashboard para mostrar el nuevo producto
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert(`No se pudo agregar el producto: ${error.message}`);
    }
}

// Función para agregar un nuevo Cliente
async function addClient() {
    const nombre = prompt('Ingrese el NOMBRE del nuevo cliente:');
    const email = prompt('Ingrese el EMAIL del cliente:');
    const telefono = prompt('Ingrese el TELÉFONO del cliente (opcional):');

    if (!nombre || !email) {
        alert('Nombre y Email del cliente son obligatorios.');
        return;
    }

    const nuevoCliente = {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono ? telefono.trim() : ''
    };

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCliente)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        alert(`Cliente "${result.data.nombre}" agregado exitosamente con ID: ${result.data.id}`);
        // Puedes agregar una función para recargar una tabla de clientes si la tuvieras
    } catch (error) {
        console.error('Error al agregar el cliente:', error);
        alert(`No se pudo agregar el cliente: ${error.message}`);
    }
}

// Función para registrar una nueva Venta (Más compleja, requiere selección de productos)
async function recordSale() {
    // Para una venta real, necesitarías una interfaz que:
    // 1. Permita buscar y seleccionar productos.
    // 2. Permita especificar cantidades.
    // 3. Permita seleccionar un cliente existente.

    alert('Esta función de "Nueva Venta" es más compleja y requiere una interfaz de usuario dedicada para seleccionar productos y clientes. Por favor, implemente un formulario adecuado para esto.');

    // Simulación simplificada para demostrar la llamada al backend:
    const clienteId = prompt('Ingrese el ID del cliente para la venta (ej. cli001):');
    const productosVentaStr = prompt('Ingrese IDs de producto y cantidades (ej. prod001,2;prod004,1):'); // Formato simple

    if (!clienteId || !productosVentaStr) {
        alert('ID de cliente y productos son obligatorios para la venta.');
        return;
    }

    const productosParaBackend = [];
    productosVentaStr.split(';').forEach(item => {
        const parts = item.split(',');
        if (parts.length === 2) {
            productosParaBackend.push({
                prodId: parts[0].trim(),
                cantidad: parseInt(parts[1].trim())
            });
        }
    });

    if (productosParaBackend.length === 0) {
        alert('Formato de productos incorrecto. Use: prodID,cantidad;prodID,cantidad');
        return;
    }

    const nuevaVenta = {
        clienteId: clienteId.trim(),
        productos: productosParaBackend
    };

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaVenta)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Error HTTP: ${response.status} - ${response.statusText}`);
        }

        alert(`Venta registrada exitosamente con ID: ${result.data.id}. Total: $${result.data.total.toFixed(2)}`);
        loadDashboard(); // Recargar el dashboard (si muestra ventas o stock bajo)
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert(`No se pudo registrar la venta: ${error.message}`);
    }
}

// Funciones para gestionar inventario (actualizar/eliminar) - requieres más UI para esto
// Estas funciones se pueden integrar en un botón de "Gestionar Inventario" que abriría
// un modal o una nueva página para buscar, editar o eliminar productos.
async function updateProduct(productId, updatedData) {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/productos/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `Error al actualizar: ${response.status}`);
        }
        alert(`Producto ${productId} actualizado.`);
        loadDashboard();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert(`No se pudo actualizar el producto: ${error.message}`);
    }
}

async function deleteProduct(productId) {
    if (!confirm(`¿Estás seguro de eliminar el producto con ID ${productId}?`)) {
        return;
    }
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/productos/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error al eliminar: ${response.status}`);
        }
        alert(`Producto ${productId} eliminado.`);
        loadDashboard();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert(`No se pudo eliminar el producto: ${error.message}`);
    }
}


// ----------------------------------------------------
// Ejecución inicial y Event Listeners
// ----------------------------------------------------

// Cargar el dashboard al cargar la página
document.addEventListener('DOMContentLoaded', loadDashboard);

// Asignar funciones a los botones de acciones rápidas (asegúrate de que tu HTML tenga estos IDs o clases)
// Si tus botones tienen onclick, no necesitas esto, pero es una buena práctica.
// Ejemplo: <div class="quick-action-item" onclick="addProduct()">
// O si no tienen onclick y los quieres por ID:
/*
document.getElementById('add-product-btn').addEventListener('click', addProduct);
document.getElementById('add-client-btn').addEventListener('click', addClient);
document.getElementById('new-sale-btn').addEventListener('click', recordSale);
// Para gestionar inventario, podrías tener un botón que abra una interfaz más compleja.
*/
