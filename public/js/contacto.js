// Contacto: formulario simulado (no se envía a ningún servidor).
// Valida en vivo mientras se escribe y guarda un borrador en localStorage.
const form = document.getElementById("formContacto");
const selectMascota = document.getElementById("selectMascota");
const errores = document.getElementById("errores");
const exito = document.getElementById("exito");
const botonEnviar = form.querySelector('button[type="submit"]');

const MIN_MENSAJE = 10;
const CLAVE_BORRADOR = "borradorContacto";

// Cada regla devuelve el error del campo, o "" si está bien
const reglas = {
  nombre: c => c.value.trim().length >= 3 ? "" : "Ingresa tu nombre (mínimo 3 letras).",
  correo: c => /^\S+@\S+\.\S+$/.test(c.value.trim()) ? "" : "Escribe un correo válido, como nombre@correo.cl.",
  mascota: c => c.value !== "" ? "" : "Selecciona una mascota de interés.",
  mensaje: c => c.value.trim().length >= MIN_MENSAJE ? "" : `Escribe al menos ${MIN_MENSAJE} caracteres.`,
  robot: c => c.checked ? "" : "Debes aceptar el compromiso de cuidado responsable."
};

// Los errores se muestran solo en campos que la persona ya tocó
const tocados = new Set();

// Espacio para el error bajo cada campo, contador del mensaje y vista de la mascota
const avisos = {};
for (const nombre of Object.keys(reglas)) {
  const aviso = document.createElement("small");
  aviso.className = "campo__error";
  aviso.setAttribute("aria-live", "polite");
  form.elements[nombre].closest("label").append(aviso);
  avisos[nombre] = aviso;
}

const contador = document.createElement("small");
contador.className = "campo__contador";
form.elements.mensaje.closest("label").append(contador);

const vistaMascota = document.createElement("div");
vistaMascota.className = "vista-mascota";
selectMascota.closest("label").after(vistaMascota);

function validarCampo(nombre) {
  const campo = form.elements[nombre];
  const error = reglas[nombre](campo);
  const mostrar = tocados.has(nombre);
  avisos[nombre].textContent = mostrar ? error : "";
  campo.classList.toggle("invalido", mostrar && error !== "");
  campo.classList.toggle("valido", error === "" && nombre !== "robot");
  return error === "";
}

// Revisa todo, actualiza el botón y el resumen; devuelve true si se puede enviar
function actualizarFormulario() {
  const pendientes = Object.keys(reglas).filter(nombre => !validarCampo(nombre));
  botonEnviar.disabled = pendientes.length > 0;
  errores.textContent = pendientes.length && tocados.size
    ? `Te falta completar ${pendientes.length} campo(s) para enviar.`
    : "";
  const largo = form.elements.mensaje.value.trim().length;
  contador.textContent = `${largo} / ${MIN_MENSAJE} caracteres mínimo`;
  contador.classList.toggle("listo", largo >= MIN_MENSAJE);
  return pendientes.length === 0;
}

function mostrarVistaMascota() {
  const m = mascotas.find(m => m.id === Number(selectMascota.value));
  vistaMascota.innerHTML = m
    ? `${foto(m, "vista-mascota__foto")}<span><strong>${escaparHTML(m.nombre)}</strong>${escaparHTML(m.tipo)} · ${escaparHTML(m.edad)}<br>${escaparHTML(m.caracteristicas)}</span>`
    : "";
}

function guardarBorrador() {
  const c = form.elements;
  guardarJSON(CLAVE_BORRADOR, {
    nombre: c.nombre.value,
    correo: c.correo.value,
    mascota: c.mascota.value,
    mensaje: c.mensaje.value
  });
}

function restaurarBorrador() {
  const borrador = leerJSON(CLAVE_BORRADOR, null);
  if (!borrador || typeof borrador !== "object") return;
  for (const nombre of ["nombre", "correo", "mensaje"]) {
    if (typeof borrador[nombre] === "string" && borrador[nombre] !== "") {
      form.elements[nombre].value = borrador[nombre];
      tocados.add(nombre);
    }
  }
  if (mascotas.some(m => String(m.id) === borrador.mascota)) {
    selectMascota.value = borrador.mascota;
    tocados.add("mascota");
  }
}

// Eventos en vivo: cada tecla o cambio actualiza el formulario
form.addEventListener("input", e => {
  if (!reglas[e.target.name]) return;
  if (e.target.type !== "checkbox") tocados.add(e.target.name);
  if (e.target === selectMascota) mostrarVistaMascota();
  actualizarFormulario();
  guardarBorrador();
});

form.addEventListener("change", e => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  actualizarFormulario();
});

form.addEventListener("focusout", e => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  actualizarFormulario();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  exito.hidden = true;
  Object.keys(reglas).forEach(nombre => tocados.add(nombre));
  if (!actualizarFormulario()) return;

  const nombre = form.elements.nombre.value.trim();
  const mascota = mascotas.find(m => m.id === Number(form.elements.mascota.value));

  // Se oculta el formulario y queda solo el mensaje de éxito
  Array.from(form.children).forEach(hijo => {
    if (hijo !== exito) hijo.hidden = true;
  });
  exito.textContent = `¡Gracias ${nombre}! Recibimos tu interés por ${mascota.nombre}. Te contactaremos para coordinar una entrevista; la adopción no queda aprobada automáticamente.`;
  exito.hidden = false;
  form.reset();
  borrarJSON(CLAVE_BORRADOR);
});

// Opciones del select con las mascotas
selectMascota.innerHTML += mascotas.map(m => `<option value="${m.id}">${escaparHTML(m.nombre)} (${escaparHTML(m.tipo)})</option>`).join("");

restaurarBorrador();

// Si se llega desde la ficha (contacto.html?mascota=3) queda elegida esa mascota
const elegida = new URLSearchParams(location.search).get("mascota");
if (mascotas.some(m => String(m.id) === elegida)) {
  selectMascota.value = elegida;
  tocados.add("mascota");
}

mostrarVistaMascota();
actualizarFormulario();
