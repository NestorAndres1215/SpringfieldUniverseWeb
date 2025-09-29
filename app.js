// ==================== FUNCION NAVEGACION ====================
function mostrarSeccion(nombre) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(sec => sec.style.display = 'none');
  const sec = document.getElementById(nombre);
  if (sec) sec.style.display = 'block';
}

// ==================== PERSONAJES ====================
 let todosPersonajes = [];
    let personajesFiltrados = [];
    let paginaActualPersonajes = 1;
    const personajesPorPagina = 12;
    const personajesUrl = "https://apisimpsons.fly.dev/api/personajes?limit=800";

    async function cargarPersonajes() {
      try {
        const res = await fetch(personajesUrl);
        const data = await res.json();
        todosPersonajes = data.docs;
        personajesFiltrados = todosPersonajes;
        inicializarFiltrosPersonajes();
        mostrarPaginaPersonajes();
      } catch (error) {
        console.error("Error cargando personajes:", error);
        document.getElementById('personajes-container').innerHTML = '<p class="text-center text-xl text-red-600">Error al cargar los personajes. Intenta de nuevo más tarde.</p>';
      }
    }

    function inicializarFiltrosPersonajes() {
      const buscarInput = document.getElementById('buscar-personaje');
      const filtroGenero = document.getElementById('filtro-genero');
      const filtroEstado = document.getElementById('filtro-estado');

      buscarInput.addEventListener('input', filtrarPersonajes);
      filtroGenero.addEventListener('change', filtrarPersonajes);
      filtroEstado.addEventListener('change', filtrarPersonajes);
    }

    function filtrarPersonajes() {
      const buscar = document.getElementById('buscar-personaje').value.toLowerCase();
      const genero = document.getElementById('filtro-genero').value;
      const estado = document.getElementById('filtro-estado').value;

      personajesFiltrados = todosPersonajes.filter(p => {
        const matchesNombre = p.Nombre.toLowerCase().includes(buscar);
        const matchesGenero = genero === 'todos' || p.Genero === genero;
        const matchesEstado = estado === 'todos' || p.Estado === estado;
        return matchesNombre && matchesGenero && matchesEstado;
      });

      paginaActualPersonajes = 1;
      mostrarPaginaPersonajes();
    }

    function mostrarPaginaPersonajes() {
      const contenedor = document.getElementById('personajes-container');
      contenedor.innerHTML = '';

      const inicio = (paginaActualPersonajes - 1) * personajesPorPagina;
      const fin = inicio + personajesPorPagina;
      const personajesPagina = personajesFiltrados.slice(inicio, fin);

      if (personajesPagina.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-xl text-gray-800">No se encontraron personajes.</p>';
        return;
      }

     personajesPagina.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white border-4 border-black rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform';
        card.innerHTML = `
          <img src="${p.Imagen || 'https://via.placeholder.com/200x300?text=Sin+Imagen'}" alt="${p.Nombre}" class="w-auto h-72 mx-auto rounded">
          <h3 class="text-lg md:text-xl font-semibold text-orange-600 mt-2">${p.Nombre}</h3>
        `;
        contenedor.appendChild(card);
      });

      const totalPaginas = Math.ceil(personajesFiltrados.length / personajesPorPagina);
      document.getElementById('pagina-actual-personajes').textContent = `Página ${paginaActualPersonajes} de ${totalPaginas}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
      cargarPersonajes();
      document.getElementById('btn-anterior-personajes').addEventListener('click', () => {
        if (paginaActualPersonajes > 1) { paginaActualPersonajes--; mostrarPaginaPersonajes(); }
      });
      document.getElementById('btn-siguiente-personajes').addEventListener('click', () => {
        const totalPaginas = Math.ceil(personajesFiltrados.length / personajesPorPagina);
        if (paginaActualPersonajes < totalPaginas) { paginaActualPersonajes++; mostrarPaginaPersonajes(); }
      });
    });

// ==================== EPISODIOS ====================
  let todosEpisodios = [];
    let episodiosFiltrados = [];
    let paginaActual = 1;
    const episodiosPorPagina = 20;

    async function cargarTodosEpisodios() {
      try {
        const res1 = await fetch('https://thesimpsonsapi.com/api/episodes?page=1');
        const data1 = await res1.json();
        const totalPaginas = data1.pages;

        todosEpisodios = [...data1.results];

        for (let page = 2; page <= totalPaginas; page++) {
          const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`);
          const data = await res.json();
          todosEpisodios = todosEpisodios.concat(data.results);
        }

        inicializarSelectorTemporadas();
        filtrarPorTemporada('todas');

      } catch (error) {
        console.error("Error cargando episodios:", error);
      }
    }

    function inicializarSelectorTemporadas() {
      const selector = document.getElementById('selector-temporada');
      const temporadas = [...new Set(todosEpisodios.map(e => e.season))].sort((a,b)=>a-b);

      temporadas.forEach(temp => {
        const option = document.createElement('option');
        option.value = temp;
        option.textContent = `Temporada ${temp}`;
        selector.appendChild(option);
      });

      selector.addEventListener('change', (e) => filtrarPorTemporada(e.target.value));
    }

    function filtrarPorTemporada(temporada) {
      episodiosFiltrados = temporada === 'todas' ? todosEpisodios : todosEpisodios.filter(e => e.season == temporada);
      paginaActual = 1;
      mostrarPagina();
    }

    function mostrarPagina() {
      const contenedor = document.getElementById('episodios-container');
      contenedor.innerHTML = '';

      const inicio = (paginaActual - 1) * episodiosPorPagina;
      const fin = inicio + episodiosPorPagina;
      const episodiosPagina = episodiosFiltrados.slice(inicio, fin);

      episodiosPagina.forEach(e => {
        const card = document.createElement('div');
        card.className = 'bg-white border-4 border-black rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform';
        card.innerHTML = `
          <h3 class="text-xl md:text-2xl font-bold text-orange-600 mb-2">Temporada ${e.season} - ${e.name}</h3>
          <p class="text-lg text-gray-800">Episodio ${e.episode_number} | Fecha: ${e.airdate}</p>
          <p class="text-gray-700 mt-2">${e.synopsis}</p>
        `;
        contenedor.appendChild(card);
      });

      const totalPaginas = Math.ceil(episodiosFiltrados.length / episodiosPorPagina);
      document.getElementById('pagina-actual').textContent = `Página ${paginaActual} de ${totalPaginas}`;
    }

    function mostrarSeccion(seccion) {
      document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
      document.getElementById(seccion).style.display = 'block';
      if (seccion === 'episodios' && todosEpisodios.length === 0) {
        cargarTodosEpisodios();
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('btn-anterior').addEventListener('click', () => {
        if (paginaActual > 1) { paginaActual--; mostrarPagina(); }
      });
      document.getElementById('btn-siguiente').addEventListener('click', () => {
        const totalPaginas = Math.ceil(episodiosFiltrados.length / episodiosPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; mostrarPagina(); }
      });
      mostrarSeccion('inicio'); // Mostrar sección inicial por defecto
    });

