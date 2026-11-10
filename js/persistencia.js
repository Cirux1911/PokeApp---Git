
import { pokemonesDefecto } from "./db/pokemones.js";

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

export { pokemones, guardarPokemones };



// PRACTICA

// const colegio1 = {
//   nombre: "Juan",
//   apellido: "Perez",
//   edad: 30,
// };

// const colegio2 = {
//   nombre: "Maria",
//   apellido: "Gomez",
//   edad: 25,
// };

// // console.log(localStorage)

// localStorage.setItem("colegio-1", colegio1);

// let colegioRead = localStorage.getItem("colegio-1");

// console.log(colegioRead);