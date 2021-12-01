let modulo = require("modulo.js");
modulo();
let r1 = modulo.somma(3, 7);
let r2 = modulo.moltiplicazione(3, 7);
console.log("r1: " + r1);
console.log("r2: " + r2);
console.log(modulo.json.nome);
modulo.json.setNome("pluto");// cambio il nome
console.log(modulo.json.nome);
console.log(modulo.MyClass.nome);