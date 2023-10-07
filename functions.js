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
let contenedorErrores = document.getElementById("contenedorErrores")

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

            contenedorErrores.innerHTML = `
            <h2> Todo marcha perfectamente bien :D </h2>
        `
        }
    }
    if(!coincidencia){
        contenedorErrores.innerHTML = `
            <h2> ERROR el ID: ${id} NO existe en nuestro catálogo </h2>
        `
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
    
    let totalDiv = document.createElement("div")
    totalDiv.className = "total"
    totalDiv.innerHTML = `
    Su TOTAL es: ${totalReduce}`
    contenedorBotonesCarrito.append(totalDiv)
    carrito = []
    localStorage.removeItem("carrito")
}


// Ejemplos de artistas para probar las opciones sin tener que crearlos cada vez
artista1 = new Artista(1, "Juan", 2000, 3, 5000)
artista2 = new Artista(2, "María", 4000, 4, 14000)
artista3 = new Artista(3, "Gustavo", 1000, 5, 3000)

if(localStorage.getItem("catalogo")){

    for(let artista of JSON.parse(localStorage.getItem("catalogo"))){
        let artistaStorage = new Artista (artista.id, artista.nombre, artista.precioPorHora, artista.cantidadHorasOferta, artista.precioOferta)
        estanteria.push(artistaStorage)
    }

}else{
    //no existe seteamos porprimera vez
    console.log("seteamos por primera vez")
    estanteria.push(libro1,libro2,libro3,libro4,libro5,libro6)
    localStorage.setItem("estanteria", JSON.stringify(estanteria))
}

// Eventos
btnCargarArtista.addEventListener("click", () => {
    agregarArtista(inputNombre.value, inputPrecioPorHora.value, inputCantidadHorasOferta.value, inputPrecioOferta.value)
    inputNombre.value = ""
    inputPrecioPorHora.value = ""
    inputCantidadHorasOferta.value = ""
    inputPrecioOferta.value = ""
})

btnBorrar.addEventListener("click", () => {
    inputNombre.value = ""
    inputPrecioPorHora.value = ""
    inputCantidadHorasOferta.value = ""
    inputPrecioOferta.value = ""
})

btnBorrarArtista.addEventListener("click", () => {
    borrarArtista(catalogo, inputIdArtistaAEliminar.value)
    inputIdArtistaAEliminar.value = ""
})

btnAgregarAlCarrito.addEventListener("click", () => {
    agregarAlCarrito(catalogo, productosCarrito, inputIdArtistaAgregarCarrito.value, inputCantidadHorasContrato.value)
    inputIdArtistaAgregarCarrito.value = ""
    inputCantidadHorasContrato.value = ""
})

btnCarrito.addEventListener("click", () => {
    mostrarCarrito(productosCarrito)
})

btnFinalizarCompra.addEventListener("click", () => {
    finalizarCompra(productosCarrito)
})

mostrarCatalogo(catalogo)