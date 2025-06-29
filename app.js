// Función para abrir y cerrar el Sidebar (DEJA ESTA FUNCIÓN TAL CUAL)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Función para cargar los datos reales del Dashboard desde el Backend
async function loadDashboard() {
    const tableBody = document.querySelector("#accounts-table tbody");

    // Limpiar la tabla antes de agregar datos
    tableBody.innerHTML = ''; 

    try {
        // Realizar la petición a tu API de Backend en Render.com
        const response = await fetch('https://minimarket-chacha-backend.onrender.com/api/productos'); 

        // Verificar si la respuesta de la red fue exitosa (código 200)
        if (!response.ok) {
            // Si hay un error en la respuesta HTTP, lanzar un error
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        // Convertir la respuesta a JSON (esto contendrá tus productos)
        const productos = await response.json(); 

        // Verificar si se recibieron productos y si es un array
        if (!Array.isArray(productos) || productos.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">No se encontraron productos.</td></tr>`;
            return; // Salir de la función si no hay productos
        }

        // Agregar los datos de los productos dinámicamente a la tabla
        // Asegúrate que los nombres de las propiedades (id, nombre, categoria, precio, stock)
        // coincidan exactamente con los que tu backend envía.
        productos.forEach(producto => { 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id}</td> 
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Problema al obtener los productos:', error);
        // Mostrar un mensaje de error en la interfaz de usuario si algo falla
        tableBody.innerHTML = `<tr><td colspan="5">Error al cargar los datos: ${error.message}. Por favor, asegúrate que el servidor backend esté corriendo y sea accesible.</td></tr>`;
    }
}

// Crear nueva cuenta (simulada) - (DEJA ESTA FUNCIÓN TAL CUAL, si no la vas a conectar a la API aún)
function createAccount() {
    alert('Nueva cuenta creada!');
}
