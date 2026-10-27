// Código que usan todas las páginas
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// Primera imagen de la galería; si no hay o no carga se queda la huella
function foto(m, clase) {
  const portada = (m.galeria || []).find(g => g.tipo === "imagen");
  const img = portada ? `<img src="${portada.src}" alt="Foto de ${m.nombre}" onerror="this.remove()">` : "";
  return `<div class="${clase}">🐾${img}</div>`;
}

function tarjeta(m) {
  return `
    <article class="tarjeta">
      ${foto(m, "tarjeta__foto")}
      <div class="tarjeta__info">
        <h3>${m.nombre}</h3>
        <span class="etiqueta">${m.tipo}</span>
        <span class="etiqueta">${m.edad}</span>
        <p>${m.caracteristicas}</p>
        <div class="tarjeta__acciones">
          <button class="btn" data-ver="${m.id}">Conóceme</button>
          <button class="fav" data-fav="${m.id}" aria-label="Marcar a ${m.nombre} como de interés">${favoritos.includes(m.id) ? "❤️" : "🤍"}</button>
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
function medio(item, nombre) {
  if (item.tipo === "video") return `<video src="${item.src}" controls playsinline></video>`;
  if (item.tipo === "youtube") return `<iframe src="${linkYoutube(item.src)}" title="Video de ${nombre}" allowfullscreen></iframe>`;
  return `<img src="${item.src}" alt="Foto de ${nombre}">`;
}

// Menú móvil
const btnMenu = document.getElementById("btnMenu");
const nav = document.getElementById("nav");
btnMenu.addEventListener("click", () => {
  const abierto = nav.classList.toggle("nav--abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
});
