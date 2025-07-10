document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString("es-AR");
  document.getElementById("fecha").value = fechaFormateada;
});
