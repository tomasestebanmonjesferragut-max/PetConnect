// Código que usan todas las páginas
let favoritos = leerJSON("favoritos", []);
if (!Array.isArray(favoritos)) favoritos = [];
favoritos = favoritos.filter(Number.isFinite);

// Qué parte de la foto se muestra cuando se recorta (arriba, centro o abajo)
const ENCUADRES = { arriba: "center 15%", centro: "center", abajo: "center 85%" };
// También acepta un punto exacto, como "45% 80%" (horizontal y vertical)
const PUNTO_EXACTO = /^\d{1,3}% \d{1,3}%$/;
function encuadre(m) {
  if (PUNTO_EXACTO.test(m.encuadre)) return m.encuadre;
  return ENCUADRES[m.encuadre] || ENCUADRES.centro;
}

// Primera imagen de la galería; si no hay o no carga se queda la huella
function foto(m, clase) {
  const portada = (m.galeria || []).find(g => g.tipo === "imagen");
  const img = portada ? `<img src="${escaparHTML(portada.src)}" alt="Foto de ${escaparHTML(m.nombre)}" style="object-position: ${encuadre(m)}" onerror="this.remove()">` : "";
  return `<div class="${clase}">🐾${img}</div>`;
}

function tarjeta(m) {
  return `
    <article class="tarjeta">
      ${foto(m, "tarjeta__foto")}
      <div class="tarjeta__info">
        <h3>${escaparHTML(m.nombre)}</h3>
        <span class="etiqueta">${escaparHTML(m.tipo)}</span>
        <span class="etiqueta">${escaparHTML(m.edad)}</span>
        <p>${escaparHTML(m.caracteristicas)}</p>
        <div class="tarjeta__acciones">
          <button class="btn" data-ver="${m.id}">Conóceme</button>
          <button class="fav" data-fav="${m.id}" aria-label="Marcar a ${escaparHTML(m.nombre)} como de interés">${favoritos.includes(m.id) ? "❤️" : "🤍"}</button>
        </div>
      </div>
    </article>
  `;
}

// Convierte el texto ("2 años", "5 meses") a un número de meses
function obtenerMeses(edadString) {
  const num = parseInt(edadString);
  if (edadString.toLowerCase().includes("año")) return num * 12;
  return num;
}

// Convierte un link de YouTube (watch, youtu.be o shorts) en link para incrustar
function linkYoutube(url) {
  const id = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return id ? `https://www.youtube.com/embed/${id[1]}` : "";
}

// Dibuja un elemento de la galería: foto, video subido o video de YouTube
function medio(item, m) {
  if (item.tipo === "video") return `<video src="${escaparHTML(item.src)}" controls playsinline></video>`;
  if (item.tipo === "youtube") return `<iframe src="${linkYoutube(item.src)}" title="Video de ${escaparHTML(m.nombre)}" allowfullscreen></iframe>`;
  // En la ficha la foto va completa; detrás, la misma foto difuminada rellena los bordes
  const src = escaparHTML(item.src);
  return `<img class="galeria__fondo" src="${src}" alt="" aria-hidden="true"><img class="galeria__foto" src="${src}" alt="Foto de ${escaparHTML(m.nombre)}">`;
}

// Menú móvil
const btnMenu = document.getElementById("btnMenu");
const nav = document.getElementById("nav");
btnMenu.addEventListener("click", () => {
  const abierto = nav.classList.toggle("nav--abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
});

// Si otra pestaña cambia los favoritos, esta se actualiza sin recargar.
// Cada página puede definir refrescar() para redibujar lo que necesite.
window.addEventListener("storage", e => {
  if (e.key !== "favoritos") return;
  const nuevos = leerJSON("favoritos", []);
  favoritos = Array.isArray(nuevos) ? nuevos.filter(Number.isFinite) : [];
  if (typeof refrescar === "function") refrescar();
});
