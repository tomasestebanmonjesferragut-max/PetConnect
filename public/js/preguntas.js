// Preguntas: buscador en vivo y solo una respuesta abierta a la vez
const preguntas = document.querySelectorAll(".faq details");
const buscarPregunta = document.getElementById("buscarPregunta");
const sinPreguntas = document.getElementById("sinPreguntas");

// Quita tildes y mayúsculas para que "adopcion" encuentre "Adopción"
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function filtrarPreguntas() {
  const texto = normalizar(buscarPregunta.value.trim());
  let encontradas = 0;
  preguntas.forEach(pregunta => {
    const coincide = texto === "" || normalizar(pregunta.textContent).includes(texto);
    pregunta.hidden = !coincide;
    // Mientras se busca se abren las que coinciden; al borrar se cierran todas
    pregunta.open = coincide && texto !== "";
    if (coincide) encontradas++;
  });
  sinPreguntas.hidden = encontradas > 0;
}

preguntas.forEach(pregunta => {
  pregunta.addEventListener("toggle", () => {
    // Durante una búsqueda pueden quedar varias abiertas
    if (!pregunta.open || buscarPregunta.value.trim()) return;
    preguntas.forEach(otra => {
      if (otra !== pregunta) otra.open = false;
    });
  });
});

buscarPregunta.addEventListener("input", filtrarPreguntas);
buscarPregunta.addEventListener("keydown", e => {
  if (e.key === "Escape") { buscarPregunta.value = ""; filtrarPreguntas(); }
});
