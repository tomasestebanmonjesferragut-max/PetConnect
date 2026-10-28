// Perfil de la mascota: historial médico, informe de salud y descarga del perfil en imagen.
// En la ficha todo el texto se escapa con escaparHTML (seguridad.js) antes de mostrarlo.

// Solo deja textos; así un dato mal guardado no rompe la ficha
function soloTextos(lista) {
  return (Array.isArray(lista) ? lista : []).filter(t => typeof t === "string");
}

// Resumen de una línea: verde si todo está al día, naranja si le falta algo
function estadoSalud(m) {
  const s = m.salud;
  if (!s) return `<p class="salud__estado">Sin historial médico registrado.</p>`;
  const pendientes = soloTextos(s.pendientes).length;
  return pendientes
    ? `<p class="salud__estado salud__estado--pendiente">⚠️ Tiene ${pendientes} pendiente(s) de salud</p>`
    : `<p class="salud__estado salud__estado--ok">✅ Salud al día: vacunas y controles completos</p>`;
}

// Informe médico (lo que le falta y notas del veterinario) e historial completo
function detalleSalud(m) {
  const s = m.salud;
  if (!s) return "";
  const pendientes = soloTextos(s.pendientes);
  const observaciones = soloTextos(s.observaciones);
  const vacunas = (Array.isArray(s.vacunas) ? s.vacunas : []).filter(v => v && typeof v.nombre === "string");
  const dato = (titulo, valor) => typeof valor === "string" ? `<div><dt>${titulo}</dt><dd>${escaparHTML(valor)}</dd></div>` : "";

  return `
    <h4>Informe médico</h4>
    ${pendientes.length
      ? `<p class="salud__subtitulo">Le falta:</p><ul class="salud__lista salud__lista--pendiente">${pendientes.map(p => `<li>${escaparHTML(p)}</li>`).join("")}</ul>`
      : `<p class="salud__subtitulo">No tiene vacunas ni tratamientos pendientes.</p>`}
    ${observaciones.length
      ? `<p class="salud__subtitulo">Notas del veterinario:</p><ul class="salud__lista">${observaciones.map(o => `<li>${escaparHTML(o)}</li>`).join("")}</ul>`
      : ""}

    <h4>Historial de vacunas</h4>
    <table class="salud__tabla">
      <thead><tr><th>Vacuna</th><th>Fecha</th><th>Estado</th></tr></thead>
      <tbody>${vacunas.map(v => `
        <tr>
          <td>${escaparHTML(v.nombre)}</td>
          <td>${escaparHTML(String(v.fecha ?? ""))}</td>
          <td class="${v.alDia ? "al-dia" : "pendiente"}">${v.alDia ? "Al día" : "Pendiente"}</td>
        </tr>`).join("")}
      </tbody>
    </table>

    <h4>Otros datos</h4>
    <dl class="salud__datos">
      ${dato("Peso", s.peso)}
      ${dato("Esterilización", s.esterilizacion)}
      ${dato("Microchip", s.microchip)}
      ${dato("Última desparasitación", s.desparasitacion)}
      ${dato("Último control", s.ultimoControl)}
    </dl>
  `;
}

// Bloque de salud para la ficha: resumen visible y detalle desplegable
function bloqueSalud(m) {
  return `
    <section class="salud">
      <h3>Salud</h3>
      ${estadoSalud(m)}
      ${m.salud ? `<details class="salud__detalle"><summary>Ver historial e informe médico</summary>${detalleSalud(m)}</details>` : ""}
    </section>
  `;
}

// ---------- Descarga del perfil como imagen PNG ----------
// Se dibuja en un <canvas> (sin librerías) y se descarga como "perfil-nombre.png".
// En el canvas el texto se dibuja como texto plano, así que no necesita escaparse.

const ANCHO = 1080;
const MARGEN = 60;
const COLORES = { primario: "#2a9d8f", oscuro: "#1f7a6f", acento: "#f4a261", texto: "#264653", suave: "#e9f5f3", gris: "#667788", rojo: "#c62d39", crema: "#fdf0e6" };

function cargarImagen(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Escribe un texto en varias líneas si no cabe; devuelve la nueva posición vertical
function escribirParrafo(ctx, texto, x, y, anchoMax, alto) {
  let linea = "";
  for (const palabra of texto.split(" ")) {
    const prueba = linea ? linea + " " + palabra : palabra;
    if (ctx.measureText(prueba).width > anchoMax && linea) {
      ctx.fillText(linea, x, y);
      linea = palabra;
      y += alto;
    } else {
      linea = prueba;
    }
  }
  if (linea) ctx.fillText(linea, x, y);
  return y + alto;
}

function rectanguloRedondeado(ctx, x, y, ancho, alto, radio, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, ancho, alto, radio);
  ctx.fill();
}

