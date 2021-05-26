// module.exports = () => {
//   // ...
// };

const fs = require('fs');
const path = require('path');
const functions = require('./functions.js');


const route1 = 'fileToRead.md';
const route2 = 'README.md'

function mdLinks(route) {
  return new Promise((resolve, reject) => {
    fs.readFile(route, {
      encoding: 'utf-8'
    }, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const routeExtension = path.extname(route);
        if(routeExtension == '.md'){
          const sendArrayData = functions.arrayData(data);
          resolve(sendArrayData);
        }
        else{
          const errorRoute = 'Invalid path, requires .md path'
          reject(errorRoute);
        }
      }
    })
  })
}

const answer = mdLinks(route1);
answer.then((arrayData) => {
  arrayData.map((element) => {
    console.log(element.href);
  });
})
