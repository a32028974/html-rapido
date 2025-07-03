export function validarCamposTrabajo(nombre, dni, cristal) {
  if (!nombre || !dni || !cristal) return false;
  if (!/^\d{7,9}$/.test(dni)) return false;
  return true;
}
