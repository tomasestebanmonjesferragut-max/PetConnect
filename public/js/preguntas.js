// Preguntas: deja abierta solo una respuesta a la vez
const preguntas = document.querySelectorAll(".faq details");

preguntas.forEach(pregunta => {
  pregunta.addEventListener("toggle", () => {
    if (!pregunta.open) return;
    preguntas.forEach(otra => {
      if (otra !== pregunta) otra.open = false;
    });
  });
});
