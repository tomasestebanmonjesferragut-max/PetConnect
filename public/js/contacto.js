// Contacto: formulario simulado (no se envía a ningún servidor)
const form = document.getElementById("formContacto");
const selectMascota = document.getElementById("selectMascota");
const errores = document.getElementById("errores");
const exito = document.getElementById("exito");

function validarFormulario() {
  const mensajes = [];
  const campos = form.elements;

  form.querySelectorAll(".invalido").forEach(c => c.classList.remove("invalido"));

  if (campos.nombre.value.trim().length < 3) {
    mensajes.push("Ingresa tu nombre.");
    campos.nombre.classList.add("invalido");
  }
  if (!/^\S+@\S+\.\S+$/.test(campos.correo.value)) {
    mensajes.push("El correo no es válido.");
    campos.correo.classList.add("invalido");
  }
  if (campos.mascota.value === "") {
    mensajes.push("Selecciona una mascota de interés.");
    campos.mascota.classList.add("invalido");
  }
  if (campos.mensaje.value.trim().length < 10) {
    mensajes.push("Escribe un mensaje de al menos 10 caracteres.");
    campos.mensaje.classList.add("invalido");
  }
  if (!campos.robot.checked) {
    mensajes.push("Por favor, confirma que no eres un robot.");
  }

  errores.innerHTML = mensajes.join("<br>");
  return mensajes.length === 0;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  exito.hidden = true;
  if (!validarFormulario()) return;

  const nombre = form.elements.nombre.value.trim();
  const mascota = mascotas.find(m => m.id === Number(form.elements.mascota.value));

  // Se oculta el formulario y queda solo el mensaje de éxito
  Array.from(form.children).forEach(hijo => {
    if (hijo !== exito) hijo.hidden = true;
  });
  exito.textContent = `¡Gracias ${nombre}! Recibimos tu interés por ${mascota.nombre}. Te contactaremos para coordinar una entrevista; la adopción no queda aprobada automáticamente.`;
  exito.hidden = false;
  form.reset();
});

// Opciones del select con las mascotas
selectMascota.innerHTML += mascotas.map(m => `<option value="${m.id}">${m.nombre} (${m.tipo})</option>`).join("");

// Si se llega desde la ficha (contacto.html?mascota=3) queda elegida esa mascota
const elegida = new URLSearchParams(location.search).get("mascota");
if (elegida) selectMascota.value = elegida;
