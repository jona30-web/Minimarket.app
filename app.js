// Función para abrir y cerrar el Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Simular carga de cuentas
async function loadDashboard() {
    const tableBody = document.querySelector("#accounts-table tbody");
    
    // Simular datos que vendrían de una API
    const cuentas = [
        { factura: '0001', cliente: 'Juan Pérez', montoOriginal: 'USD 500.00', saldoPendiente: 'USD 200.00', fechaVencimiento: '12/07/2024' },
        { factura: '0002', cliente: 'Ana Gómez', montoOriginal: 'USD 300.00', saldoPendiente: 'USD 150.00', fechaVencimiento: '15/08/2024' },
    ];

    // Limpiar la tabla antes de agregar datos
    tableBody.innerHTML = '';
    
    // Agregar los datos de las cuentas dinámicamente
    cuentas.forEach(cuenta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cuenta.factura}</td>
            <td>${cuenta.cliente}</td>
            <td>${cuenta.montoOriginal}</td>
            <td>${cuenta.saldoPendiente}</td>
            <td>${cuenta.fechaVencimiento}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Crear nueva cuenta (simulada)
function createAccount() {
    alert('Nueva cuenta creada!');
}
