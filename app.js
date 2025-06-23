// Cargar cuentas por cobrar
async function cargarCuentas() {
    const response = await fetch('http://localhost:5000/api/cuentas');
    const cuentas = await response.json();
    const tableBody = document.querySelector("#accounts-table tbody");
    tableBody.innerHTML = ''; // Limpiar tabla

    cuentas.forEach(cuenta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cuenta.factura}</td>
            <td>${cuenta.cliente}</td>
            <td>${cuenta.montoOriginal}</td>
            <td>${cuenta.saldoPendiente}</td>
            <td>${new Date(cuenta.fechaVencimiento).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Crear nueva cuenta
document.getElementById('new-account-btn').addEventListener('click', async () => {
    const nuevaCuenta = {
        factura: "0002",
        cliente: "Carlos Gómez",
        montoOriginal: 300,
        saldoPendiente: 150,
        fechaVencimiento: "2024-08-20"
    };

    const response = await fetch('http://localhost:5000/api/cuentas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaCuenta)
    });

    if (response.ok) {
        alert("Cuenta creada exitosamente!");
        cargarCuentas();
    } else {
        alert("Error al crear la cuenta.");
    }
});

// Llamada inicial para cargar cuentas
cargarCuentas();
