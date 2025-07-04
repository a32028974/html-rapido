// numeroTrabajo.js
import { API_URL } from './api.js';

export function obtenerNumeroTrabajo() {
  const numeroTrabajoInput = document.getElementById("numero_trabajo");

  fetch(`${API_URL}?proximoTrabajo=1`)
    .then(res => res.text())
    .then(numero => {
      numeroTrabajoInput.value = numero;
    })
    .catch(err => {
      console.error("Error obteniendo número de trabajo:", err);
    });
}
