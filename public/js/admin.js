// Administración: agregar, editar y quitar mascotas.
// Sin servidor: los datos se guardan en localStorage de este navegador.
const formMascota = document.getElementById("formMascota");
const listaAdmin = document.getElementById("listaAdmin");
const galeriaActual = document.getElementById("galeriaActual");
const erroresAdmin = document.getElementById("erroresAdmin");
const exitoAdmin = document.getElementById("exitoAdmin");
const tituloForm = document.getElementById("tituloForm");
const vistaPrevia = document.getElementById("vistaPrevia");

const MAX_VIDEO_MB = 3;
let editandoId = null;
let galeria = [];

function guardarDatos() {
  try {
    localStorage.setItem("mascotasAdmin", JSON.stringify(mascotas));
    return true;
  } catch {
    erroresAdmin.textContent = "No hay espacio suficiente en el navegador. Usa archivos más livianos o un link de YouTube.";
    return false;
  }
}

function mostrarLista() {
  listaAdmin.innerHTML = mascotas.map(m => `
    <li>
      ${foto(m, "admin__miniatura")}
      <span><strong>${escaparHTML(m.nombre)}</strong> · ${escaparHTML(m.tipo)} · ${escaparHTML(m.edad)} · ${m.galeria.length} archivo(s)</span>
      <button class="btn btn--borde" data-editar="${m.id}">Editar</button>
      <button class="btn btn--peligro" data-borrar="${m.id}">Quitar</button>
    </li>
  `).join("");
}

function mostrarGaleria() {
  galeriaActual.innerHTML = galeria.map((g, i) => `
    <div class="admin__medio">
      ${g.tipo === "imagen" ? `<img src="${escaparHTML(g.src)}" alt="">` : `<span>▶ ${g.tipo === "youtube" ? "YouTube" : "Video"}</span>`}
      <button type="button" data-quitar="${i}" aria-label="Quitar archivo">✕</button>
    </div>
  `).join("");
  actualizarVista();
}

// Muestra cómo se verá la primera foto recortada en la tarjeta
function actualizarVista() {
  const nueva = [...formMascota.elements.archivos.files].find(a => a.type.startsWith("image/"));
  const guardada = galeria.find(g => g.tipo === "imagen");
  const src = guardada ? guardada.src : nueva ? URL.createObjectURL(nueva) : "";
  const posicion = ENCUADRES[formMascota.elements.encuadre.value];
  vistaPrevia.innerHTML = src ? `🐾<img src="${escaparHTML(src)}" alt="" style="object-position: ${posicion}">` : "🐾";
}

function limpiarFormulario() {
  editandoId = null;
  galeria = [];
  formMascota.reset();
  tituloForm.textContent = "Nueva mascota";
  erroresAdmin.textContent = "";
  mostrarGaleria();
}

function editar(id) {
  const m = mascotas.find(m => m.id === id);
  editandoId = id;
  galeria = [...m.galeria];
  const campos = formMascota.elements;
  campos.nombre.value = m.nombre;
  campos.tipo.value = m.tipo;
  campos.edad.value = m.edad;
  campos.caracteristicas.value = m.caracteristicas;
  campos.historia.value = m.historia || "";
  campos.encuadre.value = m.encuadre || "centro";
  tituloForm.textContent = `Editando a ${m.nombre}`;
  exitoAdmin.hidden = true;
  mostrarGaleria();
  formMascota.scrollIntoView({ behavior: "smooth" });
}

// Las fotos se achican a 900 px para que quepan en localStorage
function leerImagen(archivo) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, 900 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * escala;
      canvas.height = img.height * escala;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve({ tipo: "imagen", src: canvas.toDataURL("image/jpeg", 0.8) });
    };
    img.src = URL.createObjectURL(archivo);
  });
}

function leerVideo(archivo) {
  return new Promise(resolve => {
    const lector = new FileReader();
    lector.onload = () => resolve({ tipo: "video", src: lector.result });
    lector.readAsDataURL(archivo);
  });
}

function validar(campos) {
  const mensajes = [];
  if (campos.nombre.value.trim().length < 2) mensajes.push("Ingresa el nombre.");
  if (!/^\d+\s*(mes|meses|año|años)$/i.test(campos.edad.value.trim())) mensajes.push('La edad debe ser como "2 años" o "5 meses".');
  if (campos.caracteristicas.value.trim() === "") mensajes.push("Ingresa las características.");
  if (campos.youtube.value && !linkYoutube(campos.youtube.value)) mensajes.push("El link de YouTube no es válido.");
  const pesados = [...campos.archivos.files].filter(a => a.type.startsWith("video/") && a.size > MAX_VIDEO_MB * 1024 * 1024);
  if (pesados.length) mensajes.push(`Los videos deben pesar menos de ${MAX_VIDEO_MB} MB (o usa un link de YouTube).`);
  erroresAdmin.innerHTML = mensajes.join("<br>");
  return mensajes.length === 0;
}

formMascota.addEventListener("submit", async e => {
  e.preventDefault();
  exitoAdmin.hidden = true;
  const campos = formMascota.elements;
  if (!validar(campos)) return;

  for (const archivo of campos.archivos.files) {
    galeria.push(archivo.type.startsWith("video/") ? await leerVideo(archivo) : await leerImagen(archivo));
  }
  if (campos.youtube.value) galeria.push({ tipo: "youtube", src: campos.youtube.value });

  const datos = {
    nombre: campos.nombre.value.trim(),
    tipo: campos.tipo.value,
    especie: campos.tipo.value.startsWith("Perr") ? "perro" : "gato",
    edad: campos.edad.value.trim(),
    caracteristicas: campos.caracteristicas.value.trim(),
    historia: campos.historia.value.trim(),
    encuadre: campos.encuadre.value,
    galeria
  };

  const nombre = datos.nombre;
  if (editandoId) {
    const i = mascotas.findIndex(m => m.id === editandoId);
    mascotas[i] = { ...mascotas[i], ...datos };
  } else {
    mascotas.push({ id: Math.max(0, ...mascotas.map(m => m.id)) + 1, ...datos });
  }

  if (!guardarDatos()) return;
  limpiarFormulario();
  mostrarLista();
  exitoAdmin.textContent = `Se guardó a ${nombre}. Ya aparece en la página de mascotas.`;
  exitoAdmin.hidden = false;
});

listaAdmin.addEventListener("click", e => {
  const editarId = Number(e.target.dataset.editar);
  const borrarId = Number(e.target.dataset.borrar);
  if (editarId) editar(editarId);
  if (borrarId) {
    const m = mascotas.find(m => m.id === borrarId);
    if (!confirm(`¿Quitar a ${m.nombre} de la página?`)) return;
    mascotas.splice(mascotas.indexOf(m), 1);
    guardarDatos();
    if (editandoId === borrarId) limpiarFormulario();
    mostrarLista();
  }
});

galeriaActual.addEventListener("click", e => {
  if (e.target.dataset.quitar === undefined) return;
  galeria.splice(Number(e.target.dataset.quitar), 1);
  mostrarGaleria();
});

formMascota.elements.archivos.addEventListener("change", actualizarVista);
formMascota.elements.encuadre.addEventListener("change", actualizarVista);

document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

document.getElementById("btnRestablecer").addEventListener("click", () => {
  if (!confirm("Se borrarán todos los cambios hechos en este navegador. ¿Continuar?")) return;
  localStorage.removeItem("mascotasAdmin");
  location.reload();
});

mostrarLista();
