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
const btnFavoritos = document.getElementById("btnFavoritos");
const btnLimpiar = document.getElementById("btnLimpiar");

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
  guardarFiltros();
}

// Los filtros se guardan para que sigan puestos al volver a la página
function guardarFiltros() {
  guardarJSON("filtrosMascotas", {
    texto: buscar.value,
    especie: filtroEspecie.value,
    edad: filtroEdad.value,
    soloFavoritos
  });
  btnLimpiar.hidden = !(buscar.value || filtroEspecie.value || filtroEdad.value || soloFavoritos);
}

function restaurarFiltros() {
  const guardados = leerJSON("filtrosMascotas", null);
  if (!guardados || typeof guardados !== "object") return;
  const existe = (select, valor) => [...select.options].some(o => o.value === valor);
  if (typeof guardados.texto === "string") buscar.value = guardados.texto;
  if (existe(filtroEspecie, guardados.especie)) filtroEspecie.value = guardados.especie;
  if (existe(filtroEdad, guardados.edad)) filtroEdad.value = guardados.edad;
  soloFavoritos = guardados.soloFavoritos === true;
  btnFavoritos.classList.toggle("btn--borde", !soloFavoritos);
}

function limpiarFiltros() {
  buscar.value = "";
  filtroEspecie.value = "";
  filtroEdad.value = "";
  soloFavoritos = false;
  btnFavoritos.classList.add("btn--borde");
  mostrarMascotas();
}

function cambiarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  guardarJSON("favoritos", favoritos);
  refrescar();
}

// Redibuja contador, tarjetas y el botón de la ficha abierta (también lo usa comun.js)
function refrescar() {
  contadorFav.textContent = favoritos.length;
  mostrarMascotas();
  const botonFicha = modalContenido.querySelector("[data-favficha]");
  if (botonFicha) {
    botonFicha.textContent = favoritos.includes(Number(botonFicha.dataset.favficha)) ? "❤️ Marcada" : "🤍 Marcar";
  }
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
buscar.addEventListener("keydown", e => {
  if (e.key === "Escape") { buscar.value = ""; mostrarMascotas(); }
});
btnLimpiar.addEventListener("click", limpiarFiltros);
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
  if (e.target.dataset.favficha) cambiarFavorito(Number(e.target.dataset.favficha));
});

btnFavoritos.addEventListener("click", () => {
  soloFavoritos = !soloFavoritos;
  btnFavoritos.classList.toggle("btn--borde", !soloFavoritos);
  mostrarMascotas();
});

// Al cerrar se borra el contenido para que un video no siga sonando
document.getElementById("cerrarModal").addEventListener("click", () => modal.close());
modal.addEventListener("close", () => { modalContenido.innerHTML = ""; });

// Si se llega desde el inicio (mascotas.html?ver=3) se abre esa ficha
restaurarFiltros();
contadorFav.textContent = favoritos.length;
mostrarMascotas();
const verId = Number(new URLSearchParams(location.search).get("ver"));
if (mascotas.some(m => m.id === verId)) abrirFicha(verId);
