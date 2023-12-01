import { actualizarTabla } from "./tabla.js";
import { Monstruo } from "./monstruo.js";
import { LeerData, GuardarData } from "./localStorage.js";
import { getMonstruos, createMonstruo, deleteMonstruo, updateMonstruo } from "./accesoDatos.js";

const tipo = [
  "Esqueleto",
  "Zombie",
  "Vampiro",
  "Fantasma",
  "Bruja",
  "Hombre Lobo",
];
GuardarData("tipo", tipo);

const $selectTipo = document.getElementById("selectTipo");
const tipoStorage = LeerData("tipo");

let nuevoId = 0;

tipoStorage.forEach((tipo) => {
  $selectTipo.innerHTML += `<option value="${tipo}">${tipo}</option>`;
});

let monstruos = [];
const $tabla = document.getElementById("tabla");
const $formulario = document.forms[0];
const $promedio = document.getElementById("txtPromedio");
const $maximo = document.getElementById("txtMaximo");
const $minimo = document.getElementById("txtMinimo");
const $spinner = document.getElementById("spinner");
const $btnCancelar = document.getElementById("cancelar");
const $btnEliminar = document.getElementById("eliminar");
const $filtros = document.getElementById("filtros"); // Opciones combobox "filtrar defensa".
const $checkboxFiltros = document.querySelectorAll(".check"); // Todos los checkbox para tabla.

/*** MANEJADORES DE EVENTOS ***/

window.addEventListener("load", async() => {
  $spinner.classList.remove("ocultar");
  monstruos = await getMonstruos();
  $spinner.classList.add("ocultar");
  if (monstruos.length) {
    monstruos.sort((a, b) => b.miedo - a.miedo);
    actualizarTabla($tabla, monstruos);
    nuevoId =  obtenerNuevoId(monstruos);
    $promedio.value = CalcularPromedio(monstruos);
    $maximo.value = CalcularMaximo(monstruos);
    $minimo.value = CalcularMinimo(monstruos);
  } 
  else {
    $tabla.insertAdjacentHTML(
      "afterbegin",
      `<p>No se encontraron monstruos.</p>`
    )
  }
  CargarFiltros();
});


window.addEventListener("click", (e) => {
  if (e.target.matches("td")) {
    const id = e.target.parentElement.dataset.id;

    const selectedMonstruos = monstruos.find(
      (monstruo) => monstruo.id == id
    );
    cargarFormulario($formulario, selectedMonstruos);
    MostrarBotonesEliminarCancelar();
  } else if (e.target.matches("input[value='Eliminar']")) {
    deleteMonstruo(parseInt($formulario.txtId.value));
    $tabla.classList.add("ocultar");
    $formulario.reset();
    $formulario.txtId.value = "";
    OcultarBotonesEliminarCancelar();
  } else if (e.target.matches("input[value='Cancelar']")) {
    $formulario.reset();
    $formulario.txtId.value = "";
    OcultarBotonesEliminarCancelar();
  }
});



$formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const {txtId, txtNombre, rangeMiedo, txtAlias, rdoDefensa, selectTipo } =
    $formulario;

  if (
    txtNombre.value.length < 100 &&
    txtAlias.value.length < 100 &&
    txtNombre.value.length > 0 &&
    txtAlias.value.length > 0 &&
    isNaN(txtNombre.value) &&
    isNaN(txtAlias.value)
  ) {
    if (txtId.value === "") {
      const nuevoMonstruo = new Monstruo(
        nuevoId,
        txtNombre.value,
        parseInt(rangeMiedo.value),
        txtAlias.value,
        rdoDefensa.value,
        selectTipo.value
      );
      createMonstruo(nuevoMonstruo);
      $tabla.classList.add("ocultar");
    } else {
      const monstruoActualizado = new Monstruo(
        parseInt(txtId.value),
        txtNombre.value,
        parseInt(rangeMiedo.value),
        txtAlias.value,
        rdoDefensa.value,
        selectTipo.value
      );
      
      updateMonstruo(parseInt(txtId.value), monstruoActualizado);
      $tabla.classList.add("ocultar");
      $btnCancelar.classList.toggle("ocultar");
      $btnEliminar.classList.toggle("ocultar");
    }

    $formulario.reset();
  } else {
    alert("Verifique los datos ingresados.");
  }
});

$filtros.addEventListener("change", () => {
  let lista;
  if (monstruos.length > 0) {
    lista = handlerFiltros(handlerCheckbox(monstruos));
    actualizarTabla($tabla, lista);

    if (lista.length > 0) {
      $promedio.value = CalcularPromedio(handlerFiltros(monstruos));
      $minimo.value = CalcularMinimo(handlerFiltros(monstruos));
      $maximo.value = CalcularMaximo(handlerFiltros(monstruos));
    } else {
      $promedio.value = "";
      $maximo.value = "";
      $minimo.value = "";
      $tabla.insertAdjacentHTML(
        "afterbegin",
        `<p>No se encontraron monstruos.</p>`
      );
    }
  }
});

