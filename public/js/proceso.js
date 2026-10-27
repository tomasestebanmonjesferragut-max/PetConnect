// Proceso: al hacer clic en un paso se marca como revisado y se recuerda
const pasos = document.querySelectorAll(".pasos li");
const avance = document.getElementById("avance");
const barraProgreso = document.getElementById("barraProgreso");

function actualizarAvance() {
  const revisados = [...pasos].filter(p => p.classList.contains("revisado"));
  avance.textContent = revisados.length === pasos.length
    ? "¡Revisaste todos los pasos! Ya puedes elegir una mascota."
    : `Pasos revisados: ${revisados.length} de ${pasos.length}`;
  barraProgreso.style.width = `${(revisados.length / pasos.length) * 100}%`;
  guardarJSON("pasosRevisados", revisados.map(p => [...pasos].indexOf(p)));
}

pasos.forEach(paso => {
  paso.addEventListener("click", () => {
    paso.classList.toggle("revisado");
    actualizarAvance();
  });
});

// Recupera los pasos marcados en una visita anterior
const guardados = leerJSON("pasosRevisados", []);
if (Array.isArray(guardados)) {
  guardados.forEach(i => pasos[i]?.classList.add("revisado"));
}

actualizarAvance();
