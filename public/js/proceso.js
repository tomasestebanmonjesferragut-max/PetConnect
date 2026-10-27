// Proceso: al hacer clic en un paso se marca como revisado
const pasos = document.querySelectorAll(".pasos li");
const avance = document.getElementById("avance");

function actualizarAvance() {
  const revisados = document.querySelectorAll(".pasos li.revisado").length;
  avance.textContent = revisados === pasos.length
    ? "¡Revisaste todos los pasos! Ya puedes elegir una mascota."
    : `Pasos revisados: ${revisados} de ${pasos.length}`;
}

pasos.forEach(paso => {
  paso.addEventListener("click", () => {
    paso.classList.toggle("revisado");
    actualizarAvance();
  });
});

actualizarAvance();
