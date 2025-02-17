//Clase Comic
//Se comunica directamente con el comics.json

const fs = require("fs");
const path = require("path");
const comicsFilePath = path.join(__dirname, "../../src/jsons/comics.json");
const imageMapPath = path.join(__dirname, "../../src/assets/imageMap.js");

//funciones útiles
const escribirDatos = (data) => {
  try {
    //convierte el objeto data a JSON y lo escribe en el arcihvo json
    fs.writeFileSync(comicsFilePath, JSON.stringify(data, null, 2)); //los dos últimos parámetros son para que el JSON sea más ordenado de leer
  } catch (error) {
    console.log("Error escribiendo en la base de datos", error);
  }
};

const readData = () => {
  try {
    const data = fs.readFileSync(comicsFilePath, "utf8"); //lee el archivo y lo almacena en data
    return JSON.parse(data); // parsea y retorna los datos como un objeto JavaScript
  } catch (error) {
    console.log("Error leyendo la base de datos", error);
    return [];
  }
};

//obtener todos los cómics
const getAllComics = () => {
  const file = readData();
  return file;
};

//obtener un intervalo de comics
const getComicsByRange = (startIndex, endIndex) => {
  const comics = readData();

  // Fijacion de Valores para prevenir errores
  startIndex = Math.max(startIndex, 0);
  endIndex = Math.min(Math.max(startIndex, endIndex), comics.length - 1);

  if (endIndex === startIndex) return comics[startIndex];
  return comics.slice(startIndex, endIndex + 1);
};

//crear un cómic
const createOneComic = (body) => {
  const file = readData();

  //genero el nuevo cómic
  const nuevoComic = {
    id: obtenerNuevoId(file) /*file.length + 1, */,
    ...body,
  };

  console.log(nuevoComic); //mostrando en pantalla para verificar
  file.push(nuevoComic); //agrego el nuevo cómic
  escribirDatos(file);

  //actualizar imageMap.js
  actualizarImageMap(nuevoComic.cover);

  return nuevoComic;
};

//función para actualizar ImageMap
const actualizarImageMap = (coverName) => {
  try {
    let imageMapContent = fs.readFileSync(imageMapPath, "utf8"); //lectura del archivo en la ruta

    //compruebo si la img esta en imageMap (evito imgs duplicadas, aunque se puede obviar porque puede ser molesto)
    if (imageMapContent.includes(coverName)) {
      return;
    }

    // construyo la nueva entrada en imageMap
    const nuevaDir = `  "${coverName}": require("./comics/${coverName}"),\n};`;
    imageMapContent = imageMapContent.replace("};", nuevaDir); //agrego

    fs.writeFileSync(imageMapPath, imageMapContent, "utf8"); //actualizo el archivo
    console.log(`Se ha actualizado imageMap.js con: ${coverName}`);
  } catch (error) {
    console.error("Error actualizando imageMap.js", error);
  }
};

//funcion para obtener el id(evita repetidos)
function obtenerNuevoId(items) {
  // sacamos los IDs y los ordenamos de menor a mayor.
  const ids = items.map((c) => c.id).sort((a, b) => a - b);

  // empiezo con el ID mínimo posible.
  let nextId = 1;
  let contador = 0;
  // recorro los IDs ordenados.
  while (contador < ids.length && ids[contador] == nextId) {
    nextId++; //avanzo al siguiente elem
    contador++; //avanzo en la iteracion
  }
  // Una vez se haya encontrado el número, lo retorno.
  return nextId;
};

//eliminar un cómic

const deleteOneComic = (id) => {
  const comics = readData();
  const unComic = comics.find((comic) => comic.id === id); //lo extraigo
  const pos = comics.indexOf(unComic); //busco la pos del comic
  var exito = 0;
  if (pos >= 0) {
    //si esta en una pos válida
    comics.splice(pos, 1); //borra al cómic de esa pos
    escribirDatos(comics);

    eliminarElementoImageMap(unComic.cover);
    exito = 1; //lo pudo hacer correctamente
  }
  return exito;
};

//función para eliminar la imagen asociada a una comida en ImageMap
const eliminarElementoImageMap = (coverName) => {
  try {
    let imageMapContent = fs.readFileSync(imageMapPath, "utf8"); //lectura del archivo en la ruta

    // construyo la entrada que deseo eliminar
    const entrada = `\n  "${coverName}": require("./comics/${coverName}"),`;

    imageMapContent = imageMapContent.replace(`${entrada}`, "");

    fs.writeFileSync(imageMapPath, imageMapContent, "utf8"); //actualizo el archivo
    console.log(`Se ha eliminado en imageMap.js : ${coverName}`);
  } catch (error) {
    console.error("Error eliminando en imageMap.js", error);
  }
};

const updateOneComic = (id, body) => {
  const comics = readData();
  const pos = comics.findIndex((comic) => comic.id === id); //obtengo la pos del cómic dado

  var exito = 0;

  if (pos >= 0) {
    //pos valida
    //si se encontro, actualiza el cómic con los datos proporcionados
    comics[pos] = {
      ...comics[pos],
      ...body,
    };
    escribirDatos(comics); //modifico el json
    exito = 1; //op. exitosa
  }
  return exito;
};

module.exports = {
  getAllComics,
  createOneComic,
  deleteOneComic,
  updateOneComic,
  getComicsByRange,
};
