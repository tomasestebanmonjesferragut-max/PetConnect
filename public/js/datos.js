// Datos de las mascotas del caso.
// Las rutas de imagen son relativas a las páginas en public/html.
// galeria acepta { tipo: "imagen" | "video" | "youtube", src }
// encuadre: qué parte de la foto se ve en tarjetas y carrusel ("x% y%" apunta al animal)
// salud: historial médico del caso; pendientes es lo que le falta (vacunas, esterilización)
const mascotasBase = [
  {
    id: 1, nombre: "Luna", especie: "perro", tipo: "Perra", edad: "2 años", encuadre: "40% 42%",
    caracteristicas: "Sociable y cariñosa",
    historia: "Hola, soy Luna. Me encanta estar cerca de las personas, recibir cariño y saludar a todos los que conozco. Busco una familia que quiera compartir paseos, juegos y muchos abrazos.",
    galeria: [{ tipo: "imagen", src: "../img/fotos/luna.jpeg" }],
    salud: {
      peso: "17 kg", esterilizacion: "Sí", microchip: "Sí",
      desparasitacion: "15/09/2026", ultimoControl: "10/10/2026",
      vacunas: [
        { nombre: "Séxtuple canina", fecha: "12/03/2026", alDia: true },
        { nombre: "Antirrábica", fecha: "12/03/2026", alDia: true }
      ],
      pendientes: [],
      observaciones: ["Sana y con buen peso. Sin enfermedades conocidas."]
    }
  },
  {
    id: 2, nombre: "Milo", especie: "gato", tipo: "Gato", edad: "1 año", encuadre: "40% 55%",
    caracteristicas: "Adaptado a vida de interior",
    historia: "Hola, soy Milo. Soy feliz dentro de casa: una ventana con sol y una manta me bastan. Si vives en departamento, puedo ser tu compañero ideal.",
    galeria: [{ tipo: "imagen", src: "../img/fotos/milo.jpeg" }],
    salud: {
      peso: "4,2 kg", esterilizacion: "Pendiente", microchip: "Sí",
      desparasitacion: "20/09/2026", ultimoControl: "05/10/2026",
      vacunas: [
        { nombre: "Triple felina", fecha: "05/06/2026", alDia: true },
        { nombre: "Antirrábica", fecha: "05/06/2026", alDia: true }
      ],
      pendientes: ["Esterilización (agendada para el 20/11/2026)"],
      observaciones: ["Sano. Acostumbrado a vivir dentro de casa."]
    }
  },
  {
    id: 3, nombre: "Simba", especie: "perro", tipo: "Perro", edad: "4 años", encuadre: "45% 80%",
    caracteristicas: "Tranquilo y obediente",
    historia: "Hola, soy Simba. Ya pasé la etapa de las travesuras: soy tranquilo, aprendo rápido y camino a tu lado sin tirar la correa. Solo me falta un hogar donde descansar.",
    galeria: [{ tipo: "imagen", src: "../img/fotos/simba.jpeg" }],
    salud: {
      peso: "28 kg", esterilizacion: "Sí", microchip: "Sí",
      desparasitacion: "01/09/2026", ultimoControl: "18/10/2026",
      vacunas: [
        { nombre: "Séxtuple canina", fecha: "20/01/2026", alDia: true },
        { nombre: "Antirrábica", fecha: "Venció el 20/10/2026", alDia: false }
      ],
      pendientes: ["Refuerzo de vacuna antirrábica (venció el 20/10/2026)"],
      observaciones: ["Leve sarro dental: se recomienda limpieza en el próximo control."]
    }
  },
  {
    id: 4, nombre: "Nina", especie: "gato", tipo: "Gata", edad: "3 años", encuadre: "50% 40%",
    caracteristicas: "Esterilizada y sociable",
    historia: "Hola, soy Nina. Ya estoy esterilizada y me llevo bien con todos. Me gusta acompañarte en silencio y ronronear cuando me haces cariño.",
    galeria: [{ tipo: "imagen", src: "../img/fotos/nina.jpeg" }],
    salud: {
      peso: "3,8 kg", esterilizacion: "Sí", microchip: "Sí",
      desparasitacion: "01/10/2026", ultimoControl: "14/10/2026",
      vacunas: [
        { nombre: "Triple felina", fecha: "14/04/2026", alDia: true },
        { nombre: "Antirrábica", fecha: "14/04/2026", alDia: true }
      ],
      pendientes: [],
      observaciones: ["Sana. Se lleva bien con otros gatos."]
    }
  },
  {
    id: 5, nombre: "Rocky", especie: "perro", tipo: "Perro", edad: "8 meses", encuadre: "70% 55%",
    caracteristicas: "Activo y juguetón",
    historia: "Hola, soy Rocky. Tengo energía para regalar: corro, juego y pido la pelota una y otra vez. Busco una familia activa que me enseñe y me acompañe a crecer.",
    galeria: [{ tipo: "imagen", src: "../img/fotos/rocky.jpeg" }],
    salud: {
      peso: "11 kg", esterilizacion: "Pendiente", microchip: "Sí",
      desparasitacion: "10/10/2026", ultimoControl: "10/10/2026",
      vacunas: [
        { nombre: "Séxtuple canina (1ª y 2ª dosis)", fecha: "31/05/2026", alDia: true },
        { nombre: "Refuerzo séxtuple canina", fecha: "Pendiente", alDia: false },
        { nombre: "Antirrábica", fecha: "Pendiente", alDia: false }
      ],
      pendientes: ["Refuerzo de séxtuple canina", "Primera dosis de antirrábica", "Esterilización (se realiza antes de la entrega)"],
      observaciones: ["Cachorro sano y con mucha energía."]
    }
  },
  {
    id: 6, nombre: "Canela", especie: "gato", tipo: "Gata", edad: "5 meses", encuadre: "45% 60%",
    caracteristicas: "Juguetona y curiosa",
    historia: "Hola, soy Canela. Todo me da curiosidad: las cajas, los cordones y lo que hay detrás de cada puerta. Quiero una familia con paciencia para mis travesuras de cachorra.",
    galeria: [{ tipo: "imagen", src: "../img/fotos/canela.jpeg" }],
    salud: {
      peso: "1,9 kg", esterilizacion: "Pendiente", microchip: "Pendiente",
      desparasitacion: "02/10/2026", ultimoControl: "02/10/2026",
      vacunas: [
        { nombre: "Triple felina (1ª dosis)", fecha: "02/09/2026", alDia: true },
        { nombre: "Triple felina (2ª dosis)", fecha: "Programada para el 30/10/2026", alDia: false },
        { nombre: "Antirrábica", fecha: "Pendiente", alDia: false }
      ],
      pendientes: ["Segunda dosis de triple felina (30/10/2026)", "Antirrábica (a partir de los 6 meses)", "Esterilización y microchip (a partir de los 6 meses)"],
      observaciones: ["Cachorra sana, en etapa de vacunación."]
    }
  }
];

