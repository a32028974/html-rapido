export function mostrarSpinner(visible) {
  document.getElementById('spinner').style.display = visible ? 'block' : 'none';
}

export function imprimirFormulario() {
  window.print();
}
