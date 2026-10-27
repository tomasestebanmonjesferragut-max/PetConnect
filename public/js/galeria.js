// Galería: fotos de mascotas en adopción y de las ya adoptadas, con visor
const contenedorFotos = document.getElementById("fotos");
const totalFotos = document.getElementById("totalFotos");
const visor = document.getElementById("visor");
const visorImagen = document.getElementById("visorImagen");
const visorTexto = document.getElementById("visorTexto");
const buscarFoto = document.getElementById("buscarFoto");
const botonesFiltro = document.querySelectorAll("[data-filtro]");

// Junta todas las fotos en una sola lista con su estado
const todasLasFotos = [
  ...mascotas.flatMap(m => m.galeria
    .filter(g => g.tipo === "imagen")
    .map(g => ({ src: g.src, nombre: m.nombre, estado: "adopcion", id: m.id }))),
  ...fotosAdoptados.map(f => ({ ...f, estado: "adoptados" }))
];

let visibles = todasLasFotos;
let fotoActual = 0;
let filtroActual = "todas";

function textoFoto(f) {
  if (f.estado === "adopcion") return `${escaparHTML(f.nombre)} · busca hogar`;
  return f.nombre ? `${escaparHTML(f.nombre)} · ya tiene familia` : "Ya tiene familia";
}

// Filtra por estado (botones) y por nombre (buscador) a la vez
function mostrarFotos(filtro = filtroActual) {
  filtroActual = filtro;
  const texto = buscarFoto.value.trim().toLowerCase();
  visibles = todasLasFotos.filter(f =>
    (filtro === "todas" || f.estado === filtro) &&
    (texto === "" || (f.nombre || "").toLowerCase().includes(texto))
  );
  botonesFiltro.forEach(b => b.classList.toggle("btn--borde", b.dataset.filtro !== filtro));
  guardarJSON("filtroGaleria", filtro);
  totalFotos.textContent = visibles.length ? `${visibles.length} foto(s)` : "No hay fotos con ese nombre.";
  contenedorFotos.innerHTML = visibles.map((f, i) => `
    <figure class="foto-galeria">
      <button data-foto="${i}" aria-label="Ampliar foto: ${textoFoto(f)}">
        <img src="${escaparHTML(f.src)}" alt="${textoFoto(f)}">
      </button>
      <span class="sello sello--${f.estado}">${f.estado === "adopcion" ? "En adopción" : "Adoptado"}</span>
      <figcaption>${escaparHTML(f.nombre) || "Final feliz"}</figcaption>
    </figure>
  `).join("");
}

function abrirVisor(i) {
  fotoActual = (i + visibles.length) % visibles.length;
  const f = visibles[fotoActual];
  visorImagen.src = f.src;
  visorImagen.alt = textoFoto(f);
  visorTexto.innerHTML = f.estado === "adopcion"
    ? `${textoFoto(f)} · <a href="mascotas.html?ver=${f.id}">Conóceme</a>`
    : textoFoto(f);
  if (!visor.open) visor.showModal();
}

// Eventos
document.querySelector(".galeria-filtros").addEventListener("click", e => {
  const filtro = e.target.dataset.filtro;
  if (filtro) mostrarFotos(filtro);
});

buscarFoto.addEventListener("input", () => mostrarFotos());
buscarFoto.addEventListener("keydown", e => {
  if (e.key === "Escape") { buscarFoto.value = ""; mostrarFotos(); }
});

contenedorFotos.addEventListener("click", e => {
  const boton = e.target.closest("[data-foto]");
  if (boton) abrirVisor(Number(boton.dataset.foto));
});

document.getElementById("visorAnterior").addEventListener("click", () => abrirVisor(fotoActual - 1));
document.getElementById("visorSiguiente").addEventListener("click", () => abrirVisor(fotoActual + 1));
document.getElementById("cerrarVisor").addEventListener("click", () => visor.close());
visor.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") abrirVisor(fotoActual - 1);
  if (e.key === "ArrowRight") abrirVisor(fotoActual + 1);
});

// Se recuerda el último filtro elegido
const filtroGuardado = leerJSON("filtroGaleria", "todas");
mostrarFotos(["todas", "adopcion", "adoptados"].includes(filtroGuardado) ? filtroGuardado : "todas");