// Dibuja todo el perfil; devuelve el alto que ocupó
function dibujarPerfil(ctx, m, foto) {
  const s = m.salud || {};
  const anchoTexto = ANCHO - MARGEN * 2;
  let y = 0;

  // Encabezado
  ctx.fillStyle = COLORES.texto;
  ctx.fillRect(0, 0, ANCHO, 110);
  ctx.font = "bold 44px system-ui, Arial, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("Pet", MARGEN, 72);
  ctx.fillStyle = COLORES.acento;
  ctx.fillText("Connect", MARGEN + ctx.measureText("Pet").width, 72);
  ctx.font = "24px system-ui, Arial, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "right";
  ctx.fillText("Perfil de adopción · " + new Date().toLocaleDateString("es-CL"), ANCHO - MARGEN, 70);
  ctx.textAlign = "left";
  y = 150;

  // Foto completa dentro de un recuadro
  if (foto) {
    const altoFoto = 560;
    rectanguloRedondeado(ctx, MARGEN, y, anchoTexto, altoFoto, 20, COLORES.suave);
    const escala = Math.min(anchoTexto / foto.width, altoFoto / foto.height);
    const w = foto.width * escala, h = foto.height * escala;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(MARGEN, y, anchoTexto, altoFoto, 20);
    ctx.clip();
    ctx.drawImage(foto, MARGEN + (anchoTexto - w) / 2, y + (altoFoto - h) / 2, w, h);
    ctx.restore();
    y += altoFoto + 50;
  }

  // Nombre y datos
  ctx.fillStyle = COLORES.texto;
  ctx.font = "bold 64px system-ui, Arial, sans-serif";
  ctx.fillText(m.nombre, MARGEN, y + 20);
  y += 60;
  const datos = [["ESPECIE", m.tipo], ["EDAD", m.edad], ["CARACTERÍSTICAS", m.caracteristicas]];
  const anchoDato = (anchoTexto - 30) / 3;
  datos.forEach(([titulo, valor], i) => {
    const x = MARGEN + i * (anchoDato + 15);
    rectanguloRedondeado(ctx, x, y, anchoDato, 100, 14, "#f1f8f7");
    ctx.fillStyle = COLORES.oscuro;
    ctx.font = "bold 18px system-ui, Arial, sans-serif";
    ctx.fillText(titulo, x + 18, y + 34);
    ctx.fillStyle = COLORES.texto;
    ctx.font = "bold 24px system-ui, Arial, sans-serif";
    escribirParrafo(ctx, String(valor || ""), x + 18, y + 70, anchoDato - 36, 28);
  });
  y += 140;

  // Historia
  if (m.historia) {
    ctx.font = "italic 26px system-ui, Arial, sans-serif";
    ctx.fillStyle = "#3a4a52";
    y = escribirParrafo(ctx, m.historia, MARGEN, y, anchoTexto, 38) + 20;
  }

  // Salud
  ctx.font = "bold 34px system-ui, Arial, sans-serif";
  ctx.fillStyle = COLORES.texto;
  ctx.fillText("Salud", MARGEN, y);
  y += 30;
  const pendientes = soloTextos(s.pendientes);
  const alDia = m.salud && pendientes.length === 0;
  rectanguloRedondeado(ctx, MARGEN, y, anchoTexto, 64, 14, alDia ? "#e3f4ef" : COLORES.crema);
  ctx.font = "bold 26px system-ui, Arial, sans-serif";
  ctx.fillStyle = alDia ? COLORES.oscuro : "#9a4f12";
  ctx.fillText(!m.salud ? "Sin historial médico registrado" : alDia ? "Salud al día: vacunas y controles completos" : `Tiene ${pendientes.length} pendiente(s) de salud`, MARGEN + 20, y + 42);
  y += 110;

  if (m.salud) {
    const subtitulo = texto => {
      ctx.font = "bold 26px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.oscuro;
      ctx.fillText(texto, MARGEN, y);
      y += 40;
    };
    const vineta = (texto, color) => {
      ctx.font = "24px system-ui, Arial, sans-serif";
      ctx.fillStyle = color;
      ctx.fillText("•", MARGEN + 6, y);
      ctx.fillStyle = COLORES.texto;
      y = escribirParrafo(ctx, texto, MARGEN + 34, y, anchoTexto - 34, 34);
    };

    subtitulo("Informe médico");
    if (pendientes.length) {
      ctx.font = "bold 24px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.texto;
      ctx.fillText("Le falta:", MARGEN, y);
      y += 36;
      pendientes.forEach(p => vineta(p, COLORES.rojo));
    } else {
      ctx.font = "24px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.texto;
      ctx.fillText("No tiene vacunas ni tratamientos pendientes.", MARGEN, y);
      y += 36;
    }
    const observaciones = soloTextos(s.observaciones);
    if (observaciones.length) {
      y += 6;
      ctx.font = "bold 24px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.texto;
      ctx.fillText("Notas del veterinario:", MARGEN, y);
      y += 36;
      observaciones.forEach(o => vineta(o, COLORES.primario));
    }
    y += 24;

    // Tabla de vacunas
    subtitulo("Historial de vacunas");
    const columnas = [MARGEN + 16, MARGEN + 470, MARGEN + 800];
    rectanguloRedondeado(ctx, MARGEN, y - 8, anchoTexto, 50, 10, COLORES.texto);
    ctx.font = "bold 22px system-ui, Arial, sans-serif";
    ctx.fillStyle = "#fff";
    ["Vacuna", "Fecha", "Estado"].forEach((t, i) => ctx.fillText(t, columnas[i], y + 25));
    y += 50;
    const vacunas = (Array.isArray(s.vacunas) ? s.vacunas : []).filter(v => v && typeof v.nombre === "string");
    vacunas.forEach(v => {
      ctx.font = "22px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.texto;
      const finNombre = escribirParrafo(ctx, v.nombre, columnas[0], y + 32, 430, 28);
      const finFecha = escribirParrafo(ctx, String(v.fecha ?? ""), columnas[1], y + 32, 310, 28);
      ctx.font = "bold 22px system-ui, Arial, sans-serif";
      ctx.fillStyle = v.alDia ? COLORES.oscuro : COLORES.rojo;
      ctx.fillText(v.alDia ? "Al día" : "Pendiente", columnas[2], y + 32);
      y = Math.max(finNombre, finFecha) + 6;
      ctx.fillStyle = "#d5e9e6";
      ctx.fillRect(MARGEN, y, anchoTexto, 2);
      y += 4;
    });
    y += 40;

    // Otros datos en dos columnas
    subtitulo("Otros datos");
    const otros = [["Peso", s.peso], ["Esterilización", s.esterilizacion], ["Microchip", s.microchip], ["Última desparasitación", s.desparasitacion], ["Último control", s.ultimoControl]]
      .filter(([, valor]) => typeof valor === "string");
    otros.forEach(([titulo, valor], i) => {
      const x = MARGEN + (i % 2) * (anchoTexto / 2);
      const fila = y + Math.floor(i / 2) * 76;
      ctx.font = "bold 18px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.oscuro;
      ctx.fillText(titulo.toUpperCase(), x, fila);
      ctx.font = "bold 26px system-ui, Arial, sans-serif";
      ctx.fillStyle = COLORES.texto;
      ctx.fillText(valor, x, fila + 34);
    });
    y += Math.ceil(otros.length / 2) * 76 + 10;
  }

  // Aviso y contacto
  rectanguloRedondeado(ctx, MARGEN, y, anchoTexto, 80, 10, COLORES.crema);
  ctx.fillStyle = COLORES.acento;
  ctx.fillRect(MARGEN, y, 8, 80);
  ctx.font = "22px system-ui, Arial, sans-serif";
  ctx.fillStyle = "#4a5a62";
  escribirParrafo(ctx, "Enviar tu interés no aprueba la adopción: primero coordinamos una entrevista.", MARGEN + 26, y + 48, anchoTexto - 40, 30);
  y += 120;
  ctx.font = "20px system-ui, Arial, sans-serif";
  ctx.fillStyle = COLORES.gris;
  ctx.fillText("adopciones@petconnect.cl · Instagram @petconnect.cl · WhatsApp +56 9 5555 3402", MARGEN, y);
  return y + 50;
}

// Dibuja el perfil y lo descarga como imagen PNG
async function descargarPerfil(m) {
  const portada = (m.galeria || []).find(g => g.tipo === "imagen");
  const foto = portada ? await cargarImagen(portada.src) : null;

  // Primero se dibuja en un lienzo alto y después se recorta al alto real
  const borrador = document.createElement("canvas");
  borrador.width = ANCHO;
  borrador.height = 4000;
  const ctx = borrador.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, ANCHO, borrador.height);
  const alto = dibujarPerfil(ctx, m, foto);

  const lienzo = document.createElement("canvas");
  lienzo.width = ANCHO;
  lienzo.height = alto;
  lienzo.getContext("2d").drawImage(borrador, 0, 0);

  const imagen = await new Promise(resolve => {
    try {
      lienzo.toBlob(resolve, "image/png");
    } catch {
      resolve(null); // El navegador bloquea la foto si se abre el sitio sin servidor
    }
  });
  if (!imagen) return;

  // Nombre de archivo sin tildes ni espacios, por ejemplo "perfil-canela.png"
  const nombreArchivo = "perfil-" + m.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".png";
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(imagen);
  enlace.download = nombreArchivo;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}
