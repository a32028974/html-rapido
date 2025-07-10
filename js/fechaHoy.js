document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString("es-AR");
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) fechaInput.value = fechaFormateada;
});
