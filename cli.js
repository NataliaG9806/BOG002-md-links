#!/usr/bin/env node

const { mdLinks } = require('./index.js')
const [, , ...args] = process.argv

function validate(args, validate) {
    mdLinks(args, validate).then((array) => {
      array.forEach(element => {
        console.log(element.file, element.href, element.status, element.ok)
      });
    })
}

function stats(args, validate) {
    mdLinks(args, validate).then((array) => {
        let answers = new Array();
        let repeated = new Array();
        let countFail = 0;
        let countRepeated = 0;
        answers.total = array.length
        array.forEach((element, index) => {
          if (element.status != 200) {
            countFail++;
          }
          array.forEach((element2, index2) => {
            if ((element2.href === element.href) && (index != index2) && (index < index2) && (!repeated.includes(element2))) {
              repeated.push(element2);
              countRepeated++;
            }
          });
        });
        if(validate.validate) {
            answers.fails = countFail
        }
        answers.unique = array.length - countRepeated
        console.table(answers)
      })
}


if ((args.length == 0) || (args == '--help') || (args == '--h')) {
  console.log('ARGUMENTS:')
  console.log('--validate   :    Look for links in the indicated location. Returns local ubication, links, status code and status message. ')
  console.log('--stats      :    Look for links in the indicated location. Returns local ubication, text with general statistics of the links found. ')

} else if (args.length < 2) {
  console.error('Missing arguments')

} else if (((args[1] == '--validate') || (args[1] == '--v')) && (args.length == 2)) {
  validate(args[0], {validate: true})

} else if (((args[1] == '--stats') || (args[1] == '--s')) && (args.length == 2)) {
  stats(args[0], {validate: false})

} else if ((args.length == 3) && (((args.includes('--validate')) && (args.includes('--stats'))) || ((args.includes('--v')) && (args.includes('--s'))))) {
  stats(args[0], {validate: true})

} else {
  console.error('incorrect command')
}
