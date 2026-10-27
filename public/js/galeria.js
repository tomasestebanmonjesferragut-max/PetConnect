// Galería: fotos de mascotas en adopción y de las ya adoptadas, con visor
const contenedorFotos = document.getElementById("fotos");
const totalFotos = document.getElementById("totalFotos");
const visor = document.getElementById("visor");
const visorImagen = document.getElementById("visorImagen");
const visorTexto = document.getElementById("visorTexto");

// Junta todas las fotos en una sola lista con su estado
const todasLasFotos = [
  ...mascotas.flatMap(m => m.galeria
    .filter(g => g.tipo === "imagen")
    .map(g => ({ src: g.src, nombre: m.nombre, estado: "adopcion", id: m.id }))),
  ...fotosAdoptados.map(f => ({ ...f, estado: "adoptados" }))
];

let visibles = todasLasFotos;
let fotoActual = 0;

function textoFoto(f) {
  if (f.estado === "adopcion") return `${f.nombre} · busca hogar`;
  return f.nombre ? `${f.nombre} · ya tiene familia` : "Ya tiene familia";
}

function mostrarFotos(filtro) {
  visibles = filtro === "todas" ? todasLasFotos : todasLasFotos.filter(f => f.estado === filtro);
  totalFotos.textContent = `${visibles.length} foto(s)`;
  contenedorFotos.innerHTML = visibles.map((f, i) => `
    <figure class="foto-galeria">
      <button data-foto="${i}" aria-label="Ampliar foto: ${textoFoto(f)}">
        <img src="${f.src}" alt="${textoFoto(f)}">
      </button>
      <span class="sello sello--${f.estado}">${f.estado === "adopcion" ? "En adopción" : "Adoptado"}</span>
      <figcaption>${f.nombre || "Final feliz"}</figcaption>
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
  if (!filtro) return;
  document.querySelectorAll("[data-filtro]").forEach(b => b.classList.toggle("btn--borde", b !== e.target));
  mostrarFotos(filtro);
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

mostrarFotos("todas");
