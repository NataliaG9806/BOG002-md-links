// module.exports = () => {
//   // ...
// };


let fs = require('fs');
let path = require('path') 

const route = 'fileToRead.md';



fs.readFile(route, {encoding: 'utf-8'}, function (error, datos) {
  if (error){
    console.log('Error : ${error}');
  } else{
    console.log('Datos en el archivo: ');
    console.log(datos);
    const routeExtension = path.extname(route)
    console.log('la extensión del archivo es: ' + routeExtension);

  }
})