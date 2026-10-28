import { pokemones } from "./db/pokemones.js";
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
  document.querySelector("#pokedex-gallery").innerHTML = pokemones.map(pokemon => `
    <article class="pokemon-card">
      <div class="pokemon-image">
        <img src="${pokemon.imagen}" alt="${pokemon.nombre}" />
      </div>
      <div class="pokemon-info">
        <span class="pokemon-id">N.º ${pokemon.id}</span>
        <h2>${pokemon.nombre}</h2>
        <div class="pokemon-types">
          <span class="type type-${pokemon.tipo[0].toLowerCase()}">${pokemon.tipo[0]}</span>
        </div>
        <p class="pokemon-rareza">${pokemon.rareza}</p>
        <button class="btn-detalle" data-id="${pokemon.id}">Ver detalles</button>
      </div>
    </article>`).join("");
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
