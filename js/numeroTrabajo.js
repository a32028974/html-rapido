// numeroTrabajo.js
export function generarNumeroTrabajo() {
  const numeroTrabajoInput = document.getElementById("numero_trabajo");
  const telefonoInput = document.getElementById("telefono");

  function crearNumeroUnico(telefono) {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, "0");
    const mes = String(now.getMonth() + 1).padStart(2, "0"); // enero = 0
    const hora = String(now.getHours()).padStart(2, "0");
    const anio = "5"; // solo el "5" de 2025

    const ultimos4 = telefono.slice(-4);

    return `${anio}${mes}${dia}${hora}${ultimos4}`;
  }

  telefonoInput.addEventListener("blur", () => {
    const telefono = telefonoInput.value.trim();
    if (telefono.length >= 4) {
      const numeroTrabajo = crearNumeroUnico(telefono);
      numeroTrabajoInput.value = numeroTrabajo;
    } else {
      numeroTrabajoInput.value = "";
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
        text: "Ingresá al menos los últimos 4 dígitos del teléfono.",
      });
    }
  });
}
