// module.exports = () => {
//   // ...
// };

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const axios = require("axios");

//import { stat } from 'fs';

const route1 = 'README.md';
const route2 = 'C:/Users/Admin/Desktop/BOG002-social-network/README.md';
const route3 = 'D:/DOCUMENTOS/Laboratoria/primera web';
const route4 = './docs/';
const route5 = '';

function arrayData(data, route) {
  let lines = data.split('\n');
  const expressionLink = /\((\S[^)]+)\)/;
  // /\[.+?]/g   /\((\S[^)]+)\)/  /(\S+)\)/ NO BORRAR
  let arrayDataFunction = new Array();

  function recursionFilterLink(element, expressionLink) {
    const answerExpression = expressionLink.exec(element);
    if ((answerExpression != null) && (typeof (element) == 'string')) {
      const expressionStart = /^http/.test(answerExpression[1]);
      if (!expressionStart) {
        let expressionOpen, answerExpressionReturn;
        const expressionHttp = /http/.test(answerExpression[1]);
        if (!expressionHttp) {
          const answerExpressionNew = /\(http(\S+)/.exec(answerExpression.input);
          expressionOpen = /\((\S[^)]+)\)/;
          answerExpressionReturn = answerExpressionNew[0];
        } else {
          expressionOpen = /\((\S+)/;
          answerExpressionReturn = answerExpression[1];
        }
        return recursionFilterLink(answerExpressionReturn, expressionOpen);
      } else {
        return (answerExpression[1]);
      }
    }
  }
  lines.map((element) => {
    const expressionHttp = /\(http/.test(element);
    if (expressionHttp) {
      const expressionText = /\[([^\]]+)]/g.exec(element);
      let answerExpressionText;
      expressionText == null ? answerExpressionText = "" : answerExpressionText = expressionText[1]
      const link = recursionFilterLink(element, expressionLink);
      arrayDataFunction.push({
        href: link,
        text: answerExpressionText,
        file: route,
      });
    }
  });
  return arrayDataFunction;
}

function mdLinks(route, validate) {
  return new Promise((resolve) => {
    let newSendArrayData = new Array();
    function runFiles(routeFunction, fileReturn) {
      let promiseRunFiles = new Promise ((resolve) => {
        const stat = fs.statSync(routeFunction);
        if (stat.isDirectory()) {
          const files = fs.readdirSync(routeFunction)
          files.map((element) => {
            runFiles((path.join(routeFunction, element)), fileReturn)
          })
          return newSendArrayData;
        } else {
            const routeExtension = path.extname(routeFunction);
            if (routeExtension == '.md') {
              const readFile = fs.readFileSync(routeFunction, {
                encoding: 'utf-8'
              });
              const sendArrayData = arrayData(readFile, routeFunction);
              let promiseElse = new Promise ((resolve)=>{ 
                sendArrayData.map((elementSendData) => {
                  if (validate.validate) {
                    axios.get(elementSendData.href)
                    .then((resp) => {
                      elementSendData.status = resp.status;
                      elementSendData.ok = 'OK';
                      newSendArrayData.push(elementSendData);
                     // console.log(elementSendData)
                        resolve(newSendArrayData);
                    })
                    .catch((error) => {
                      if (error.response) {
                        elementSendData.status = error.response.status;
                        elementSendData.ok = 'FAIL';
                        newSendArrayData.push(elementSendData);
                      //  console.log(elementSendData)
                        resolve(newSendArrayData);
                      }
                    })
                  } else {
                    newSendArrayData.push(elementSendData);
                    resolve(newSendArrayData)
                  }
                })              
              })
              promiseElse.then((arrayElement)=>{
                resolve(arrayElement)
              })
            }
        }
      })
      promiseRunFiles.then((array) => {
        setTimeout(()=>{ resolve(array) }, 8000);
        
      })

    }
    let newRoute;
    const fileReturn = route;
    path.isAbsolute(route) ? newRoute = route : newRoute = path.resolve(route);
    runFiles(newRoute, fileReturn)
  })
}

const answer = mdLinks(route3, {
  validate: true
});
answer.then((arrayData) => {
  arrayData.map((element) => {
    console.log('href: ' + element.href);
    console.log('text: ' + element.text);
    console.log('file: ' + element.file);
    console.log('status: ' + element.status);
    console.log('ok: ' + element.ok)
  });
  console.log('tamaño arreglo ' + arrayData.length)
})

