import { pokemonesDefecto } from "./db/pokemones";

console.log(pokemonesDefecto);

Let bdPokemonesExiste = localStorage.getItem("pokemones");

if (!bdPokemonesExiste === null) {
    let pokemonesJson = JSON.stringify(pokemonesDefecto);
    localStorage.setItem("pokemones", pokemonesJson);
    console.log("BD de pokemones no existe, se crea en localStorage");
} else {
    let pokemonesBD = localStorage.getItem("pokemones");
    console.log("BD de pokemones ya existe en localStorage");
}


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