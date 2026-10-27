let mascotas = []; // Se inicializa vacío, se llenará con el JSON
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let soloFavoritos = false;
let mascotaActual = null;

const listado = document.getElementById("listado");
const buscar = document.getElementById("buscar");
const filtroEspecie = document.getElementById("filtroEspecie");
const filtroTamano = document.getElementById("filtroTamano");
const resultado = document.getElementById("resultado");
const modal = document.getElementById("modal");
const modalContenido = document.getElementById("modalContenido");
const form = document.getElementById("formAdopcion");
const errores = document.getElementById("errores");

// Si la imagen no existe se queda el emoji
function foto(m, clase) {
  return `<div class="${clase}">${m.foto}<img src="${m.imagen}" alt="${m.nombre}" onerror="this.remove()"></div>`;
}

function mostrarMascotas() {
  const texto = buscar.value.trim().toLowerCase();

  const filtradas = mascotas.filter(m =>
    m.nombre.toLowerCase().includes(texto) &&
    (filtroEspecie.value === "" || m.especie === filtroEspecie.value) &&
    (filtroTamano.value === "" || m.tamano === filtroTamano.value) &&
    (!soloFavoritos || favoritos.includes(m.id))
  );

  resultado.textContent = filtradas.length === 0
    ? "No hay mascotas con esos filtros."
    : `${filtradas.length} mascota(s) encontrada(s)`;

  listado.innerHTML = filtradas.map(m => `
    <article class="tarjeta">
      ${foto(m, "tarjeta__foto")}
      <div class="tarjeta__info">
        <h3>${m.nombre}</h3>
        <span class="etiqueta">${m.edad}</span>
        <span class="etiqueta">${m.tamano}</span>
        <p>${m.descripcion}</p>
        <div class="tarjeta__acciones">
          <button class="btn" data-ver="${m.id}">Adoptar</button>
          <button class="fav" data-fav="${m.id}" aria-label="Favorito">${favoritos.includes(m.id) ? "❤️" : "🤍"}</button>
        </div>
      </div>
    </article>
  `).join("");
}

function cambiarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  document.getElementById("contadorFav").textContent = favoritos.length;
  mostrarMascotas();
}

function abrirFicha(id) {
  mascotaActual = mascotas.find(m => m.id === id);
  modalContenido.innerHTML = `
    ${foto(mascotaActual, "modal__foto")}
    <h2>${mascotaActual.nombre}</h2>
    <p>${mascotaActual.descripcion}</p>
    <p><strong>Edad:</strong> ${mascotaActual.edad} · <strong>Tamaño:</strong> ${mascotaActual.tamano}</p>
    <p><strong>Vacunas:</strong> ${mascotaActual.vacunada ? "Al día ✅" : "Pendientes ⏳"}</p>
  `;
  form.reset();
  form.hidden = false;
  errores.textContent = "";
  form.querySelectorAll(".invalido").forEach(c => c.classList.remove("invalido"));
  modal.showModal();
}

function validarFormulario() {
  const mensajes = [];
  const campos = form.elements;

  form.querySelectorAll(".invalido").forEach(c => c.classList.remove("invalido"));

  if (campos.nombre.value.trim().length < 3) {
    mensajes.push("Ingresa tu nombre completo.");
    campos.nombre.classList.add("invalido");
  }
  if (!/^\S+@\S+\.\S+$/.test(campos.correo.value)) {
    mensajes.push("El correo no es válido.");
    campos.correo.classList.add("invalido");
  }
  if (!/^\+?\d{8,12}$/.test(campos.telefono.value.replace(/\s/g, ""))) {
    mensajes.push("El teléfono debe tener entre 8 y 12 dígitos.");
    campos.telefono.classList.add("invalido");
  }
  if (campos.vivienda.value === "") {
    mensajes.push("Selecciona tu tipo de vivienda.");
    campos.vivienda.classList.add("invalido");
  }
  if (!campos.compromiso.checked) {
    mensajes.push("Debes aceptar el compromiso de adopción.");
  }

  errores.innerHTML = mensajes.join("<br>");
  return mensajes.length === 0;
}

// Eventos
buscar.addEventListener("input", mostrarMascotas);
filtroEspecie.addEventListener("change", mostrarMascotas);
filtroTamano.addEventListener("change", mostrarMascotas);

listado.addEventListener("click", e => {
  const ver = e.target.dataset.ver;
  const fav = e.target.dataset.fav;
  if (ver) abrirFicha(Number(ver));
  if (fav) cambiarFavorito(Number(fav));
});

document.getElementById("btnFavoritos").addEventListener("click", e => {
  soloFavoritos = !soloFavoritos;
  e.currentTarget.classList.toggle("btn--borde", !soloFavoritos);
  mostrarMascotas();
});

document.getElementById("cerrarModal").addEventListener("click", () => modal.close());

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const nombre = form.elements.nombre.value.trim();
  form.hidden = true;
  modalContenido.innerHTML += `<p class="exito">¡Gracias ${nombre}! Recibimos tu solicitud para adoptar a ${mascotaActual.nombre}. Te contactaremos pronto.</p>`;
});

// Carga del JSON y renderizado inicial
fetch('mascotas.json')
  .then(respuesta => respuesta.json())
  .then(datos => {
    mascotas = datos; // Asigna los datos del JSON a la variable
    document.getElementById("contadorFav").textContent = favoritos.length;
    mostrarMascotas(); // Muestra las mascotas una vez cargadas
  })
  .catch(error => console.error("Error al cargar las mascotas:", error));