// numeroTrabajo.js
import { API_URL } from './api.js';

export async function obtenerNumeroTrabajo() {
  const numeroTrabajoInput = document.getElementById("numero_trabajo");

  try {
    const res = await fetch(`${API_URL}?proximoTrabajo=1`);
    const numero = await res.text();
    numeroTrabajoInput.value = numero;
  } catch (err) {
    console.error("Error obteniendo número de trabajo:", err);
    numeroTrabajoInput.value = "100001"; // fallback
  }
}
