// Mascotas: buscador, filtros, favoritos y ficha con galería
let soloFavoritos = false;
let mascotaAbierta = null;

const listado = document.getElementById("listado");
const buscar = document.getElementById("buscar");
const filtroEspecie = document.getElementById("filtroEspecie");
const filtroEdad = document.getElementById("filtroEdad");
const resultado = document.getElementById("resultado");
const modal = document.getElementById("modal");
const modalContenido = document.getElementById("modalContenido");
const contadorFav = document.getElementById("contadorFav");

function rangoEdad(edadString) {
  const meses = obtenerMeses(edadString);
  if (meses < 12) return "cachorro";
  if (meses < 48) return "joven";
  return "adulto";
}

function mostrarMascotas() {
  const texto = buscar.value.trim().toLowerCase();

  const filtradas = mascotas.filter(m =>
    m.nombre.toLowerCase().includes(texto) &&
    (filtroEspecie.value === "" || m.especie === filtroEspecie.value) &&
    (filtroEdad.value === "" || rangoEdad(m.edad) === filtroEdad.value) &&
    (!soloFavoritos || favoritos.includes(m.id))
  );

  resultado.textContent = filtradas.length === 0
    ? "No hay mascotas con esos filtros."
    : `${filtradas.length} mascota(s) encontrada(s)`;

  listado.innerHTML = filtradas.map(tarjeta).join("");
}

function cambiarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  contadorFav.textContent = favoritos.length;
  mostrarMascotas();
}

function abrirFicha(id) {
  const m = mascotas.find(m => m.id === id);
  const esFavorito = favoritos.includes(m.id);
  const miniaturas = m.galeria.length > 1
    ? `<div class="galeria__miniaturas">${m.galeria.map((g, i) => `
        <button class="miniatura${i === 0 ? " activa" : ""}" data-medio="${i}" aria-label="Ver archivo ${i + 1}">
          ${g.tipo === "imagen" ? `<img src="${escaparHTML(g.src)}" alt="" style="object-position: ${encuadre(m)}">` : "▶"}
        </button>`).join("")}</div>`
    : "";

  modalContenido.innerHTML = `
    <div class="galeria">
      <div class="galeria__principal" id="medioPrincipal">${m.galeria.length ? medio(m.galeria[0], m) : "🐾"}</div>
      ${miniaturas}
    </div>
    <div class="ficha">
      <p class="ficha__antetitulo">Busca un hogar</p>
      <h2>${escaparHTML(m.nombre)}</h2>
      <p class="ficha__historia">${escaparHTML(m.historia || "")}</p>
      <ul class="ficha__datos">
        <li><span>Especie</span>${escaparHTML(m.tipo)}</li>
        <li><span>Edad</span>${escaparHTML(m.edad)}</li>
      </ul>
      <p class="ficha__texto"><span>Características</span>${escaparHTML(m.caracteristicas)}</p>
      <p class="ficha__nota">Enviar tu interés no aprueba la adopción: primero coordinamos una entrevista.</p>
      <div class="ficha__acciones">
        <a class="btn" href="contacto.html?mascota=${m.id}">Me interesa adoptar</a>
        <button class="btn btn--borde" data-favficha="${m.id}">${esFavorito ? "❤️ Marcada" : "🤍 Marcar"}</button>
      </div>
    </div>
  `;
  mascotaAbierta = m;
  modal.showModal();
}

// Cambia la foto o video grande al tocar una miniatura
function verMedio(i) {
  document.getElementById("medioPrincipal").innerHTML = medio(mascotaAbierta.galeria[i], mascotaAbierta);
  modalContenido.querySelectorAll(".miniatura").forEach((b, j) => b.classList.toggle("activa", j === i));
}

// Eventos
buscar.addEventListener("input", mostrarMascotas);
filtroEspecie.addEventListener("change", mostrarMascotas);
filtroEdad.addEventListener("change", mostrarMascotas);

listado.addEventListener("click", e => {
  const ver = e.target.dataset.ver;
  const fav = e.target.dataset.fav;
  if (ver) abrirFicha(Number(ver));
  if (fav) cambiarFavorito(Number(fav));
});

modalContenido.addEventListener("click", e => {
  const miniatura = e.target.closest(".miniatura");
  if (miniatura) verMedio(Number(miniatura.dataset.medio));
  if (e.target.dataset.favficha) {
    const id = Number(e.target.dataset.favficha);
    cambiarFavorito(id);
    e.target.textContent = favoritos.includes(id) ? "❤️ Marcada" : "🤍 Marcar";
  }
});

document.getElementById("btnFavoritos").addEventListener("click", e => {
  soloFavoritos = !soloFavoritos;
  e.currentTarget.classList.toggle("btn--borde", !soloFavoritos);
  mostrarMascotas();
});

// Al cerrar se borra el contenido para que un video no siga sonando
document.getElementById("cerrarModal").addEventListener("click", () => modal.close());
modal.addEventListener("close", () => { modalContenido.innerHTML = ""; });

// Si se llega desde el inicio (mascotas.html?ver=3) se abre esa ficha
contadorFav.textContent = favoritos.length;
mostrarMascotas();
const verId = Number(new URLSearchParams(location.search).get("ver"));
if (mascotas.some(m => m.id === verId)) abrirFicha(verId);
