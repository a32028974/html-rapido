// calculos.js

export function configurarCalculoPrecios() {
  const precioCristalInput = document.getElementById("precio_cristal");
  const precioArmazonInput = document.getElementById("precio_armazon");
  const precioOtroInput = document.getElementById("precio_otro");
  const totalInput = document.getElementById("total");
  const saldoInput = document.getElementById("saldo");
  const senaInput = document.getElementById("sena");

  function recalcularTotal() {
    const cristal = parseFloat(precioCristalInput.value) || 0;
    const armazon = parseFloat(precioArmazonInput.value) || 0;
    const otro = parseFloat(precioOtroInput.value) || 0;

    const total = cristal + armazon + otro;
    totalInput.value = total;

    recalcularSaldo();
  }

  function recalcularSaldo() {
    const total = parseFloat(totalInput.value) || 0;
    const sena = parseFloat(senaInput.value) || 0;
    const saldo = total - sena;
    saldoInput.value = saldo >= 0 ? saldo : 0;
  }

  precioCristalInput.addEventListener("input", recalcularTotal);
  precioArmazonInput.addEventListener("input", recalcularTotal);
  precioOtroInput.addEventListener("input", recalcularTotal);
  senaInput.addEventListener("input", recalcularSaldo);
}
