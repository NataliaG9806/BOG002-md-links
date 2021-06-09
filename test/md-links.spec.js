const { mdLinks } = require('../index.js')

const route1 = "./docs/fileToRead.md";
const route2 = "C:/Users/Admin/Desktop/BOG002-social-network/README.md";
const route3 = "D:/DOCUMENTOS/Laboratoria/primera web";
const route4 = "./docs/";

describe('mdLinks', () => {
  jest.setTimeout(30000);

  it('deberia ser una funcion', () => {
      expect(typeof mdLinks).toBe('function');
  });

  it('deberia retornar datos de un directorio ', async () => {
    return await mdLinks(route4, {validate: true}).then(data => {
      expect(data.length).toBe(22);
      expect(data[0].file).toBe('docs\\docs1\\docs2\\fileToRead3.md');
      expect(data[0].href).toBe('https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/conditionals');
      expect(data[0].text).toBe(' ');
      expect(data[0].ok).toBe('OK');
      expect(data[0].status).toBe(200);
    });
  }, 10000)

  it('deberia retornar datos de un archivo con fail link ', async () => {
    return await mdLinks(route1,  {validate: true}).then(data => {
      expect(data.length).toBe(4);
      expect(data[0].file).toBe('./docs/fileToRead.md');
      expect(data[0].href).toBe('https://nodejs.org/es/');
      expect(data[0].text).toBe('');
    });
  })

  it('deberia retornar datos de un archivo sin validate ', async () => {
    return await mdLinks(route1,  {validate: false}).then(data => {
      expect(data.length).toBe(4);
      expect(data[0].file).toBe('./docs/fileToRead.md');
      expect(data[0].href).toBe('https://nodejs.org/es/');
      expect(data[0].text).toBe('');
    });
  },10000)

});

