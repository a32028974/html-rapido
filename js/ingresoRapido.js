const SPREADSHEET_ID = "1Cflls-2QlR_ZBwkSF6pV3aeKDYpD4z1qkD1hwPFlrZU";
const HOJA_TRABAJOS = "Carga de trabajos";
const HOJA_STOCK = "Stock";

function doPost(e) {
  try {
    const hoja = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(HOJA_TRABAJOS);

    const data = {};
    for (let key in e.parameter) {
      data[key] = e.parameter[key].toString().toUpperCase();
    }

    const diasEntrega = {
      "NORMAL": 7,
      "LABORATORIO": 15,
      "URGENTE": 3
    };

    const hoy = new Date();
    let fechaRetira = "";
    if (data.retiro_tipo && diasEntrega[data.retiro_tipo]) {
      const f = new Date(hoy);
      f.setDate(f.getDate() + diasEntrega[data.retiro_tipo]);
      fechaRetira = Utilities.formatDate(f, Session.getScriptTimeZone(), "dd/MM/yy");
    }

    hoja.appendRow([
      "",                             // A - Estado (vacío)
      hoy,                            // B - Fecha de encargo
      fechaRetira,                    // C - Fecha de retiro calculada
      data.numero_trabajo || "",      // D
      data.dni || "",                 // E
      data.nombre || "",              // F
      data.cristal || "",             // G
      data.numero_armazon || "",      // H
      data.armazon_detalle || "",     // I
      data.total || "",               // J
      data.sena || "",                // K
      data.saldo || "",               // L
      data.forma_pago || "",          // M
      data.otro_concepto || "",       // N
      data.descripcion || "",         // O
      data.tipo || "",                // P
      data.od_esf || "",              // Q
      data.od_cil || "",              // R
      data.od_eje || "",              // S
      data.oi_esf || "",              // T
      data.oi_cil || "",              // U
      data.oi_eje || "",              // V
      data.add || "",                 // W
      data.vendedor || ""             // X
    ]);

    return ContentService
      .createTextOutput("✅ Trabajo guardado correctamente")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService
      .createTextOutput("❌ Error: " + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Buscar modelo de armazón por número
  if (e.parameter.buscarArmazon) {
    const hojaStock = ss.getSheetByName(HOJA_STOCK);
    const datos = hojaStock.getDataRange().getValues();
    const numero = e.parameter.buscarArmazon.toString().trim();

    for (let i = 1; i < datos.length; i++) {
      if (datos[i][0].toString().trim() === numero) {
        const modelo = [datos[i][1], datos[i][2], datos[i][3], datos[i][8]]
          .filter(v => v)
          .join(" - ")
          .toUpperCase();
        return ContentService.createTextOutput(modelo);
      }
    }

    return ContentService.createTextOutput("ERROR: Armazón no encontrado");
  }

  // Buscar nombre por DNI
  if (e.parameter.buscarDNI) {
    const hojaTrabajos = ss.getSheetByName(HOJA_TRABAJOS);
    const datos = hojaTrabajos.getDataRange().getValues();
    const dni = e.parameter.buscarDNI.toString().trim();

    for (let i = datos.length - 1; i >= 0; i--) {
      if (datos[i][4].toString().trim() === dni && datos[i][5]) {
        return ContentService.createTextOutput(datos[i][5].toUpperCase());
      }
    }

    return ContentService.createTextOutput("ERROR: DNI no encontrado");
  }

  // Próximo número de trabajo
  if (e.parameter.proximoTrabajo) {
    const hojaTrabajos = ss.getSheetByName(HOJA_TRABAJOS);
    const datos = hojaTrabajos.getDataRange().getValues();
    const ultFila = datos[datos.length - 1];
    const ultimoNum = parseInt(ultFila[3]) || 100000;
    return ContentService.createTextOutput((ultimoNum + 1).toString());
  }

  return ContentService.createTextOutput("❌ Parámetros inválidos");
}