$checkboxFiltros.forEach((element) =>
  element.addEventListener("click", () => {
    actualizarTabla($tabla, handlerCheckbox(handlerFiltros(monstruos)));
    GuardarFiltros();
  })
);

/*** Otras Funciones ***/

function cargarFormulario(formulario, monstruo) {
  formulario.txtId.value = monstruo.id;
  formulario.txtNombre.value = monstruo.nombre;
  formulario.rangeMiedo.value = monstruo.miedo;
  formulario.txtAlias.value = monstruo.alias;
  formulario.rdoDefensa.value = monstruo.defensa;
  formulario.selectTipo.value = monstruo.tipo;
}

function MostrarBotonesEliminarCancelar() {
  if (
    $btnCancelar.classList.contains("ocultar") &&
    $btnEliminar.classList.contains("ocultar")
  ) {
    $btnCancelar.classList.remove("ocultar");
    $btnEliminar.classList.remove("ocultar");
  }
}

function OcultarBotonesEliminarCancelar() {
  if (
    !$btnCancelar.classList.contains("ocultar") &&
    !$btnEliminar.classList.contains("ocultar")
  ) {
    $btnCancelar.classList.add("ocultar");
    $btnEliminar.classList.add("ocultar");
  }
}

/*** REDUCE, MAP, FILTER ***/

function CalcularPromedio(lista) {
  return (
    lista.reduce((previo, actual) => {
      return previo + actual.miedo;
    }, 0) / lista.length
  );
}

function CalcularMaximo(lista) {
  return (lista.reduce((previo, actual) => {
      return previo >= actual.miedo ? previo : actual.miedo;
    }, 0));
}

function CalcularMinimo(lista) {
  return (
    lista.reduce((previo, actual) => {
      return previo < actual.miedo ? previo : actual.miedo;
    }, CalcularMaximo(lista))
  );
}


function handlerFiltros(lista) {
  let filtrada;
  switch ($filtros.value) {
    case "Vampiro":
      filtrada = lista.filter((sup) => sup.tipo === "Vampiro");
      break;
    case "Hombre Lobo":
      filtrada = lista.filter((sup) => sup.tipo === "Hombre Lobo");
      break;
      case "Fantasma":
      filtrada = lista.filter((sup) => sup.tipo === "Fantasma");
      break;
    case "Esqueleto":
      filtrada = lista.filter((sup) => sup.tipo === "Esqueleto");
      break;
      case "Crucifijo":
      filtrada = lista.filter((sup) => sup.tipo === "Crucifijo");
      break;
      case "Bruja":
      filtrada = lista.filter((sup) => sup.tipo === "Bruja");
      break;
    case "Zombie":
      filtrada = lista.filter((sup) => sup.tipo === "Zombie");
      break;
    default:
      filtrada = lista;
      break;
  }
  return filtrada;
}

function handlerCheckbox(lista) {
  const filtros = {};

  $checkboxFiltros.forEach((item) => {
    filtros[item.name] = item.checked;
  });

  return lista.map((item) => {
    const map = {};
    for (const key in item) {
      if (filtros[key] || key == "id") {
        map[key] = item[key];
      }
    }
    return map;
  });
}

  /******/

function GuardarFiltros()
{
  const filtros = {};
  $checkboxFiltros.forEach((item) => {
    filtros[item.name] = item.checked;
  });
  GuardarData("filtrosMonster", filtros);
  console.log(localStorage.getItem("filtrosMonster"));

}

/*
function CargarFiltros()
{
    const f = LeerData("filtrosMonster");
    if(f.length !== 0)
    {
      $checkboxFiltros.forEach((item) => {
        if(f[item.name] == false){
          item.removeAttribute("checked");
        }
      });
    } 
}*/


function CargarFiltros() {
  const filtros = LeerData("filtrosMonster");
  if (filtros.length !== 0) {
      $checkboxFiltros.forEach((item) => {
          if (filtros[item.name] === false) {
              item.removeAttribute("checked");
          }
      });

      // Filtrar monstruos y actualizar la tabla
      const monstruosFiltrados = handlerCheckbox(handlerFiltros(monstruos));
      actualizarTabla($tabla, monstruosFiltrados);

      // Calcula y actualiza el promedio
      $promedio.value = CalcularPromedio(monstruosFiltrados);
  }
}


function obtenerNuevoId(array) {
  let ultimoId = 0;
  //const monstruos = getMonstruos();

  for (let index = 0; index < array.length; index++) {
    const auxId = array[index].id;
    if (auxId > ultimoId) {
      ultimoId = auxId;
    }
  }
  return ultimoId + 1;
}



function GuardarFiltroTipoSeleccionado(tipo) {
  GuardarData("tipoSeleccionado", tipo);
}
