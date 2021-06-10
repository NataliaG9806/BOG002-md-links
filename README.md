# **Markdown Links**

Esta libreria extrae los links de los archivos .md de una ruta (relativa o absoluta) que se le indique. La funcion mdLinks acepta dos parametros el primero es la ruta y el segundo es un objeto validate de tipo boleano.Esta funcion retorna una promesa. Cuando validate es false retornaraun arreglo de objetos con:

* href :  Link encontrado
* file :  La ruta indicada
* text :  El texto del link

Cuando validate sea true, retornara adicionalmente los objetos:

* status :  Codigo de respesta http del link
* ok :  Mensaje 'OK' si fue satisfactoria la respuesta http y mensaje 'FAIL' de lo contrario

# **Instalacion**

En el terminal colocar el siguiente comando

```js
npm install NataliaG9806/BOG002-md-links
```

# **Uso** 

## **Por consola**

Tienes 4 opciones para trabajar en consola

### **Mirar comandos**
Para saber cuales comandos pueden ser utilizados, escribir en la consola:

```js
md-links 
```

o tambien 

```js
md-links --help
```

Este comando retornara:

```js
ARGUMENTS:
--validate   :    Look for links in the indicated location. Returns local ubication, links, status code and status message.
--stats      :    Look for links in the indicated location. Returns local ubication, text with general statistics of the links found.
```

### **Validar links**
Para realizar la validacion de links, escribir en la consola:

```js
md-links <ruta> --validate
```

Este retornara la ruta indicada, el link encontrado, el codigo de respuesta HTTP y el mensaje(ok o fail) de la respuesta http

Ejemplo : 

Se ingresa

```js
$ md-links C:/Users/Admin/Desktop/BOG002-social-network/README.md --validate
```

Se obtine como repsuesta

```js
C:/Users/Admin/Desktop/BOG002-social-network/README.md https://es.wikipedia.org/wiki/Empanada 200 OK
```


### **Estadisticas de los links**
Para realizar estadisticas de los links (cantidad total y cantidad de links que no estan repetidos), escribir en la consola:

```js
md-links <ruta> --stats
```

Ejemplo : 

Se ingresa

```js
$ md-links C:/Users/Admin/Desktop/BOG002-social-network/README.md --stats
```

Se obtine como repsuesta

```js
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│  total  │   33   │
│ unique  │   30   │
└─────────┴────────┘
```

### **Estadisticas de los links y validar**
Para realizar estadisticas de los links en los cuales sea necesario la validacion (cantidad links de respues http no satisfactoria) ademas de las estadisticas presentadas en el anterior apartado, escribir en la consola:

```js
md-links <ruta> --validate --stats
```

Ejemplo : 

Se ingresa

```js
$ md-links C:/Users/Admin/Desktop/BOG002-social-network/README.md --validate --stats
```

Se obtine como repsuesta

```js
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│  total  │   33   │
│  fails  │   1    │
│ unique  │   30   │
└─────────┴────────┘
``` 

## **En codigo**

Primero debe de ser importado el modulo mdLinks paa esto escribir:

```js
const mdLinks = require("md-links");
```

luego para poder ser utilizado se debe de tener presente que la funcion retorna una promesay debe de ser utilizado asi:

sin respuesta Http

```js
mdLinks.mdLinks('ruta', {validate: false})
.then((answer) =>{
  // => [{ href, text, file }, ...]
})
.catch(console.error);
```

 o tambien 

 ```js
mdLinks.mdLinks('ruta')
.then((answer) =>{
  // => [{ href, text, file }, ...]
})
.catch(console.error);
```

con respuesta http

```js
mdLinks.mdLinks('ruta', {validate: true})
.then((answer) =>{
  // => [{ href, text, file, status, ok }, ...]
})
.catch(console.error);
```