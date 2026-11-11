
import { pokemonesDefecto } from "./db/pokemones.js";

import { usuariosDefecto } from "./db/usuarios.js";

let pokemones = [];

let pokemonesGuardados = localStorage.getItem("pokemones");

if (pokemonesGuardados === null) {
  pokemones = pokemonesDefecto;

  localStorage.setItem("pokemones", JSON.stringify(pokemones));
} else {
  pokemones = JSON.parse(pokemonesGuardados);
}

function guardarPokemones() {
  localStorage.setItem("pokemones", JSON.stringify(pokemones));
}

let usuarios = usuariosDefecto;

const usuariosGuardados = localStorage.getItem("usuarios");

if (usuariosGuardados !== null) {
  usuarios = JSON.parse(usuariosGuardados);
}

function guardarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export { pokemones, guardarPokemones, usuarios, guardarUsuarios };