import { pokemones, usuarios, guardarUsuarios, guardarPokemones } from "./persistencia.js";
const app = document.querySelector("#app");

let usuarioActivo = null;

// Cada opción del menú muestra una pantalla, sin recargar la página.
const pantallas = {
  landing: `<section class="landing">
    <h1>Bienvenido a PokeApp</h1>
    <p>Explorá el mundo Pokémon.</p>
    <p>Elegí una opción del menú para comenzar.</p>
  </section>`,

  pokedex: `<section class="pokedex-section">
    <h1>Pokédex</h1>
    <div id="pokedex-gallery" class="pokedex-gallery"></div>
  </section>`,

  login: `<section class="login-section">
    <h1>Iniciar sesión</h1>
    <form id="form-login">
      <label for="username"> Usuario </label>
      <input type="text" id="username" required />
      <label for="password"> Contraseña </label>
      <input type="password" id="password" required />
      <button type="submit">Ingresar</button>
    </form>
  </section>`,

  registro: `<section class="registro-section">
    <h1>Registrarse</h1>
    <form id="form-registro">
      <label for="nombre"> Nombre </label>
      <input type="text" id="nombre" required />
      <label for="email"> Email </label>
      <input type="email" id="email" required />
      <label for="nuevo-username"> Usuario </label>
      <input type="text" id="nuevo-username" required />
      <label for="nueva-password"> Contraseña </label>
      <input type="password" id="nueva-password" required minlength="6" />
      <button type="submit">Registrarse</button>
    </form>
  </section>`,

  carga: `<section class="registro-section">
    <h1>Cargar Pokémon</h1>
    <form id="form-carga">
      <label>ID
        <input id="c-id" type="number" min="1" required>
      </label>
      <label>Nombre
        <input id="c-nombre" required>
      </label>
      <label>Tipo principal
        <input id="c-tipo1" required>
      </label>
      <label>Segundo tipo (opcional)
        <input id="c-tipo2">
      </label>
      <label>Descripción
        <textarea id="c-descripcion" required></textarea>
      </label>
      <label>Altura (m)
        <input id="c-altura" type="number" min="0" step="any" required>
      </label>
      <label>Peso (kg)
        <input id="c-peso" type="number" min="0" step="any" required>
      </label>
      <label>Generación
        <input id="c-generacion" type="number" min="1" required>
      </label>
      <label>HP
        <input id="c-hp" type="number" min="0" required>
      </label>
      <label>Ataque
        <input id="c-ataque" type="number" min="0" required>
      </label>
      <label>Velocidad
        <input id="c-velocidad" type="number" min="0" required>
      </label>
      <label>Defensa
        <input id="c-defensa" type="number" min="0" required>
      </label>
      <label>Habilidad
        <input id="c-habilidad" required>
      </label>
      <label>¿Tiene evolución?
        <select id="c-tieneEvolucion">
          <option value="false">No</option>
          <option value="true">Sí</option>
        </select>
      </label>
      <label>Evoluciona a
        <input id="c-evolucion">
      </label>
      <label>Nivel de evolución
        <input id="c-nivelEvolucion" type="number" min="1">
      </label>
      <label>Rareza
        <input id="c-rareza" required>
      </label>
      <label>Ruta de imagen
        <input id="c-imagen" required placeholder="./assets/img/eevee.png">
      </label>
      <label>Ruta de sonido
        <input id="c-sonido" required placeholder="./assets/sound/eevee.mp3">
      </label>
      <label>¿Tiene shiny?
        <select id="c-shiny">
          <option value="false">No</option>
          <option value="true">Sí</option>
        </select>
      </label>
      <label>Ruta de imagen shiny
        <input id="c-imagenShiny">
      </label>
      <button type="submit" class="btn-detalle">Guardar Pokémon</button>
    </form>
  </section>`,

 batalla: `<section class="batalla-section">
  <h1>Batalla Pokémon</h1>
  <p>Pikachu se enfrenta a Charmander.</p>
  <div id="opciones-batalla">
    <button id="btn-comenzar-batalla" class="btn-detalle">
      Comenzar batalla
    </button>
  </div>
</section>`,
};