// Si el administrador hizo cambios en este navegador se usan esos datos
const guardadas = leerJSON("mascotasAdmin", null);
const limpias = Array.isArray(guardadas) ? guardadas.map(limpiarMascota).filter(Boolean) : [];
const mascotas = limpias.length ? limpias : mascotasBase;

// Familias que ya adoptaron (testimonios del caso, sin fotos de personas)
const familias = [
  { familia: "Familia Rojas", mascota: "Toby", especie: "perro", texto: "Llegó asustado y hoy duerme a los pies de nuestro hijo. Es uno más de la familia." },
  { familia: "Camila y Andrés", mascota: "Mora", especie: "gato", texto: "Pensamos que adoptar sería difícil, pero el equipo nos acompañó en cada paso." },
  { familia: "Familia Muñoz", mascota: "Bruno", especie: "perro", texto: "Bruno nos cambió la rutina: ahora salimos a caminar todos los días." },
  { familia: "Valentina", mascota: "Pelusa", especie: "gato", texto: "Vivo sola y Pelusa me recibe cada tarde en la puerta. No me imagino la casa sin ella." }
];

// Fotos de mascotas que ya encontraron familia (galería, sin nombre)
const fotosAdoptados = [
  { src: "../img/fotos/adoptado9.jpg" },
  { src: "../img/fotos/adoptado10.jpg" },
  { src: "../img/fotos/adoptado11.jpg" },
  { src: "../img/fotos/adoptado12.jpg" },
  { src: "../img/fotos/adoptado1.jpeg" },
  { src: "../img/fotos/adoptado2.jpeg" },
  { src: "../img/fotos/adoptado3.jpeg" },
  { src: "../img/fotos/adoptado4.webp" },
  { src: "../img/fotos/adoptado5.jpg" },
  { src: "../img/fotos/adoptado6.jpg" },
  { src: "../img/fotos/adoptado7.jpg" }
];
