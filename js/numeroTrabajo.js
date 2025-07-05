export function configurarGeneracionNumeroTrabajo() {
  const numeroTrabajoInput = document.getElementById("numero_trabajo");
  const telefonoInput = document.getElementById("telefono");

  telefonoInput.addEventListener("blur", () => {
    const telefono = telefonoInput.value.trim();

    if (telefono.length < 4 || !/^\d+$/.test(telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'Ingresá al menos los últimos 4 números del celular del paciente.'
      });
      numeroTrabajoInput.value = "";
      return;
    }

    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hora = String(ahora.getHours()).padStart(2, '0');

    const ultimos4 = telefono.slice(-4);
    const numeroUnico = `5${mes}${dia}${hora}${ultimos4}`;

    numeroTrabajoInput.value = numeroUnico;
  });
}
