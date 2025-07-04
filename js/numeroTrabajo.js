// numeroTrabajo.js
import { API_URL } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const numeroTrabajoInput = document.getElementById("numero_trabajo");

  async function obtenerProximoNumero() {
    try {
      const res = await fetch(`${API_URL}?proximoTrabajo=1`);
      const numero = await res.text();
      numeroTrabajoInput.value = numero;
    } catch (err) {
      console.error("Error obteniendo número de trabajo:", err);
    }
  }

  obtenerProximoNumero();
});
