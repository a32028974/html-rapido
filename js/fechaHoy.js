// fechaHoy.js
// Devuelve hoy en formato dd/mm/aa y lo coloca en #fecha
export function cargarFechaHoy() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio2 = String(hoy.getFullYear()).slice(-2); // dd/mm/aa

  const fechaStr = `${dia}/${mes}/${anio2}`;
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) fechaInput.value = fechaStr;

  return { date: hoy, str: fechaStr };
}
