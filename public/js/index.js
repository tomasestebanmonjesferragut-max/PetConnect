// Inicio: carrusel de mascotas, familias que adoptaron y ventana de novedades
const carrusel = document.getElementById("carrusel");
const pista = document.getElementById("pista");
const puntos = document.getElementById("puntos");
const listaFamilias = document.getElementById("familias");
const novedades = document.getElementById("novedades");

// ---------- Carrusel ----------
let actual = 0;
let temporizador = null;

pista.innerHTML = mascotas.map((m, i) => `
  <article class="diapositiva" aria-roledescription="diapositiva" aria-label="${i + 1} de ${mascotas.length}">
    <div class="diapositiva__texto">
      <p class="antetitulo">Busca un hogar</p>
      <h3>${escaparHTML(m.nombre)}</h3>
      <p class="diapositiva__historia">${escaparHTML(m.historia || m.caracteristicas)}</p>
      <p>
        <span class="etiqueta">${escaparHTML(m.tipo)}</span>
        <span class="etiqueta">${escaparHTML(m.edad)}</span>
        <span class="etiqueta">${escaparHTML(m.caracteristicas)}</span>
      </p>
      <div class="diapositiva__acciones">
        <a class="btn" href="mascotas.html?ver=${m.id}">Conóceme</a>
        <a class="btn btn--borde" href="contacto.html?mascota=${m.id}">Me interesa adoptar</a>
      </div>
    </div>
    ${foto(m, "diapositiva__foto")}
  </article>
`).join("");

puntos.innerHTML = mascotas.map((m, i) =>
  `<button class="punto-carrusel" data-ir="${i}" aria-label="Ver a ${escaparHTML(m.nombre)}"></button>`
).join("");

function irA(i) {
  actual = (i + mascotas.length) % mascotas.length;
  pista.style.transform = `translateX(-${actual * 100}%)`;
  puntos.querySelectorAll("button").forEach((b, j) => b.classList.toggle("activo", j === actual));
}

// Avanza solo cada 6 segundos; se detiene mientras el mouse está encima
function iniciarAutoplay() {
  clearInterval(temporizador);
  temporizador = setInterval(() => irA(actual + 1), 6000);
}

document.getElementById("anterior").addEventListener("click", () => { irA(actual - 1); iniciarAutoplay(); });
document.getElementById("siguiente").addEventListener("click", () => { irA(actual + 1); iniciarAutoplay(); });
puntos.addEventListener("click", e => {
  if (e.target.dataset.ir) { irA(Number(e.target.dataset.ir)); iniciarAutoplay(); }
});
carrusel.addEventListener("mouseenter", () => clearInterval(temporizador));
carrusel.addEventListener("mouseleave", iniciarAutoplay);

// Deslizar con el dedo en el celular
let inicioX = 0;
carrusel.addEventListener("touchstart", e => { inicioX = e.touches[0].clientX; }, { passive: true });
carrusel.addEventListener("touchend", e => {
  const distancia = e.changedTouches[0].clientX - inicioX;
  if (Math.abs(distancia) > 50) { irA(actual + (distancia < 0 ? 1 : -1)); iniciarAutoplay(); }
});

irA(0);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) iniciarAutoplay();

// ---------- Familias ----------
listaFamilias.innerHTML = familias.map(f => `
  <article class="familia">
    <span class="familia__icono">${f.especie === "gato" ? "🐱" : "🐶"}</span>
    <blockquote>“${escaparHTML(f.texto)}”</blockquote>
    <p class="familia__nombre">${escaparHTML(f.familia)} <span>adoptó a ${escaparHTML(f.mascota)}</span></p>
  </article>
`).join("");

// ---------- Novedades (una vez por visita) ----------
document.getElementById("novedadesLista").innerHTML = mascotas.slice(-2).map(m => `
  <li>${foto(m, "novedad__foto")}<span><strong>${escaparHTML(m.nombre)}</strong> llegó y busca familia. ${escaparHTML(m.caracteristicas)}.</span></li>
`).join("");

if (!sessionStorage.getItem("novedadesVistas")) {
  novedades.showModal();
  sessionStorage.setItem("novedadesVistas", "si");
}
document.getElementById("cerrarNovedades").addEventListener("click", () => novedades.close());