const escenasBatalla = {
  turno1: {
    texto: "Turno 1: Pikachu se enfrenta a Charmander. ¿Qué hacés?",
    opciones: [
      { nombre: "Atacar", siguiente: "ataque" },
      { nombre: "Usar poción", siguiente: "pocion" }
    ]
  },
  ataque: {
    texto: "Turno 2: Pikachu ataca a Charmander, que responde con fuego.",
    opciones: [
      { nombre: "Atacar otra vez", siguiente: "victoria" },
      { nombre: "Huir", siguiente: "huida" }
    ]
  },
  pocion: {
    texto: "Turno 2: Pikachu recupera energía, pero Charmander vuelve a atacar.",
    opciones: [
      { nombre: "Atacar", siguiente: "derrota" },
      { nombre: "Huir", siguiente: "huida" }
    ]
  },
  victoria: {
    texto: "¡Pikachu gana la batalla!",
    opciones: [{ nombre: "Volver a jugar", siguiente: "turno1" }]
  },
  derrota: {
    texto: "Charmander gana la batalla. ¡Podés intentarlo otra vez!",
    opciones: [{ nombre: "Volver a jugar", siguiente: "turno1" }]
  },
  huida: {
    texto: "Pikachu escapa de la batalla.",
    opciones: [{ nombre: "Volver a jugar", siguiente: "turno1" }]
  }
};


function jugarBatalla(etapa) {
  const escena = escenasBatalla[etapa];
  let botones = "";

  for (let opcion of escena.opciones) {
    botones += `
      <button class="btn-detalle" value="${opcion.siguiente}">
        ${opcion.nombre}
      </button>`;
  }

  app.innerHTML = `
    <section class="batalla-section">
      <h1>Batalla Pokémon</h1>
      <p>${escena.texto}</p>
      <div id="opciones-batalla">${botones}</div>
    </section>`;

  document.querySelector("#opciones-batalla").addEventListener("click", function(event) {
    if (event.target.className === "btn-detalle") {
      jugarBatalla(event.target.value);
    }
  });
}


function cargarPokedex() {
  let tarjetas = "";

  for (let p of pokemones) {
    let tipos = "";

    for (let tipo of p.tipo) {
      tipos += `<span class="type type-${tipo.toLowerCase()}">${tipo}</span>`;
    }

    tarjetas += `
      <article class="pokemon-card">
        <div class="pokemon-image">
          <img src="${p.imagen}" alt="${p.nombre}">
        </div>
        <div class="pokemon-info">
          <span class="pokemon-id">N.º ${p.id}</span>
          <h2>${p.nombre}</h2>
          <div class="pokemon-types">${tipos}</div>
          <p class="pokemon-rareza">${p.rareza}</p>
          <button class="btn-detalle" value="${p.id}">Ver detalles</button>
        </div>
      </article>`;
  }

  const galeria = document.querySelector("#pokedex-gallery");
  galeria.innerHTML = tarjetas;

  galeria.addEventListener("click", function(event) {
    if (event.target.className === "btn-detalle") {
      mostrarDetalle(parseInt(event.target.value));
    }
  });
}


function mostrarDetalle(id) {
  for (let p of pokemones) {
    if (p.id === id) {
      let shiny = "No disponible";

      if (p.shiny && p.imagenShiny) {
        shiny = `<img src="${p.imagenShiny}" alt="Shiny de ${p.nombre}" width="120">`;
      }

      app.innerHTML = `
        <article class="pokemon-card" style="max-width:600px; margin:auto">
          <div class="pokemon-image" style="height: 220px; aspect-ratio: auto">
            <img src="${p.imagen}" alt="${p.nombre}">
          </div>

          <div class="pokemon-info" style="line-height:1.8">
            <h2>${p.nombre} (N.º ${p.id})</h2>
            <p>${p.descripcion}</p>

            <p><b>Tipo:</b> ${p.tipo}</p>
            <p><b>Rareza:</b> ${p.rareza}</p>
            <p><b>Generación:</b> ${p.generacion}</p>
            <p><b>Altura:</b> ${p.altura} m | <b>Peso:</b> ${p.peso} kg</p>

            <p><b>HP:</b> ${p.hp} | <b>Ataque:</b> ${p.ataque}</p>
            <p><b>Defensa:</b> ${p.defensa} | <b>Velocidad:</b> ${p.velocidad}</p>

            <p><b>Habilidad:</b> ${p.habilidad}</p>
            <p><b>Evolución:</b> ${p.evolucion || "No tiene"}</p>
            <p><b>Nivel de evolución:</b> ${p.nivelEvolucion || "No aplica"}</p>
            <p><b>Shiny:</b> ${shiny}</p>

            <audio controls src="${p.sonido}"></audio>
            <button id="volver-pokedex" class="btn-detalle">Volver</button>
          </div>
        </article>`;

      document.querySelector("#volver-pokedex").addEventListener("click", function() {
        mostrar("pokedex");
      });

      return;
    }
  }
}

function validarLogin(event) {
  event.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  for (let usuario of usuarios) {
    if (usuario.username === username && usuario.password === password) {
      usuarioActivo = usuario;
      mostrar("landing");
      return;
    }
  }

  alert("Usuario o contraseña incorrectos");
}


