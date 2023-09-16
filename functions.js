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

    // Método para mostrar la información del artista en un párrafo
    mostrarArtista() {
        console.log(`El nombre del artista es ${this.nombre}, el precio por hora para contratarlo es de ${this.precioPorHora} ¡¡Y tiene una oferta especial por contratarlo en nuestra página: ${this.cantidadHorasOferta} horas por sólo ${this.precioOferta}!!`)
    }

    // Método para mostrar la información del artista en un catálogo
    mostrarEnCatalogo() {
        console.log(`ID: ${this.id} || Nombre: ${this.nombre} || Precio por hora: ${this.precioPorHora} || Oferta especial: ${this.cantidadHorasOferta} horas por ${this.precioOferta}`)
    }
}

// Arrays de objetos
const catalogo = []
const productosCarrito = []

// Función para mostrar el catálogo
function mostrarCatalogo(array){
    console.log("Nuestro catálogo de artistas es: ")
    for(let artista of array){
        artista.mostrarEnCatalogo()
    }
}

// Función para agregar un artista a la página y al catálogo, ej: Artista(1, "Juan", 2000, 3, 5000)
function agregarArtista() {
    let nombre = prompt(`Ingrese el nombre del artista:`)
    let precioPorHora = parseInt(prompt(`Ingrese el precio por hora para poder contratar a ${nombre}:`))
    let cantidadHorasOferta = parseInt(prompt(`Ingrese la cantidad de horas por la oferta especial de ${nombre}:`))
    let precioOferta = parseInt(prompt(`Ingrese el precio por la oferta especial de ${nombre}:`))
    // Instanciar al artista en un objeto y agregarlo al catálogo
    const nuevoArtista = new Artista(catalogo.length+1, nombre, precioPorHora, cantidadHorasOferta, precioOferta)
    catalogo.push(nuevoArtista) 
}

// Función para borrar un artista (en caso de que ya no forme parte de nuestra página)
function borrarArtista(array){
    mostrarCatalogo(array)
    let idEliminar = parseInt(prompt("Observar el catalogo en consola y seleccionar ID a eliminar"))
    let coincidencia = false
    for(let elem of array){
        if(elem.id == idEliminar){
            let indice = array.indexOf(elem)

            array.splice(indice, 1)
            mostrarCatalogo(array)
            coincidencia = true
        }
    }
    if(!coincidencia){
            console.log(`¡¡ERROR!! El id ${idEliminar} no coincide con ningún artista de nuestro catálogo. No se pudo eliminar`)  
    }
}

// Función para poder agregar contrato(s) al carrito
function agregarAlCarrito(stock, carrito){
    mostrarCatalogo(stock)
    let idArtista = parseInt(prompt(`Ingrese el id del artista que desea contratar:`))
    let cantidadHoras = parseInt(prompt(`Ingrese la cantidad de horas que desea contratar al artista:`))
    let precioFinal = 0
    let artistaContratado = stock.find(
        (artista) => artista.id == idArtista 
    )
    // Definir si la cantidad de horas a contratar aplica para la oferta o no y calcular el precio final en base a la cantidad de horas
    if(cantidadHoras >= artistaContratado.cantidadHorasOferta) {
        console.log(`¡¡¡¡Aplica oferta!!!!`)
        precioFinal = parseInt((Math.trunc(cantidadHoras / artistaContratado.cantidadHorasOferta) * artistaContratado.precioOferta) 
        + ((cantidadHoras % artistaContratado.cantidadHorasOferta) * artistaContratado.precioPorHora))
    } else if (cantidadHoras < artistaContratado.cantidadHorasOferta) {
        precioFinal = (cantidadHoras * artistaContratado.precioPorHora)
    }

    artistaContratado.precioFinal = precioFinal
    carrito.push(artistaContratado)
    console.log(carrito)
}

// Función para finalizar la compra
function finalizarCompra(carrito){
    const totalReduce = carrito.reduce(
        (acc, elemento)=>
        {return acc + elemento.precioFinal},
        0
    )
    console.log(`El total de su compra es ${totalReduce}. Muchas gracias!`)

    carrito = []
}

function mostrarUnArtista(catalogo) {
    mostrarCatalogo(catalogo)
    let artistaSeleccionado = parseInt(prompt("Ingresar ID del artista a mostrar:"))
    let artistaEncontrado = catalogo.find(
        (artista) => artista.id == artistaSeleccionado 
    )
    artistaEncontrado.mostrarArtista()
}

// Ejemplos de artistas para probar las opciones sin tener que crearlos cada vez
artista1 = new Artista(1, "Juan", 2000, 3, 5000)
artista2 = new Artista(2, "María", 4000, 4, 14000)
artista3 = new Artista(3, "Gustavo", 1000, 5, 3000)

catalogo.push(artista1, artista2, artista3)

// Función menú para que el usuario elija las opciones que crea necesarias
function menu() {
    let salirDelMenu = false
    do {
        let opcion = parseInt(prompt(`
        1. Agregar artista
        2. Borrar artista
        3. Mostrar catálogo de artistas
        4. Agregar al carrito
        5. Finalizar compra
        6. Mostrar un artista

        0. Salir del menú
        Ingrese la opción que desea:`))

        switch(opcion) {
            case 1:
                agregarArtista()
                break
            
            case 2:
                borrarArtista(catalogo)
                break

            case 3:
                mostrarCatalogo(catalogo)
                break

            case 4:
                agregarAlCarrito(catalogo, productosCarrito)
                break

            case 5:
                finalizarCompra(productosCarrito)
                break

            case 6:
                mostrarUnArtista(catalogo)
                break
            
            case 0:
                salirDelMenu = true
                break
        }
    } while (!salirDelMenu)
}

menu()

alert(`¡¡Gracias por usar nuestra página para consultar y contratar artistas!!`)