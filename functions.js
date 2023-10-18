// Objetos traídos del HTML
let inputNombre = document.getElementById("nombre")
let inputPrecioPorHora = document.getElementById("precioPorHora")
let inputCantidadHorasOferta = document.getElementById("cantidadHorasOferta")
let inputPrecioOferta = document.getElementById("precioOferta")
let inputIdArtistaAgregarCarrito = document.getElementById("idArtistaAgregarCarrito")
let inputIdArtistaAEliminar = document.getElementById("idArtistaAEliminar")
let inputCantidadHorasContrato = document.getElementById("cantidadHorasContrato")

let btnCargarArtista = document.getElementById("btnCargarArtista")
let btnBorrar = document.getElementById("btnBorrar")
let btnAgregarAlCarrito = document.getElementById("btnAgregarAlCarrito")
let btnBorrarArtista = document.getElementById("btnBorrarArtista")
let btnCarrito = document.getElementById("btnCarrito")
let btnFinalizarCompra = document.getElementById("btnFinalizarCompra")
let contenedorBotonCarrito = document.getElementById("contenedorBotonCarrito")

let contenedorArtistas = document.getElementById("contenedorArtistas")

// Class constructora, con sus métodos correspondientes
class Artista {
    constructor(id, nombre, precioPorHora, cantidadHorasOferta, precioOferta) {
        this.id = id
        this.nombre = nombre
        this.precioPorHora = precioPorHora
        this.cantidadHorasOferta = cantidadHorasOferta
        this.precioOferta = precioOferta
        this.precioFinal = 0
    }
}

// Arrays de objetos
const catalogo = []
const productosCarrito = []

// Función para mostrar el catálogo
function mostrarCatalogo(array){

    contenedorArtistas.innerHTML = ""

    for(let artista of array){
        
        let artistaNuevoDiv = document.createElement("div")
        artistaNuevoDiv.className = "artista"
        artistaNuevoDiv.innerHTML = `
            <div>
                <h3> 
                    Nombre: ${artista.nombre} || Precio por hora: ${artista.precioPorHora} || Oferta especial: ${artista.cantidadHorasOferta} horas por ${artista.precioOferta}
                    <br> ID: ${artista.id}
                </h3>
            </div> `
        contenedorArtistas.append(artistaNuevoDiv)
    }
}

// Función para agregar un artista a la página y al catálogo, ej: Artista(1, "Juan", 2000, 3, 5000)
function agregarArtista(nombre, precioPorHora, cantidadHorasOferta, precioOferta) {
    // Instanciar al artista en un objeto y agregarlo al catálogo
    const nuevoArtista = new Artista(catalogo.length+1, nombre, precioPorHora, cantidadHorasOferta, precioOferta)
    catalogo.push(nuevoArtista)
    mostrarCatalogo(catalogo)
    localStorage.setItem("catalogo", JSON.stringify(catalogo))
}

// Función para borrar un artista (en caso de que ya no forme parte de nuestra página)
function borrarArtista(array, id){
    let coincidencia = false
    for(let elem of array){
        if(elem.id == id){
            let indice = array.indexOf(elem)

            array.splice(indice, 1)
            mostrarCatalogo(array)
            coincidencia = true

        }
    }
    if(!coincidencia){
        Swal.fire({
            icon: 'ERROR',
            title: 'Oops...',
            text: 'Este ID no se encuentra en nuestra base de datos'
          })
    }
    localStorage.setItem("catalogo", JSON.stringify(catalogo))
}

