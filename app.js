// Las mascotas vienen de mascotas.js
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let soloFavoritos = false;

const listado = document.getElementById("listado");
const buscar = document.getElementById("buscar");
const filtroEspecie = document.getElementById("filtroEspecie");
const filtroEdad = document.getElementById("filtroEdad");
const resultado = document.getElementById("resultado");
const modal = document.getElementById("modal");
const modalContenido = document.getElementById("modalContenido");
const form = document.getElementById("formContacto");
const selectMascota = document.getElementById("selectMascota");
const errores = document.getElementById("errores");
const exito = document.getElementById("exito");

// Si la imagen no existe se queda la huella
function foto(m, clase) {
  return `<div class="${clase}">🐾<img src="${m.imagen}" alt="Foto de ${m.nombre}" onerror="this.remove()"></div>`;
}

function rangoEdad(meses) {
  if (meses < 12) return "cachorro";
  if (meses < 48) return "joven";
  return "adulto";
}

function mostrarMascotas() {
  const texto = buscar.value.trim().toLowerCase();

  const filtradas = mascotas.filter(m =>
    m.nombre.toLowerCase().includes(texto) &&
    (filtroEspecie.value === "" || m.especie === filtroEspecie.value) &&
    (filtroEdad.value === "" || rangoEdad(m.edadMeses) === filtroEdad.value) &&
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
        <span class="etiqueta">${m.tipo}</span>
        <span class="etiqueta">${m.edad}</span>
        <p>${m.caracteristicas}</p>
        <div class="tarjeta__acciones">
          <button class="btn" data-ver="${m.id}">Ver más</button>
          <button class="fav" data-fav="${m.id}" aria-label="Marcar a ${m.nombre} como de interés">${favoritos.includes(m.id) ? "❤️" : "🤍"}</button>
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
  const m = mascotas.find(m => m.id === id);
  modalContenido.innerHTML = `
    ${foto(m, "modal__foto")}
    <h2>${m.nombre}</h2>
    <p><strong>Especie:</strong> ${m.tipo} · <strong>Edad:</strong> ${m.edad}</p>
    <p><strong>Características:</strong> ${m.caracteristicas}</p>
    <button class="btn" data-contactar="${m.id}">Me interesa adoptar</button>
  `;
  modal.showModal();
}

// Cierra la ficha y lleva al formulario con la mascota elegida
function contactarPor(id) {
  modal.close();
  selectMascota.value = id;
  document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
}

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

  errores.innerHTML = mensajes.join("<br>");
  return mensajes.length === 0;
}

// Eventos
buscar.addEventListener("input", mostrarMascotas);
filtroEspecie.addEventListener("change", mostrarMascotas);
filtroEdad.addEventListener("change", mostrarMascotas);

listado.addEventListener("click", e => {
  const ver = e.target.dataset.ver;
  const fav = e.target.dataset.fav;
  if (ver) abrirFicha(Number(ver));
  if (fav) cambiarFavorito(Number(fav));
});

modalContenido.addEventListener("click", e => {
  if (e.target.dataset.contactar) contactarPor(e.target.dataset.contactar);
});

document.getElementById("btnFavoritos").addEventListener("click", e => {
  soloFavoritos = !soloFavoritos;
  e.currentTarget.classList.toggle("btn--borde", !soloFavoritos);
  mostrarMascotas();
});

document.getElementById("cerrarModal").addEventListener("click", () => modal.close());

// Menú móvil
const btnMenu = document.getElementById("btnMenu");
const nav = document.getElementById("nav");
btnMenu.addEventListener("click", () => {
  const abierto = nav.classList.toggle("nav--abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") nav.classList.remove("nav--abierto");
});

// El formulario es simulado: no se envía a ningún servidor
form.addEventListener("submit", e => {
  e.preventDefault();
  exito.hidden = true;
  if (!validarFormulario()) return;

  const nombre = form.elements.nombre.value.trim();
  const mascota = mascotas.find(m => m.id === Number(form.elements.mascota.value));
  exito.textContent = `¡Gracias ${nombre}! Recibimos tu interés por ${mascota.nombre}. Te contactaremos para coordinar una entrevista; la adopción no queda aprobada automáticamente.`;
  exito.hidden = false;
  form.reset();
});

// Inicio
selectMascota.innerHTML += mascotas.map(m => `<option value="${m.id}">${m.nombre} (${m.tipo})</option>`).join("");
document.getElementById("contadorFav").textContent = favoritos.length;
mostrarMascotas();
