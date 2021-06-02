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
const route3 = 'D:/DOCUMENTOS/Laboratoria/card validation';
const route4 = './docs';
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
  return new Promise((resolve, reject) => {
    let newSendArrayData = new Array();

    function runFiles(routeFunction, fileReturn) {
      const stat = fs.statSync(routeFunction)
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
          return Promise.all(
          sendArrayData.map((elementSendData) => {
            if (validate.validate) {
                  new Promise((resolve) => {
                    axios.get(elementSendData.href)
                      .then((resp) => {
                        elementSendData.code = resp.status;
                        //elementSendData.status = STATUS_OK;
                        newSendArrayData.push(elementSendData);
                       // console.log(elementSendData)
                          resolve(elementSendData);
                      })
                      .catch((error) => {
                        if (error.response) {
                          elementSendData.code = error.response.status;
                          //elementSendData.status = STATUS_FAIL;
                          //newSendArrayData.push(elementSendData);
                        //  console.log(elementSendData)
                          resolve(elementSendData);
                        }
                      })
                  }) 
            } else {
              newSendArrayData.push(elementSendData);
              resolve(elementSendData);
            }
          })).then((elementSendData) =>{
            console.log(elementSendData)
          })
        }
        //console.log(newSendArrayData)
        return newSendArrayData;
      }
    }
    let newRoute;
    const fileReturn = route;
    path.isAbsolute(route) ? newRoute = route : newRoute = path.resolve(route);
    const file = runFiles(newRoute, fileReturn)
    resolve(file)
  })
}

const answer = mdLinks(route4, {
  validate: true
});
answer.then((arrayData) => {
  //arrayData.map((element) => {
    //console.log('href: ' + element.href);
    //console.log('text: ' + element.text);
    //console.log('file: ' + element.file)
    //console.log('status: ' + element.status)
 // });
})



/* if (validate.validate) {
                    function getStatus(element) {
                      let valueStatus = new Promise((resolve) => {
                        const expressionStartHttps = /^(https)/.test(element.href);
                        let httpRequire;
                        expressionStartHttps ? httpRequire = https : httpRequire = http
                        httpRequire.get(element.href, (res) => {
                          resolve(res.statusCode);
                        }).on('socket', (socket) => {
                          //console.log(socket)
                        });
                        /*httpRequire.get(element.href, (res) => {
                          resolve(res.statusCode);
                        });
                        // resolve('hola')
                      });
                      valueStatus.then((answer) => {
                        return answer
                      });
                    }
                    let newSendArrayData = new Array();
                    sendArrayData.map((element) => {
                      const answerStatus = getStatus(element);
                      newSendArrayData.push(Object.assign(element, {
                        status: answerStatus
                      }));
                    });
                    //console.log(newSendArrayData)
                    resolve(newSendArrayData);
                  } else {
                    resolve(sendArrayData);
                  }*/
//resolve(sendArrayData)