// Función para poder agregar contrato(s) al carrito
function agregarAlCarrito(stock, carrito, idArtista, cantidadHoras){
    let precioFinal = 0
    let artistaContratado = stock.find(
        (artista) => artista.id == idArtista 
    )
    // Definir si la cantidad de horas a contratar aplica para la oferta o no y calcular el precio final en base a la cantidad de horas
    if(cantidadHoras >= artistaContratado.cantidadHorasOferta) {
        precioFinal = parseInt((Math.trunc(cantidadHoras / artistaContratado.cantidadHorasOferta) * artistaContratado.precioOferta) 
        + ((cantidadHoras % artistaContratado.cantidadHorasOferta) * artistaContratado.precioPorHora))
    } else if (cantidadHoras < artistaContratado.cantidadHorasOferta) {
        precioFinal = (cantidadHoras * artistaContratado.precioPorHora)
    }

    artistaContratado.precioFinal = precioFinal
    carrito.push(artistaContratado)
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

// Función para que los productos del carrito sean visibles para el usuario
function mostrarCarrito(array){

    contenedorArtistas.innerHTML = ""

    for(let artista of array){
        
        let artistaNuevoDiv = document.createElement("div")
        artistaNuevoDiv.className = "artista"
        artistaNuevoDiv.innerHTML = `
            <h3> 
                Nombre: ${artista.nombre} || Precio por hora: ${artista.precioPorHora} || Oferta especial: ${artista.cantidadHorasOferta} horas por ${artista.precioOferta}
                <br> ID: ${artista.id}
                <br> <hr>
                PRECIO FINAL: ${artista.precioFinal}
            </h3>`
        contenedorArtistas.append(artistaNuevoDiv)
    }

    let divbtnAgregarAlCarrito = document.createElement("div")
    divbtnAgregarAlCarrito.className = "contenedorBotonesCarrito"
    divbtnAgregarAlCarrito.innerHTML = `
        <a href="./index.html">
            <button class="btnMostrarCatalogo"> MOSTRAR CATALOGO </button>
        </a>`
    contenedorArtistas.append(divbtnAgregarAlCarrito)
}

// Función para finalizar la compra
function finalizarCompra(carrito){
    const totalReduce = carrito.reduce(
        (acc, elemento)=>
        {return acc + elemento.precioFinal},
        0
    )
    
    carrito = []
    localStorage.removeItem("carrito")
    return totalReduce
}


// Función para consumir una API de Chuck Norris e implementar una frase suya
async function traerFraseDeCuckNorrisAPI() {
    const respuesta = await fetch("https://api.chucknorris.io/jokes/random")
    const infoFrase = await respuesta.json()
    frase = infoFrase.value
    return frase
}


// Función que trae los artistas del archivo JSON local
async function cargarArtistas(array) {
    const respuesta = await fetch("./artistas.json")
    const infoArtista = await respuesta.json()
    for(let artista of infoArtista) {
        let artistaNuevo = new Artista (artista.id, artista.nombre, artista.precioPorHora, artista.cantidadHorasOferta, artista.precioOferta)
        array.push(artistaNuevo)
        localStorage.setItem("catalogo", JSON.stringify(catalogo))
    }
}

// Función cargador
function cargador() {
    return new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
}


if(localStorage.getItem("catalogo")){

    for(let artista of JSON.parse(localStorage.getItem("catalogo"))){
        let artistaStorage = new Artista (artista.id, artista.nombre, artista.precioPorHora, artista.cantidadHorasOferta, artista.precioOferta)
        catalogo.push(artistaStorage)
    }

}else{
    cargarArtistas(catalogo)
}

// Eventos
btnCargarArtista.addEventListener("click", () => {
    agregarArtista(inputNombre.value, inputPrecioPorHora.value, inputCantidadHorasOferta.value, inputPrecioOferta.value)
    inputNombre.value = ""
    inputPrecioPorHora.value = ""
    inputCantidadHorasOferta.value = ""
    inputPrecioOferta.value = ""
    Swal.fire({
        icon: 'success',
        title: 'Se ha agregado un artista a la base de datos.',
    })
})

btnBorrar.addEventListener("click", () => {
    inputNombre.value = ""
    inputPrecioPorHora.value = ""
    inputCantidadHorasOferta.value = ""
    inputPrecioOferta.value = ""
})

btnBorrarArtista.addEventListener("click", () => {
    Swal.fire({
        title: '¿Deseas eliminar este artista?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'BORRAR',
        cancelButtonText: 'CANCELAR'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Borrado',
            'El artista ha sido eliminado de la base de datos',
            'success'
            )
            borrarArtista(catalogo, inputIdArtistaAEliminar.value),
            inputIdArtistaAEliminar.value = ""
        } else {
            inputIdArtistaAEliminar.value = ""
        }
      })
})

btnAgregarAlCarrito.addEventListener("click", () => {
    agregarAlCarrito(catalogo, productosCarrito, inputIdArtistaAgregarCarrito.value, inputCantidadHorasContrato.value)
    inputIdArtistaAgregarCarrito.value = ""
    inputCantidadHorasContrato.value = ""
    Swal.fire({
        icon: 'success',
        title: 'Se ha agregado un artista al carrito.',
    })
})

btnCarrito.addEventListener("click", () => {
    mostrarCarrito(productosCarrito)
})

btnFinalizarCompra.addEventListener("click", () => {
    let total = finalizarCompra(productosCarrito)
    let frase = traerFraseDeCuckNorrisAPI()
    cargador().then(function() {
        Toastify({
            text: `Compra realizada con éxito \n 
                Su total es: ${total} \n 
                ${frase}`,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                color: "black",
                background: "linear-gradient(to right, aqua, aquamarine)",
            }
        }).showToast();
    });

})

contenedorArtistas.innerHTML = `
    <h3> CARGANDO... </h3>
`

cargador().then(function() {
    mostrarCatalogo(catalogo)
});
