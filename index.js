
const functions = require('./functions.js');

/* const route1 = "README.md";
const route2 = "C:/Users/Admin/Desktop/BOG002-social-network/README.md";
const route3 = "D:/DOCUMENTOS/Laboratoria/primera web";
const route4 = "./docs/"; */

function mdLinks(route, validate) {
  return new Promise((resolve) => {
    let promiseDoorFiles, promiseDoorLinks;
    let arrayFiles = new Array();
    let arrayLinks = new Array();    
    const promisesFiles = functions.browseFiles(route, arrayFiles);
    ((promisesFiles.length > 1) || (promisesFiles.length != undefined)) ? promiseDoorFiles = Promise.all(promisesFiles): promiseDoorFiles = promisesFiles
    promiseDoorFiles.then((arrayBroseFiles) => {
      if (Array.isArray(arrayBroseFiles)) {
        arrayBroseFiles.forEach((elem) => {
          const answerLinks = functions.getLinks(elem);
          answerLinks.forEach((elem2) => {
            arrayLinks.push(elem2)
          })
        })
      } else {
        arrayLinks = functions.getLinks(arrayBroseFiles)
      }
      if (validate.validate) {
        const promisesLinks = arrayLinks.map((elem) => {
          return(functions.getHttp(elem))
        })
        
        Promise.all(promisesLinks).then((finalElement) => {
          resolve(finalElement)
        })
      } else {
        resolve(arrayLinks)
      }
    })
  })
}

module.exports = { mdLinks }

//  const answer = mdLinks(route4, {
//    validate: true,
//  });
//  answer.then((arrayData) => {
//    console.log(arrayData)
//    console.log('tamaño arreglo ' + arrayData.length)
//  })

