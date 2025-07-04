
const API_URL = "https://script.google.com/macros/s/AKfycbz08I3_yQjhtWvbgfJYHDR89dfF7m__e0jIhaJ_QURTdYSAuueaQ11UkIKphj1ACA-WiA/exec";

document.addEventListener("DOMContentLoaded", () => {
  const dniInput = document.getElementById("dni");
  const nombreInput = document.getElementById("nombre");
  const numeroArmazon = document.getElementById("numero_armazon");
  const armazonDetalle = document.getElementById("armazon_detalle");
  const totalInput = document.getElementById("total");
  const otroConceptoInput = document.getElementById("otro_concepto");
  const spinner = document.getElementById("spinner");

  function mostrarSpinner() {
    spinner.style.display = "block";
  }
  function ocultarSpinner() {
    spinner.style.display = "none";
  }

  async function buscarNombrePorDNI(dni) {
    try {
      mostrarSpinner();
      const res = await fetch(`${API_URL}?buscarDNI=${dni}`);
      const text = await res.text();
      console.log("Nombre obtenido:", text);
      if (text.startsWith("ERROR")) {
        nombreInput.value = "";
      } else {
        nombreInput.value = text;
      }
    } catch (err) {
      console.error("Error buscando DNI:", err);
    } finally {
      ocultarSpinner();
    }
  }

  async function buscarArmazonPorNumero(numero) {
    try {
      mostrarSpinner();
      const res = await fetch(`${API_URL}?buscarArmazon=${numero}`);
      const data = await res.json();
      console.log("Datos armazón:", data);
      if (data.modelo) {
        armazonDetalle.value = data.modelo;
        if (totalInput.value === "") totalInput.value = data.precio;
      } else {
        armazonDetalle.value = "No encontrado";
      }
    } catch (err) {
      console.error("Error buscando armazón:", err);
      armazonDetalle.value = "Error";
    } finally {
      ocultarSpinner();
    }
  }

  dniInput.addEventListener("blur", () => {
    if (dniInput.value.trim()) buscarNombrePorDNI(dniInput.value.trim());
  });

  numeroArmazon.addEventListener("blur", () => {
    if (numeroArmazon.value.trim()) buscarArmazonPorNumero(numeroArmazon.value.trim());
  });

  otroConceptoInput.addEventListener("input", () => {
    const otro = parseInt(otroConceptoInput.value) || 0;
    const total = parseInt(totalInput.value) || 0;
    totalInput.value = total + otro;
  });
});
