// Pruebas de PetConnect: abre cada página en un iframe y la usa como una persona.
const RUTA = "../public/html/";
const PAGINAS = ["index", "mascotas", "galeria", "proceso", "preguntas", "contacto"];
const CLAVES = ["favoritos", "filtrosMascotas", "borradorContacto", "filtroGaleria", "pasosRevisados", "mascotasAdmin"];
const ANCHOS = { pc: 1280, movil: 375 };

const MASCOTAS_DEL_CASO = [
  ["Luna", "Perra", "2 años", "Sociable y cariñosa"],
  ["Milo", "Gato", "1 año", "Adaptado a vida de interior"],
  ["Simba", "Perro", "4 años", "Tranquilo y obediente"],
  ["Nina", "Gata", "3 años", "Esterilizada y sociable"],
  ["Rocky", "Perro", "8 meses", "Activo y juguetón"],
  ["Canela", "Gata", "5 meses", "Juguetona y curiosa"]
];

// ---------- Herramientas ----------
const esperar = ms => new Promise(r => setTimeout(r, ms));

function comprobar(condicion, mensaje) {
  if (!condicion) throw new Error(mensaje);
}

// Abre una página en un iframe del ancho indicado y espera a que dibuje
async function abrir(pagina, ancho, espera = 500) {
  const marco = document.createElement("iframe");
  marco.style.cssText = `position:fixed;left:-5000px;top:0;width:${ancho}px;max-width:none;height:800px;border:0`;
  marco.src = pagina.includes("/") ? pagina : RUTA + pagina + ".html";
  document.body.append(marco);
  await new Promise(r => marco.addEventListener("load", r, { once: true }));
  await esperar(espera);
  return { w: marco.contentWindow, d: marco.contentDocument, marco, cerrar: () => marco.remove() };
}

async function recargar(p, espera = 500) {
  const carga = new Promise(r => p.marco.addEventListener("load", r, { once: true }));
  p.w.location.reload();
  await carga;
  await esperar(espera);
  p.w = p.marco.contentWindow;
  p.d = p.marco.contentDocument;
}

function escribir(campo, valor, evento = "input") {
  campo.value = valor;
  campo.dispatchEvent(new Event(evento, { bubbles: true }));
}

const nombres = d => [...d.querySelectorAll(".tarjeta h3")].map(h => h.textContent).join(",");

function limpiarDatos() {
  CLAVES.forEach(c => localStorage.removeItem(c));
  sessionStorage.setItem("novedadesVistas", "si");
}

