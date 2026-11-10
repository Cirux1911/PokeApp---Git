import { pokemones } from "./persistencia.js";
import { usuarios } from "./db/usuarios.js";

const app = document.querySelector("#app");

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
      <input type="text" id="nombre" />
      <label for="email"> Email </label>
      <input type="email" id="email" />
      <label for="nuevo-username"> Usuario </label>
      <input type="text" id="nuevo-username" />
      <label for="nueva-password"> Contraseña </label>
      <input type="password" id="nueva-password" />
      <button type="submit">Registrarse</button>
    </form>
  </section>`,

  batalla: `<section class="batalla-section">
    <h1>Batalla Pokémon</h1>
    <p>Elegí tu Pokémon para comenzar.</p>
    <button id="btn-comenzar-batalla">Comenzar batalla</button>
  </section>`,
};


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
          <div class="pokemon-image">
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
  const usuario = usuarios.find(u => u.username === username && u.password === password);
  alert(usuario ? "Bienvenido " + usuario.nombre : "Usuario o contraseña incorrectos");
}

function mostrar(pantalla) {
  app.innerHTML = pantallas[pantalla];
  if (pantalla === "pokedex") cargarPokedex();
  if (pantalla === "login")
    document.querySelector("#form-login").addEventListener("submit", validarLogin);
}

document.querySelector(".header-logo img").addEventListener("click", () => mostrar("landing"));

const enlaces = {
  "link-pokedex": "pokedex",
  "link-login": "login",
  "link-registro": "registro",
  "link-juego": "batalla",
};

for (const [id, pantalla] of Object.entries(enlaces)) {
  document.getElementById(id).addEventListener("click", event => {
    event.preventDefault();
    mostrar(pantalla);
  });
}

mostrar("landing");
