const socket = io.connect();

//------------------------------------------------------------------------------------


socket.on('producto', async products => {
    const html = await makeHtmlTable(products)
    console.log(html);
    document.getElementById('producto').innerHTML =  html
});

function  makeHtmlTable(products) {
    return fetch('../plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ products })
            return html
        })
}

function addProducto(e)  {
    const productos = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('new-producto', productos);
    const formPublicarProducto = document.getElementById('formPublicarProducto')
    formPublicarProducto.reset()
    return false;
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

socket.on('mensaje', async mensajes => {
    console.log(mensajes);
    const html = await makeHtmlList(mensajes)
    document.getElementById('mensaje').innerHTML = html;
})

function makeHtmlList(mensajes) {
    const html = mensajes.map(elem => {
        return (`<div><strong>${elem.email}</strong><span style="color:brown";> ${elem.date}</span> :<i style="color:green;"> ${elem.text}</i></div>`)
    }).join(" ");
    return  html;
}

function addMensaje(e)  {
    const hoy = new Date().toLocaleDateString('es-AR', { year:"numeric", month:"numeric", day:"numeric" ,hour:"2-digit" ,minute:"2-digit" ,second:"2-digit"}) 
    const mensaje = {
        email: document.getElementById('inputUsername').value,
        date: hoy,
        text: document.getElementById('inputMensaje').value
    };
    socket.emit('new-mensaje', mensaje);
    const formPublicarMensaje = document.getElementById('formPublicarMensaje')
    formPublicarMensaje.reset()
    return false;
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})