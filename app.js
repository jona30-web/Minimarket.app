// app.js

// --- Funcionalidad del Sidebar ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    // Alternamos las clases para mostrar/ocultar el sidebar y ajustar el contenido principal
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// --- Gestión de Cuentas por Cobrar ---

// Función para cargar y mostrar las cuentas desde la API
async function cargarCuentas() {
    try {
        const response = await fetch('http://localhost:5000/api/cuentas');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const cuentas = await response.json();
        
        const tableBody = document.querySelector("#accounts-table tbody");
        tableBody.innerHTML = ''; // Limpiamos la tabla antes de añadir nuevas filas

        cuentas.forEach(cuenta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cuenta.factura}</td>
                <td>${cuenta.cliente}</td>
                <td>USD ${cuenta.montoOriginal.toFixed(2)}</td>
                <td>USD ${cuenta.saldoPendiente.toFixed(2)}</td>
                <td>${new Date(cuenta.fechaVencimiento).toLocaleDateString('es-EC')}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Hubo un problema al cargar las cuentas:", error);
        alert("No se pudieron cargar las cuentas. Intenta de nuevo más tarde.");
    }
}

// Función para crear una nueva cuenta (ejemplo de datos)
async function crearNuevaCuenta() {
    // Aquí puedes reemplazar estos datos fijos con un formulario para que el usuario los ingrese
    const nuevaCuenta = {
        factura: "0002", // Este valor debería ser dinámico o autogenerado
        cliente: "Carlos Gómez",
        montoOriginal: 300,
        saldoPendiente: 150,
        fechaVencimiento: "2024-08-20" // Formato YYYY-MM-DD
    };

    try {
        const response = await fetch('http://localhost:5000/api/cuentas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCuenta)
        });

        if (response.ok) {
            alert("¡Cuenta creada exitosamente!");
            cargarCuentas(); // Recargamos la lista para ver la nueva cuenta
        } else {
            const errorData = await response.json();
            alert(`Error al crear la cuenta: ${errorData.message || response.statusText}`);
            console.error("Detalles del error al crear cuenta:", errorData);
        }
    } catch (error) {
        console.error("Hubo un problema con la solicitud para crear la cuenta:", error);
        alert("Ocurrió un error de conexión al intentar crear la cuenta.");
    }
}

// --- Event Listeners y Carga Inicial ---

// Asignamos el evento al botón "Nueva Cuenta"
document.getElementById('new-account-btn').addEventListener('click', crearNuevaCuenta);

// Cuando el DOM esté completamente cargado, cargamos las cuentas
document.addEventListener('DOMContentLoaded', cargarCuentas);