// ---------- Pruebas ----------
const pruebas = [
  { grupo: "A. Requisitos de las bases" },
  {
    nombre: "Menú con las secciones mínimas y cada link abre su página",
    async fn(ancho) {
      const p = await abrir("index", ancho);
      const links = [...p.d.querySelectorAll("#nav a")].map(a => a.getAttribute("href"));
      p.cerrar();
      for (const pagina of ["index", "mascotas", "proceso", "preguntas", "contacto"]) {
        comprobar(links.includes(pagina + ".html"), `Falta el link a ${pagina}.html`);
      }
      for (const href of links) {
        const r = await fetch(RUTA + href);
        comprobar(r.ok, `${href} responde ${r.status}`);
      }
    }
  },
  {
    nombre: "El menú marca la página actual",
    async fn(ancho) {
      for (const [pagina, texto] of [["mascotas", "Mascotas"], ["contacto", "Contacto"]]) {
        const p = await abrir(pagina, ancho);
        const activo = p.d.querySelector("#nav a.activo")?.textContent;
        p.cerrar();
        comprobar(activo === texto, `En ${pagina} el link activo es "${activo}"`);
      }
    }
  },
  {
    nombre: "Las 6 mascotas del caso con nombre, especie/edad y características",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      const tarjetas = [...p.d.querySelectorAll(".tarjeta")].map(t => t.textContent);
      p.cerrar();
      comprobar(tarjetas.length === 6, `Hay ${tarjetas.length} tarjetas`);
      for (const datos of MASCOTAS_DEL_CASO) {
        comprobar(tarjetas.some(t => datos.every(dato => t.includes(dato))), `Faltan datos de ${datos[0]}`);
      }
    }
  },
  {
    nombre: "Buscador por nombre filtra al escribir, sin recargar",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      const documento = p.d;
      escribir(p.d.getElementById("buscar"), "ro");
      const resultado = nombres(p.d);
      const mismaPagina = p.marco.contentDocument === documento;
      p.cerrar();
      comprobar(resultado === "Rocky", `Con "ro" muestra: ${resultado}`);
      comprobar(mismaPagina, "La página se recargó");
    }
  },
  {
    nombre: "Filtros por especie y por edad",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      escribir(p.d.getElementById("filtroEspecie"), "gato", "change");
      const gatos = nombres(p.d);
      escribir(p.d.getElementById("filtroEspecie"), "", "change");
      escribir(p.d.getElementById("filtroEdad"), "cachorro", "change");
      const cachorros = nombres(p.d);
      p.cerrar();
      comprobar(gatos === "Milo,Nina,Canela", `Gatos: ${gatos}`);
      comprobar(cachorros === "Rocky,Canela", `Cachorros: ${cachorros}`);
    }
  },
  {
    nombre: "Ficha de la mascota: datos, link a contacto y foto (derecha en PC, arriba en móvil)",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      p.d.querySelector('[data-ver="1"]').click();
      await esperar(200);
      const abierta = p.d.getElementById("modal").open;
      const titulo = p.d.querySelector(".ficha h2")?.textContent;
      const link = p.d.querySelector(".ficha a.btn")?.getAttribute("href");
      const foto = p.d.querySelector(".galeria").getBoundingClientRect();
      const texto = p.d.querySelector(".ficha").getBoundingClientRect();
      p.cerrar();
      comprobar(abierta && titulo === "Luna", "La ficha de Luna no se abrió");
      comprobar(link === "contacto.html?mascota=1", `Link: ${link}`);
      if (ancho >= 860) comprobar(foto.left > texto.left, "En PC la foto no está a la derecha");
      else comprobar(foto.top < texto.top, "En móvil la foto no está arriba");
    }
  },
  {
    nombre: "Formulario con nombre, correo, mascota de interés y mensaje",
    async fn(ancho) {
      const p = await abrir("contacto", ancho);
      const f = p.d.getElementById("formContacto");
      const campos = ["nombre", "correo", "mascota", "mensaje"].filter(c => !f.elements[c]);
      const opciones = f.elements.mascota.options.length;
      p.cerrar();
      comprobar(campos.length === 0, `Faltan campos: ${campos}`);
      comprobar(opciones === 7, `El select tiene ${opciones} opciones (esperado 6 + "Selecciona")`);
    }
  },
  {
    nombre: "El formulario no envía datos a un servidor y no promete aprobación",
    async fn(ancho) {
      const p = await abrir("contacto", ancho);
      let envios = 0;
      p.w.fetch = () => { envios++; return Promise.reject(); };
      p.w.XMLHttpRequest.prototype.send = () => { envios++; };
      p.w.navigator.sendBeacon = () => { envios++; return false; };
      const documento = p.d;
      const f = p.d.getElementById("formContacto");
      escribir(f.elements.nombre, "Ana Pérez");
      escribir(f.elements.correo, "ana@mail.cl");
      escribir(f.elements.mascota, "3");
      escribir(f.elements.mensaje, "Quiero conocer a Simba");
      f.elements.robot.checked = true;
      f.elements.robot.dispatchEvent(new Event("change", { bubbles: true }));
      f.querySelector('button[type="submit"]').click();
      await esperar(200);
      const exito = p.d.getElementById("exito").textContent;
      const mismaPagina = p.marco.contentDocument === documento;
      p.cerrar();
      comprobar(envios === 0, `Se intentaron ${envios} envíos`);
      comprobar(mismaPagina, "El formulario recargó la página");
      comprobar(exito.includes("no queda aprobada automáticamente"), "Falta el aviso de aprobación");
    }
  },
  {
    nombre: "Datos de contacto simulados en todas las páginas",
    async fn(ancho) {
      for (const pagina of PAGINAS) {
        const p = await abrir(pagina, ancho, 200);
        const texto = p.d.querySelector("footer").textContent;
        p.cerrar();
        for (const dato of ["adopciones@petconnect.cl", "@petconnect.cl", "+56 9 5555 3402"]) {
          comprobar(texto.includes(dato), `${pagina}: falta ${dato}`);
        }
      }
    }
  },
  {
    nombre: "Diseño responsivo: ninguna página se sale de la pantalla",
    async fn(ancho) {
      for (const pagina of PAGINAS) {
        const p = await abrir(pagina, ancho, 300);
        const sobra = p.d.documentElement.scrollWidth - p.d.documentElement.clientWidth;
        p.cerrar();
        comprobar(sobra <= 0, `${pagina} se sale ${sobra} px`);
      }
    }
  },

  { grupo: "B. Actualización en vivo" },
  {
    nombre: "Los filtros de mascotas se recuerdan al volver y se pueden limpiar",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      escribir(p.d.getElementById("filtroEspecie"), "perro", "change");
      await recargar(p);
      const recordado = p.d.getElementById("filtroEspecie").value;
      const boton = p.d.getElementById("btnLimpiar");
      const visible = !boton.hidden;
      boton.click();
      const total = p.d.querySelectorAll(".tarjeta").length;
      p.cerrar();
      comprobar(recordado === "perro", `Tras recargar el filtro es "${recordado}"`);
      comprobar(visible && total === 6, "Limpiar filtros no funcionó");
    }
  },
  {
    nombre: "Favoritos se actualizan desde otra pestaña sin recargar",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      localStorage.setItem("favoritos", "[3]");
      await esperar(300);
      const contador = p.d.getElementById("contadorFav").textContent;
      const corazon = p.d.querySelector('[data-fav="3"]').textContent;
      p.cerrar();
      comprobar(contador === "1" && corazon === "❤️", `Contador ${contador}, corazón ${corazon}`);
    }
  },
  {
    nombre: "Contacto valida en vivo, cuenta caracteres y activa Enviar solo si todo está bien",
    async fn(ancho) {
      const p = await abrir("contacto", ancho);
      const f = p.d.getElementById("formContacto");
      const boton = f.querySelector('button[type="submit"]');
      const error = nombre => f.elements[nombre].closest("label").querySelector(".campo__error").textContent;
      const sinRojoAlEntrar = !f.querySelector(".invalido") && boton.disabled;
      escribir(f.elements.correo, "ana@");
      const errorCorreo = error("correo");
      escribir(f.elements.correo, "ana@mail.cl");
      const corregido = error("correo") === "";
      escribir(f.elements.mensaje, "Hola");
      const contador = f.querySelector(".campo__contador").textContent;
      escribir(f.elements.nombre, "Ana Pérez");
      escribir(f.elements.mascota, "2");
      const vista = f.querySelector(".vista-mascota").textContent;
      escribir(f.elements.mensaje, "Quiero conocer a Milo");
      const aunDesactivado = boton.disabled;
      f.elements.robot.checked = true;
      f.elements.robot.dispatchEvent(new Event("change", { bubbles: true }));
      const activado = !boton.disabled;
      p.cerrar();
      comprobar(sinRojoAlEntrar, "Al entrar ya hay errores o el botón está activo");
      comprobar(errorCorreo !== "" && corregido, "El error del correo no aparece o no se va");
      comprobar(contador.startsWith("4 / 10"), `Contador: ${contador}`);
      comprobar(vista.includes("Milo"), "No aparece la vista de la mascota elegida");
      comprobar(aunDesactivado && activado, "El botón Enviar no responde al check");
    }
  },
  {
    nombre: "Contacto: el borrador sobrevive a una recarga y se borra al enviar",
    async fn(ancho) {
      const p = await abrir("contacto", ancho);
      let f = p.d.getElementById("formContacto");
      escribir(f.elements.nombre, "Ana Pérez");
      escribir(f.elements.mensaje, "Quiero adoptar");
      await recargar(p);
      f = p.d.getElementById("formContacto");
      const recuperado = f.elements.nombre.value === "Ana Pérez" && f.elements.mensaje.value === "Quiero adoptar";
      escribir(f.elements.correo, "ana@mail.cl");
      escribir(f.elements.mascota, "1");
      f.elements.robot.checked = true;
      f.elements.robot.dispatchEvent(new Event("change", { bubbles: true }));
      f.querySelector('button[type="submit"]').click();
      await esperar(100);
      const borrado = localStorage.getItem("borradorContacto") === null;
      p.cerrar();
      comprobar(recuperado, "El borrador no se recuperó");
      comprobar(borrado, "El borrador sigue guardado después de enviar");
    }
  },
  {
    nombre: "Galería: buscador y botones filtran en vivo; el filtro se recuerda",
    async fn(ancho) {
      const p = await abrir("galeria", ancho);
      const total = () => p.d.getElementById("totalFotos").textContent;
      const todas = total();
      escribir(p.d.getElementById("buscarFoto"), "toby");
      const toby = total();
      escribir(p.d.getElementById("buscarFoto"), "");
      p.d.querySelector('[data-filtro="adopcion"]').click();
      const enAdopcion = total();
      await recargar(p);
      const recordado = total();
      p.cerrar();
      comprobar(todas === "18 foto(s)", `Todas: ${todas}`);
      comprobar(toby === "1 foto(s)", `Buscar toby: ${toby}`);
      comprobar(enAdopcion === "6 foto(s)" && recordado === "6 foto(s)", `En adopción: ${enAdopcion}, tras recargar: ${recordado}`);
    }
  },
  {
    nombre: "Proceso: la barra avanza y los pasos se recuerdan",
    async fn(ancho) {
      const p = await abrir("proceso", ancho);
      const pasos = () => p.d.querySelectorAll(".pasos li");
      pasos()[0].click();
      pasos()[1].click();
      const barra = p.d.getElementById("barraProgreso").style.width;
      await recargar(p);
      const texto = p.d.getElementById("avance").textContent;
      p.cerrar();
      comprobar(barra === "40%", `Barra: ${barra}`);
      comprobar(texto === "Pasos revisados: 2 de 5", `Tras recargar: ${texto}`);
    }
  },
  {
    nombre: "Preguntas: buscador sin tildes y aviso cuando no hay resultados",
    async fn(ancho) {
      const p = await abrir("preguntas", ancho);
      const buscador = p.d.getElementById("buscarPregunta");
      const visibles = () => [...p.d.querySelectorAll(".faq details")].filter(d => !d.hidden).length;
      escribir(buscador, "adopcion");
      const conAdopcion = visibles();
      escribir(buscador, "dinosaurio");
      const ninguna = visibles();
      const aviso = !p.d.getElementById("sinPreguntas").hidden;
      p.cerrar();
      comprobar(conAdopcion > 0, "\"adopcion\" no encuentra \"adopción\"");
      comprobar(ninguna === 0 && aviso, "No aparece el aviso sin resultados");
    }
  },

  { grupo: "C. Seguridad" },
  {
    nombre: "Datos maliciosos guardados no se ejecutan",
    async fn(ancho) {
      const ataque = '<img src=x onerror="window.top.hackeado=true">';
      window.hackeado = false;
      localStorage.setItem("mascotasAdmin", JSON.stringify([{ id: 1, nombre: ataque, especie: "perro", tipo: ataque, edad: "2 años", caracteristicas: ataque, historia: ataque, galeria: [{ tipo: "imagen", src: 'x" onerror="window.top.hackeado=true' }] }]));
      localStorage.setItem("borradorContacto", JSON.stringify({ nombre: ataque, mensaje: ataque }));
      localStorage.setItem("favoritos", JSON.stringify([ataque]));
      for (const pagina of PAGINAS) {
        const p = await abrir(pagina, ancho, 300);
        p.cerrar();
      }
      comprobar(window.hackeado === false, "Se ejecutó código inyectado");
    }
  },
  {
    nombre: "localStorage dañado no rompe ninguna página",
    async fn(ancho) {
      CLAVES.forEach(c => localStorage.setItem(c, "{roto"));
      for (const pagina of PAGINAS) {
        const p = await abrir(pagina, ancho, 300);
        const contenido = p.d.querySelectorAll(".tarjeta, .diapositiva, .foto-galeria, .pasos li, .faq details, #selectMascota option").length;
        p.cerrar();
        comprobar(contenido > 0, `${pagina} quedó vacía`);
      }
    }
  },

  { grupo: "D. Visual y navegación" },
  {
    nombre: "Todas las imágenes cargan",
    async fn(ancho) {
      for (const pagina of PAGINAS) {
        const p = await abrir(pagina, ancho, 1500);
        const rotas = [...p.d.querySelectorAll("img[src]")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src"));
        const portada = pagina === "index" ? await fetch("../public/img/imagenes/portada.webp") : { ok: true };
        p.cerrar();
        comprobar(rotas.length === 0, `${pagina}: ${rotas.join(", ")}`);
        comprobar(portada.ok, "No carga la portada");
      }
    }
  },
  {
    nombre: "Menú: ☰ abre el menú en móvil; en PC los links se ven directo",
    async fn(ancho) {
      const p = await abrir("mascotas", ancho);
      const boton = p.d.getElementById("btnMenu");
      const nav = p.d.getElementById("nav");
      const estilo = el => p.w.getComputedStyle(el).display;
      if (ancho >= 1000) {
        const ok = estilo(boton) === "none" && estilo(nav) !== "none";
        p.cerrar();
        comprobar(ok, "En PC el menú no se ve completo");
      } else {
        const cerrado = estilo(nav) === "none";
        boton.click();
        const abierto = estilo(nav) !== "none";
        p.cerrar();
        comprobar(cerrado && abierto, "El botón ☰ no abre el menú");
      }
    }
  },
  {
    nombre: "Carrusel del inicio: flechas y puntos cambian de mascota",
    async fn(ancho) {
      const p = await abrir("index", ancho);
      const pista = p.d.getElementById("pista");
      p.d.getElementById("siguiente").click();
      const siguiente = pista.style.transform;
      p.d.querySelector('[data-ir="4"]').click();
      const punto = pista.style.transform;
      p.cerrar();
      comprobar(siguiente === "translateX(-100%)", `Flecha: ${siguiente}`);
      comprobar(punto === "translateX(-400%)", `Punto: ${punto}`);
    }
  },
  {
    nombre: "La raíz del repo (GitHub Pages) lleva al inicio",
    async fn(ancho) {
      const p = await abrir("../index.html", ancho, 800);
      const destino = p.marco.contentWindow.location.pathname;
      p.cerrar();
      comprobar(destino.endsWith("/public/html/index.html"), `Llegó a ${destino}`);
    }
  }
];

