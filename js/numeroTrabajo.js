import { API_URL } from './api.js';

export async function obtenerNumeroTrabajo() {
  try {
    const res = await fetch(`${API_URL}?proximoTrabajo=1`);
    const numero = await res.text();
    document.getElementById("numero_trabajo").value = numero;
  } catch (err) {
    console.error("Error obteniendo número de trabajo:", err);
  }
}