function registrarUsuario(event) {
  event.preventDefault();

  const nombre = document.querySelector("#nombre").value;
  const email = document.querySelector("#email").value;
  const username = document.querySelector("#nuevo-username").value;
  const password = document.querySelector("#nueva-password").value;

  for (let usuario of usuarios) {
    if (usuario.username === username || usuario.email === email) {
      alert("El usuario o email ya existe");
      return;
    }
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: nombre,
    email: email,
    username: username,
    password: password,
    avatar: "./assets/avatar/default.png",
    admin: false
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios();

  alert("Registro completo. Ahora podés iniciar sesión.");
  mostrar("login");
}

function cargarPokemon(event) {
  event.preventDefault();

  const valor = nombre => document.querySelector("#c-" + nombre).value;
  const id = Number(valor("id"));

  for (let p of pokemones) {
    if (p.id === id) {
      alert("Ese ID ya existe");
      return;
    }
  }

  const tipos = [valor("tipo1")];

  if (valor("tipo2") !== "") {
    tipos.push(valor("tipo2"));
  }

  const tieneEvolucion = valor("tieneEvolucion") === "true";
  let evolucion = null;
  let nivelEvolucion = null;

  if (tieneEvolucion) {
    evolucion = valor("evolucion");
    nivelEvolucion = Number(valor("nivelEvolucion"));

    if (evolucion === "" || valor("nivelEvolucion") === "") {
      alert("Completá la evolución y su nivel");
      return;
    }
  }

  const shiny = valor("shiny") === "true";
  let imagenShiny = null;

  if (shiny) {
    imagenShiny = valor("imagenShiny");

    if (imagenShiny === "") {
      alert("Completá la imagen shiny");
      return;
    }
  }

  const nuevoPokemon = {
    id: id,
    nombre: valor("nombre"),
    tipo: tipos,
    descripcion: valor("descripcion"),
    altura: Number(valor("altura")),
    peso: Number(valor("peso")),
    generacion: Number(valor("generacion")),
    hp: Number(valor("hp")),
    ataque: Number(valor("ataque")),
    velocidad: Number(valor("velocidad")),
    defensa: Number(valor("defensa")),
    habilidad: valor("habilidad"),
    tieneEvolucion: tieneEvolucion,
    evolucion: evolucion,
    nivelEvolucion: nivelEvolucion,
    rareza: valor("rareza"),
    imagen: valor("imagen"),
    sonido: valor("sonido"),
    shiny: shiny,
    imagenShiny: imagenShiny
  };

  pokemones.push(nuevoPokemon);
  guardarPokemones();

  alert("Pokémon guardado");
  mostrar("pokedex");
}

function mostrar(pantalla) {
  if (pantalla === "carga" && (usuarioActivo === null || usuarioActivo.admin !== true)) {
    alert("Solo los administradores pueden cargar Pokémon");
    return;
  }

  app.innerHTML = pantallas[pantalla];

  if (pantalla === "pokedex") {
    cargarPokedex();
  }

  if (pantalla === "login") {
    document.querySelector("#form-login").addEventListener("submit", validarLogin);
  }

  if (pantalla === "registro") {
    document.querySelector("#form-registro").addEventListener("submit", registrarUsuario);
  }

  if (pantalla === "carga") {
    document.querySelector("#form-carga").addEventListener("submit", cargarPokemon);
  }

  if (pantalla === "batalla") {
  document.querySelector("#btn-comenzar-batalla").addEventListener("click", function() {
    jugarBatalla("turno1");
  });
}

  if (pantalla === "landing" && usuarioActivo !== null) {
    let rol = "Usuario";

    if (usuarioActivo.admin === true) {
      rol = "Administrador";
    }

    document.querySelector(".landing").innerHTML += `
      <p>Sesión iniciada: ${usuarioActivo.nombre} (${rol})</p>
      <button id="btn-salir" class="btn-detalle">Cerrar sesión</button>`;

    if (usuarioActivo.admin === true) {
      document.querySelector(".landing").innerHTML += `
        <button id="btn-carga" class="btn-detalle">Cargar Pokémon</button>`;

      document.querySelector("#btn-carga").addEventListener("click", function() {
        mostrar("carga");
      });
    }

    document.querySelector("#btn-salir").addEventListener("click", function() {
      usuarioActivo = null;
      mostrar("landing");
    });
  }
}



document.querySelector(".header-logo img").addEventListener("click", () => mostrar("landing"));

const enlaces = {
  "link-pokedex": "pokedex",
  "link-login": "login",
  "link-registro": "registro",
  "link-juego": "batalla",
};

for (let id in enlaces) {
  document.querySelector("#" + id).addEventListener("click", function(event) {
    event.preventDefault();
    mostrar(enlaces[id]);
  });
}

mostrar("landing");
