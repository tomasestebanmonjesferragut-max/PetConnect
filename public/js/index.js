// Inicio: mascotas destacadas, familias que adoptaron y ventana de novedades
const destacadas = document.getElementById("destacadas");
const listaFamilias = document.getElementById("familias");
const novedades = document.getElementById("novedades");

destacadas.innerHTML = mascotas.slice(0, 3).map(tarjeta).join("");

// En el inicio los botones de la tarjeta abren la ficha en la página de mascotas
destacadas.addEventListener("click", e => {
  const id = e.target.dataset.ver || e.target.dataset.fav;
  if (id) location.href = `mascotas.html?ver=${id}`;
});

listaFamilias.innerHTML = familias.map(f => `
  <article class="familia">
    <span class="familia__icono">${f.especie === "gato" ? "🐱" : "🐶"}</span>
    <blockquote>“${f.texto}”</blockquote>
    <p class="familia__nombre">${f.familia} <span>adoptó a ${f.mascota}</span></p>
  </article>
`).join("");

// Las novedades se muestran una vez por visita (sessionStorage)
document.getElementById("novedadesLista").innerHTML = mascotas.slice(-2).map(m => `
  <li>${foto(m, "novedad__foto")}<span><strong>${m.nombre}</strong> llegó y busca familia. ${m.caracteristicas}.</span></li>
`).join("");

if (!sessionStorage.getItem("novedadesVistas")) {
  novedades.showModal();
  sessionStorage.setItem("novedadesVistas", "si");
}
document.getElementById("cerrarNovedades").addEventListener("click", () => novedades.close());