// ==================== LUGARES ====================
const lugares = [
  {"nombre":"Planta Nuclear","descripcion":"Lugar de trabajo de Homero Simpson.","image":"https://www.energy.gov/sites/default/files/styles/full_article_width/public/2018/03/f49/Elektrownia_J%C4%85drowa_w_Springfield_0.png?itok=4vxy9ZAl"},
  {"nombre":"Taberna de Moe","descripcion":"El bar donde Homero suele beber cerveza.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP0JYoupBv8JX-hAd7seoGt0WswzBgPqCWOg&s"},
  {"nombre":"Casa de los Simpson","descripcion":"Hogar de la familia Simpson.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-UAdDgeHM-AKD1S162QYqS-x2R9hSVI_sj3CWwEDe5F3WQF8rTmF7Pe9ekpsmf5ndGE8&usqp=CAU"},
  {"nombre":"Escuela Primaria de Springfield","descripcion":"Donde estudian Bart y Lisa Simpson.","image":"https://i.pinimg.com/564x/23/c2/12/23c212b732660010a132e0a539dbe549.jpg"},
  {"nombre":"Kwik-E-Mart","descripcion":"Tienda de conveniencia de Apu Nahasapeemapetilon.","image":"https://preview.redd.it/1hslyq0kznt51.png?width=640&crop=smart&auto=webp&s=4c6e3b02f52aeac2fef54bf794d9347dde9442f6"},
   {"nombre":"Ayuntamiento de Springfield","descripcion":"Edificio gubernamental de la ciudad.","image":"https://static.simpsonswiki.com/images/thumb/b/b6/Springfield_Town_Hall.png/250px-Springfield_Town_Hall.png"},
  {"nombre":"Hospital de Springfield","descripcion":"Lugar donde se atiende la salud de los ciudadanos.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Joaeoh3-_WpnZCd2BudWi0UXNjDNOj1tvw&s"},
  {"nombre":"Bolera de Springfield","descripcion":"Bolera donde Homer y los amigos juegan.","image":"https://static.simpsonswiki.com/images/thumb/f/f1/Barney%27s_Bowlarama.png/250px-Barney%27s_Bowlarama.png"},
  {"nombre":"Estadio de los Isótopos de Springfield","descripcion":"Estadio de béisbol de Springfield.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK8xinzT_fiiDMYIxGfi3FKPz1TYXqxW5C8WAV5SUONurOyE7biz9sEyRvUNNamzUPYMk&usqp=CAU"},
  {"nombre":"Iglesia de Springfield","descripcion":"Iglesia de la ciudad donde el Reverendo Lovejoy predica.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4A4ldzAUyyMG4CYmIS23wWp2BXxnVzqP-tg&s"},
  {"nombre":"Universidad de Springfield","descripcion":"Institución educativa donde Lisa estudia algunas clases especiales.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU5vBZNFuPujIuafN0G0EsFy2LM7qCvma6VlDJNeA-_IX8fXFWcVFlkaKkJRAgQxfPdrw&usqp=CAU"},
    {"nombre":"Estación de Policía de Springfield","descripcion":"Donde trabaja el Jefe Wiggum y su equipo.","image":"https://static.simpsonswiki.com/images/thumb/b/b9/Springfield_Police_Station.png/300px-Springfield_Police_Station.png"},
  {"nombre":"Biblioteca de Springfield","descripcion":"Lugar de estudio y lectura para los ciudadanos.","image":"https://www.comunidadbaratz.com/wp-content/uploads/Venta-de-libros-de-la-biblioteca-como-reclamo.jpg"},
  {"nombre":"Plaza de Springfield","descripcion":"Parque central donde ocurren eventos públicos.","image":"https://external-preview.redd.it/BCPTac3VCBZUW4VDEBTSniNQg8uYPJAPmgzWZm5WsG0.jpg?auto=webp&s=9cf397b78ffa188580293f0589b9aac04d872ac2"},
  {"nombre":"Cementerio de Springfield","descripcion":"Lugar donde descansan los ciudadanos fallecidos.","image":"img/lugares/Springfield_Cemetery_1.webp"},
  {"nombre":"Museo de Springfield","descripcion":"Museo de historia y arte de Springfield.","image":"img/lugares/Springfield_natural_history_museum_scuse_me_while_i_miss.webp"},
  {"nombre":"Central de Autobuses de Springfield","descripcion":"Terminal de transporte público de la ciudad.","image":"https://static.simpsonswiki.com/images/thumb/5/51/Springfield_Central_Monorail_Station.png/250px-Springfield_Central_Monorail_Station.png"},
  {"nombre":"Casa del Abuelo Simpson","descripcion":"Hogar del Abuelo Simpson, en el asilo de ancianos.","image":"img/lugares/Retirement_Castle.webp"},
  {"nombre":"La Mansión de los Flanders","descripcion":"Hogar de la familia Flanders, vecinos de los Simpson.","image":"img/lugares/Flanders_house.webp"},,
  {"nombre":"Springfield Gorge","descripcion":"Acantilado donde Bart hizo el famoso salto en skate.","image":"img/lugares/Springfield_Gorge.webp"},
  {"nombre":"Playa de Springfield","descripcion":"Lugar de recreación y picnic para la familia Simpson.","image":"https://static.simpsonswiki.com/images/thumb/9/9c/Springfield_Beach.png/250px-Springfield_Beach.png"},
  {"nombre":"Estación de Tren de Springfield","descripcion":"Terminal ferroviaria de la ciudad.","image":"https://static.simpsonswiki.com/images/thumb/9/95/Springfield_train_station.png/250px-Springfield_train_station.png"},
  {"nombre":"Monorriel de Springfield","descripcion":"Sistema de transporte rápido inaugurado por Lyle Lanley.","image":"img/lugares/Archivo-Springfield_Monorail_1.webp"},
  {"nombre":"El Centro Comercial de Springfield","descripcion":"Lugar de compras y entretenimiento.","image":"img/lugares/Springfield_Mall_3.PNG.webp"},
  {"nombre":"El Teatro de Springfield","descripcion":"Lugar de obras, conciertos y espectáculos.","image":"img/lugares/Captura_de_Tela_29.webp"},
  {"nombre":"Estudio de TV de Krusty","descripcion":"Lugar donde Krusty graba su programa de televisión.","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV8DDnmgW1JKx0fvVu07jPYXYCoKAqoSc2Ow&s"},
  {"nombre":"La Tienda de Comics de Springfield","descripcion":"Tienda de cómics de Comic Book Guy.","image":"img/lugares/Android26_Baseball_Card_Shop.webp"},
  {"nombre":"Casa de Patty y Selma","descripcion":"Hermanas de Marge, viven juntas en un apartamento.","image":"img/lugares/MargesOldHouse.webp"},
];

  let paginaActualLugares = 1;
    const lugaresPorPagina = 9;

    function cargarLugares() {
      const contenedor = document.getElementById('lugares-container');
      contenedor.innerHTML = '';

      const inicio = (paginaActualLugares - 1) * lugaresPorPagina;
      const fin = inicio + lugaresPorPagina;
      const lugaresPagina = lugares.slice(inicio, fin);

      lugaresPagina.forEach(l => {
        const card = document.createElement('div');
     card.className = 'bg-white border-4 border-black rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform';
        card.innerHTML = `
          <img src="${l.image}" alt="${l.nombre}" class="w-auto h-64 mx-auto rounded">
          <h3 class="text-lg md:text-xl font-semibold text-orange-600 mt-2">${l.nombre}</h3>
          <p class="text-sm md:text-base text-gray-700 mt-1">${l.descripcion}</p>
        `;
        contenedor.appendChild(card);
      });

      const totalPaginas = Math.ceil(lugares.length / lugaresPorPagina);
      document.getElementById('pagina-actual-lugares').textContent = `Página ${paginaActualLugares} de ${totalPaginas}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
      cargarLugares();
      document.getElementById('btn-anterior-lugares').addEventListener('click', () => {
        if (paginaActualLugares > 1) { paginaActualLugares--; cargarLugares(); }
      });
      document.getElementById('btn-siguiente-lugares').addEventListener('click', () => {
        const totalPaginas = Math.ceil(lugares.length / lugaresPorPagina);
        if (paginaActualLugares < totalPaginas) { paginaActualLugares++; cargarLugares(); }
      });
    });


const  todasPreguntas  = [
  { pregunta: "¿Quién es el mejor amigo de Homero?", opciones:["Barney","Moe","Lenny","Carl"], respuesta:"Lenny" },
  { pregunta: "¿Cuál es la comida favorita de Homero?", opciones:["Pizza","Rosquillas","Hamburguesa","Sushi"], respuesta:"Rosquillas" },
  { pregunta: "¿Cómo se llama la planta nuclear de Springfield?", opciones:["Springfield Nuclear","Planta Nuclear","Central Nuclear","Nuclear Power"], respuesta:"Planta Nuclear" },
  { pregunta: "¿Cuál es el apellido de Bart?", opciones:["Simpson","Smith","Johnson","Brown"], respuesta:"Simpson" },
  { pregunta: "¿Cómo se llama la hermana menor de Bart?", opciones:["Lisa","Maggie","Marge","Patty"], respuesta:"Lisa" },
  { pregunta: "¿Cómo se llama el bar de Homero?", opciones:["Moe's Tavern","Duff Bar","Kwik-E-Mart","Taberna de Barney"], respuesta:"Moe's Tavern" },
  { pregunta: "¿Cuál es el nombre completo de Homero?", opciones:["Homero Jay Simpson","Homero Lee Simpson","Homero John Simpson","Homero Patrick Simpson"], respuesta:"Homero Jay Simpson" },
  { pregunta: "¿Quién es el alcalde de Springfield?", opciones:["Quimby","Skinner","Flanders","Burns"], respuesta:"Quimby" },
  { pregunta: "¿Cómo se llama el payaso de la televisión favorito de Bart y Lisa?", opciones:["Krusty","Itchy","Scratchy","Bobo"], respuesta:"Krusty" },
  { pregunta: "¿Quién es la vecina religiosa de la familia Simpson?", opciones:["Maude Flanders","Edna Krabappel","Marge","Patty"], respuesta:"Maude Flanders" },
  { pregunta: "¿Cuál es la mascota de la familia Simpson?", opciones:["Ayudante de Santa","Bola de Nieve II","Pluto","Garfield"], respuesta:"Ayudante de Santa" },
  { pregunta: "¿Quién es el director de la Escuela Primaria de Springfield?", opciones:["Skinner","Chalmers","Moe","Quimby"], respuesta:"Skinner" },
  { pregunta: "¿Cómo se llama la madre de Homero?", opciones:["Mona Simpson","Marge Simpson","Patty Simpson","Selma Simpson"], respuesta:"Mona Simpson" },
  { pregunta: "¿Quién es el enemigo de Bart en la escuela?", opciones:["Nelson","Milhouse","Ralph","Jimbo"], respuesta:"Nelson" },
  { pregunta: "¿Qué bebida toma Homero en exceso?", opciones:["Cerveza Duff","Coca-Cola","Agua","Vino"], respuesta:"Cerveza Duff" },
  { pregunta: "¿Cómo se llama el abuelo de Bart y Lisa?", opciones:["Abraham Simpson","Herb Powell","Clancy Bouvier","Ned Flanders"], respuesta:"Abraham Simpson" },
  { pregunta: "¿Qué instrumento toca Lisa?", opciones:["Saxofón","Piano","Violín","Trompeta"], respuesta:"Saxofón" },
  { pregunta: "¿Cuál es la tienda de conveniencia de Apu?", opciones:["Kwik-E-Mart","Mini-Mart","Springfield Market","K-Mart"], respuesta:"Kwik-E-Mart" },
  { pregunta: "¿Quién es la esposa de Ned Flanders?", opciones:["Maude Flanders","Marge Simpson","Patty Bouvier","Selma Bouvier"], respuesta:"Maude Flanders" },
  { pregunta: "¿Qué color de pelo tiene Marge?", opciones:["Azul","Rubio","Castaño","Negro"], respuesta:"Azul" },
  { pregunta: "¿Cómo se llama el hermano gemelo de Marge?", opciones:["Patty","Selma","Edna","Maude"], respuesta:"Patty" },
  { pregunta: "¿Cuál es el deporte favorito de Homer?", opciones:["Béisbol","Fútbol","Baloncesto","Golf"], respuesta:"Béisbol" },
  { pregunta: "¿Quién es el dueño de los Itchy & Scratchy?", opciones:["Roger Meyers","Krusty","Bart","Lisa"], respuesta:"Roger Meyers" },
  { pregunta: "¿Cuál es el nombre del perro de la familia Simpson?", opciones:["Ayudante de Santa","Pluto","Snowball","Spike"], respuesta:"Ayudante de Santa" },
  { pregunta: "¿Qué profesión tiene Homero?", opciones:["Operador nuclear","Profesor","Policía","Panadero"], respuesta:"Operador nuclear" },
  { pregunta: "¿Quién es el jefe de Homero en la planta nuclear?", opciones:["Señor Burns","Skinner","Quimby","Moe"], respuesta:"Señor Burns" },
  { pregunta: "¿Cómo se llama la esposa de Homero?", opciones:["Marge Simpson","Patty","Selma","Edna"], respuesta:"Marge Simpson" },
  { pregunta: "¿Cuál es el primer nombre de Bart?", opciones:["Bartholomew","Barton","Barry","Bart"], respuesta:"Bartholomew" },
  { pregunta: "¿Qué mascota tuvo Lisa antes de Snowball II?", opciones:["Snowball I","Ayudante de Santa","Fluffy","Rex"], respuesta:"Snowball I" },
  { pregunta: "¿Qué le gusta comer a Bart?", opciones:["Dulces","Pizza","Hamburguesas","Rosquillas"], respuesta:"Dulces" },
  { pregunta: "¿Quién es el vecino simpático de los Simpson?", opciones:["Ned Flanders","Milhouse","Apu","Barney"], respuesta:"Ned Flanders" },
  { pregunta: "¿Quién es el hijo mayor de Marge y Homero?", opciones:["Bart","Lisa","Maggie","Nelson"], respuesta:"Bart" },
  { pregunta: "¿Quién es la hija inteligente de Marge y Homero?", opciones:["Lisa","Maggie","Bart","Patty"], respuesta:"Lisa" },
  { pregunta: "¿Cómo se llama la ciudad donde viven los Simpson?", opciones:["Springfield","Shelbyville","Ogdenville","Capital City"], respuesta:"Springfield" },
  { pregunta: "¿Cuál es el conductor de autobús escolar?", opciones:["Otto","Ralph","Jimbo","Milhouse"], respuesta:"Otto" },
  { pregunta: "¿Qué profesión tiene Ned Flanders?", opciones:["Dueño de tienda","Pastor","Profesor","Médico"], respuesta:"Pastor" },
  { pregunta: "¿Quién es el mejor amigo de Bart?", opciones:["Milhouse","Nelson","Martin","Ralph"], respuesta:"Milhouse" },
  { pregunta: "¿Quién es el reportero local?", opciones:["Kent Brockman","Bart","Homer","Moe"], respuesta:"Kent Brockman" },
  { pregunta: "¿Quién es el niño mimado de la ciudad?", opciones:["Ralph Wiggum","Bart","Milhouse","Nelson"], respuesta:"Ralph Wiggum" },
  { pregunta: "¿Qué personaje dice '¡Excelente!'?", opciones:["Mr. Burns","Homero","Bart","Krusty"], respuesta:"Mr. Burns" },
  { pregunta: "¿Cuál es la mascota de Ned Flanders?", opciones:["Abejorro","Gato","Perro","Pájaro"], respuesta:"Abejorro" },
  { pregunta: "¿Qué instrumento musical toca Lisa?", opciones:["Saxofón","Piano","Violín","Flauta"], respuesta:"Saxofón" },
  { pregunta: "¿Quién maneja el camión de bomberos?", opciones:["Fire Chief Wiggum","Otto","Moe","Homer"], respuesta:"Fire Chief Wiggum" },
  { pregunta: "¿Qué personaje dice '¡Ay caramba!'?", opciones:["Bart","Lisa","Maggie","Nelson"], respuesta:"Bart" },
  { pregunta: "¿Cómo se llama el cómico de la televisión?", opciones:["Krusty","Itchy","Scratchy","Barney"], respuesta:"Krusty" },
  { pregunta: "¿Cuál es el apellido de Marge?", opciones:["Bouvier","Simpson","Flanders","Krabappel"], respuesta:"Bouvier" },
  { pregunta: "¿Quién es el jefe de policía?", opciones:["Clancy Wiggum","Homer","Skinner","Burns"], respuesta:"Clancy Wiggum" },
  { pregunta: "¿Quién es el dueño de la taberna?", opciones:["Moe Szyslak","Barney","Krusty","Burns"], respuesta:"Moe Szyslak" },
  { pregunta: "¿Cuál es el verdadero nombre de Moe?", opciones:["Moe Szyslak","Moe Howard","Moe Smith","Moe Burns"], respuesta:"Moe Szyslak" },
  { pregunta: "¿Qué trabaja Apu?", opciones:["Kwik-E-Mart","Planta Nuclear","Escuela","Bar"], respuesta:"Kwik-E-Mart" },
  { pregunta: "¿Quién es el hermano de Marge?", opciones:["Patty","Selma","Bart","Milhouse"], respuesta:"Patty" },
  { pregunta: "¿Cuál es la marca de cerveza favorita de Homer?", opciones:["Duff","Budweiser","Heineken","Corona"], respuesta:"Duff" },
  { pregunta: "¿Cómo se llama la niñera de Maggie?", opciones:["Shary Bobbins","Edna","Patty","Selma"], respuesta:"Shary Bobbins" },
  { pregunta: "¿Quién es el director de la escuela?", opciones:["Skinner","Quimby","Moe","Burns"], respuesta:"Skinner" },
  { pregunta: "¿Cómo se llama el perro de la familia?", opciones:["Ayudante de Santa","Pluto","Snowball II","Rex"], respuesta:"Ayudante de Santa" },
  { pregunta: "¿Qué personaje tiene problemas con el alcohol?", opciones:["Barney","Homero","Ned","Burns"], respuesta:"Barney" },
  { pregunta: "¿Quién trabaja en la radio de Springfield?", opciones:["Kent Brockman","Bart","Lisa","Maggie"], respuesta:"Kent Brockman" },
  { pregunta: "¿Cómo se llama el restaurante de Krusty?", opciones:["Krusty Burger","Itchy & Scratchy","Moe's Tavern","Kwik-E-Mart"], respuesta:"Krusty Burger" },
  { pregunta: "¿Qué personaje es muy supersticioso?", opciones:["Ned Flanders","Homero","Bart","Moe"], respuesta:"Ned Flanders" },
  { pregunta: "¿Quién es el personaje que siempre tiene mal humor?", opciones:["Lisa","Patty","Selma","Moe"], respuesta:"Moe" },
  { pregunta: "¿Cuál es el apellido de los vecinos?", opciones:["Flanders","Simpson","Burns","Krabappel"], respuesta:"Flanders" },
  { pregunta: "¿Qué personaje es dueño del estadio de béisbol?", opciones:["Señor Burns","Homer","Bart","Ned"], respuesta:"Señor Burns" }
];
function obtenerPreguntasAleatorias(n) {
  const copia = [...todasPreguntas];
  const seleccionadas = [];
  while (seleccionadas.length < n && copia.length > 0) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccionadas.push(copia.splice(idx, 1)[0]);
  }
  return seleccionadas;
}

let preguntasTrivia = obtenerPreguntasAleatorias(20);
let indiceTrivia = 0;
let puntaje = 0;

function mostrarPregunta(indice) {
  const preguntaCont = document.getElementById('pregunta-texto');
  const opcionesCont = document.getElementById('opciones-container');
  const resultado = document.getElementById('resultado-trivia');
  const btnSiguiente = document.getElementById('btn-siguiente-trivia');

  // limpiar contenido previo
  resultado.textContent = '';
  resultado.className = ''; 
  btnSiguiente.classList.add('hidden');
  opcionesCont.innerHTML = '';

  // obtener pregunta actual
  const item = preguntasTrivia[indice];
  preguntaCont.textContent = `Pregunta ${indice + 1}: ${item.pregunta}`;

  // generar botones de opciones en columna
  item.opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op;
    btn.className =
      "bg-yellow-400 border-4 border-black px-6 py-2 text-lg rounded-xl hover:bg-yellow-500 transition-transform hover:scale-105 w-full max-w-xs";
    
    btn.addEventListener('click', () => {
      // Bloquear todos los botones después de elegir
      Array.from(opcionesCont.children).forEach(b => b.disabled = true);

      if (op === item.respuesta) {
        resultado.textContent = "✅ ¡Correcto!";
        resultado.className = "text-green-600 font-bold text-lg text-center mt-4";
        puntaje++;
      } else {
        resultado.textContent = `❌ Incorrecto. La respuesta correcta es: ${item.respuesta}`;
        resultado.className = "text-red-600 font-bold text-lg text-center mt-4";
      }

      btnSiguiente.classList.remove('hidden');
    });

    opcionesCont.appendChild(btn);
  });
}


// 👉 Botón "Comenzar Trivia"
document.getElementById('btn-comenzar-trivia').addEventListener('click', () => {
  document.getElementById('bienvenida-trivia').classList.add('hidden');
  document.getElementById('pregunta-container').classList.remove('hidden');
  mostrarPregunta(indiceTrivia);
});

// 👉 Botón "Siguiente Pregunta"
document.getElementById('btn-siguiente-trivia').addEventListener('click', () => {
  indiceTrivia++;
  if (indiceTrivia >= preguntasTrivia.length) {
    // Termina la trivia
    document.getElementById('pregunta-container').classList.add('hidden');
    document.getElementById('resultado-final').classList.remove('hidden');
    document.getElementById('puntaje-final').textContent =
      `Tu puntaje: ${puntaje} de ${preguntasTrivia.length}`;
  } else {
    mostrarPregunta(indiceTrivia);
  }
});

// 👉 Botón "Reiniciar Trivia"
document.getElementById('btn-reiniciar-trivia').addEventListener('click', () => {
  preguntasTrivia = obtenerPreguntasAleatorias(20);
  indiceTrivia = 0;
  puntaje = 0;
  document.getElementById('resultado-final').classList.add('hidden');
  document.getElementById('pregunta-container').classList.remove('hidden');
  mostrarPregunta(indiceTrivia);
});

// ==================== INICIALIZACION ====================
document.addEventListener('DOMContentLoaded', () => {
  cargarPersonajes();
  cargarTodosEpisodios();
  cargarLugares();
});