// ---------- Ejecución ----------
const tabla = document.getElementById("resultados");
const resumen = document.getElementById("resumen");
const boton = document.getElementById("ejecutar");

function celda(texto, clase = "") {
  const td = document.createElement("td");
  td.className = clase;
  td.textContent = texto;
  return td;
}

boton.addEventListener("click", async () => {
  boton.disabled = true;
  tabla.innerHTML = "";
  const respaldo = Object.fromEntries(CLAVES.map(c => [c, localStorage.getItem(c)]));
  const respaldoSesion = sessionStorage.getItem("novedadesVistas");
  let pasadas = 0;
  let fallidas = 0;

  for (const prueba of pruebas) {
    const fila = document.createElement("tr");
    tabla.append(fila);
    if (prueba.grupo) {
      fila.className = "grupo";
      const td = celda(prueba.grupo);
      td.colSpan = 3;
      fila.append(td);
      continue;
    }
    fila.append(celda(prueba.nombre));
    for (const ancho of Object.values(ANCHOS)) {
      const td = celda("⏳ probando...");
      fila.append(td);
      limpiarDatos();
      try {
        await prueba.fn(ancho);
        td.textContent = "✅ Cumple";
        td.className = "ok";
        pasadas++;
      } catch (e) {
        td.textContent = "❌ Falla";
        td.className = "falla";
        const detalle = document.createElement("small");
        detalle.textContent = e.message;
        td.append(detalle);
        fallidas++;
      }
      resumen.textContent = `${pasadas} cumplen · ${fallidas} fallan`;
    }
  }

  // Devuelve los datos del navegador a como estaban
  CLAVES.forEach(c => respaldo[c] === null ? localStorage.removeItem(c) : localStorage.setItem(c, respaldo[c]));
  if (respaldoSesion === null) sessionStorage.removeItem("novedadesVistas");
  resumen.textContent = `Terminado: ${pasadas} cumplen · ${fallidas} fallan`;
  boton.disabled = false;
});
