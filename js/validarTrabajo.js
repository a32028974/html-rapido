export function validarCamposTrabajo(nombre, dni, cristal) {
  let valido = true;

  if (!nombre) {
    marcarError('nombre', 'El nombre es obligatorio');
    valido = false;
  }

  if (!/^\d{7,9}$/.test(dni)) {
    marcarError('dni', 'DNI inválido (7-9 dígitos)');
    valido = false;
  }

  if (!cristal) {
    marcarError('cristal', 'El tipo de cristal es obligatorio');
    valido = false;
  }

  return valido;
}

function marcarError(id, mensaje) {
  const input = document.getElementById(id);
  input.classList.add('error');
  let mensajeElem = document.getElementById(`msg-${id}`);
  if (!mensajeElem) {
    mensajeElem = document.createElement('small');
    mensajeElem.id = `msg-${id}`;
    input.insertAdjacentElement('afterend', mensajeElem);
  }
  mensajeElem.textContent = mensaje;
  mensajeElem.style.color = 'red';
}

function limpiarError(id) {
  const input = document.getElementById(id);
  input.classList.remove('error');
  const mensajeElem = document.getElementById(`msg-${id}`);
  if (mensajeElem) mensajeElem.remove();
}

export function activarValidacionesEnVivo() {
  const campos = ['nombre', 'dni', 'cristal'];
  campos.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      limpiarError(id);
    });
  });
}
