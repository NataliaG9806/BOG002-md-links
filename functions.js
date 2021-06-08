const fs = require("fs");
const path = require("path");
const axios = require("axios");
const functions = require('./functions.js');

exports.browseFiles = (route, arrayFiles) => {
  const stat = fs.statSync(route);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(route);
    let promiseFiles = files.map((element) => {
      return (functions.browseFiles((path.join(route, element)), arrayFiles))
    });
    promiseFiles.forEach((file) => {
      if ((file != undefined) && (!Array.isArray(file))) {
        arrayFiles.push(file);
      }
    })
    return arrayFiles
  } else {
    const routeExtension = path.extname(route);
    if (routeExtension == '.md') {
      return new Promise((resolve) => {
        resolve(route);
      });
    }
  }
}

function clearLineToGetLink(element, expressionLink) {
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
      return clearLineToGetLink(answerExpressionReturn, expressionOpen);
    } else {
      return (answerExpression[1]);
    }
  }
}

exports.getLinks = (route) => {
  const readFile = fs.readFileSync(route, {
    encoding: 'utf-8'
  });
  let lines = readFile.split('\n');
  const expressionLink = /\((\S[^)]+)\)/;
  let arrayDataFunction = new Array();
  lines.map((element) => {
    const expressionHttp = /\(http/.test(element);
    if (expressionHttp) {
      const expressionText = /\[([^\]]+)]/g.exec(element);
      let answerExpressionText;
      expressionText == null ? answerExpressionText = "" : answerExpressionText = expressionText[1]
      const link = clearLineToGetLink(element, expressionLink);
      arrayDataFunction.push({
        href: link,
        text: answerExpressionText,
        file: route,
      });
    }
  });
  return (arrayDataFunction)
}

exports.getHttp = (elem) => {
  return new Promise((resolve) => {
    axios.get(elem.href)
      .then((resp) => {
        elem.status = resp.status;
        elem.ok = 'OK';
        resolve(elem);
      })
      .catch((error) => {
        if (error.response) {
          elem.status = error.response.status;
          elem.ok = 'FAIL';
          resolve(elem);
        }
      })
  })
}


