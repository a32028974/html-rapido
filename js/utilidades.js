export function mostrarSpinner(visible) {
  const spinner = document.getElementById('spinner');
  spinner.style.display = visible ? 'block' : 'none';
}
