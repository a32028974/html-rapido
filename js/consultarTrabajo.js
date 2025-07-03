export function buscarTrabajo() {
  const numero = document.getElementById('numeroTrabajo').value.trim();
  const dni = document.getElementById('dniCliente').value.trim();

  if (!numero || !dni) {
    alert("Por favor, completá ambos campos.");
    return;
  }

  mostrarSpinner(true);
  document.getElementById('resultado').innerHTML = '';

  const url = `https://script.google.com/macros/s/AKfycbwnBoz6Hidxrp2hOVT_0vICk2P-lF4gv5DIEmXzgPpX60-o--SBlgdn6pb9pLpZds2EoQ/exec?numero=${numero}&dni=${dni}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      mostrarSpinner(false);
      if (data && data.resultado === "encontrado") {
        document.getElementById('resultado').innerHTML = `
          <strong>Estado:</strong> ${data.estado}<br>
          <strong>Nombre:</strong> ${data.nombre}<br>
          <strong>Trabajo:</strong> ${data.detalle || 'No especificado'}<br>
          <strong>Fecha de entrega:</strong> ${data.fecha_entrega || 'No indicada'}
        `;
      } else {
        document.getElementById('resultado').innerHTML = 'No se encontró ningún trabajo con esos datos.';
      }
    })
    .catch(err => {
      console.error(err);
      mostrarSpinner(false);
      document.getElementById('resultado').innerHTML = 'Ocurrió un error al consultar los datos.';
    });
}
