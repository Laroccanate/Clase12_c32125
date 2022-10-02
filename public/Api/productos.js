const {promises:fs } = require('fs')

class ProductosApi {
    constructor(ruta) {
        this.productos = []
        this.id = 0
        this.ruta = ruta
    }

    async listar(id) {
        const products = await this.listarAll();
        const productById = products.find(p => p.id === id);
        console.log(`Muestro el producto id ${id}`);
        return productById;
    }

    async listarAll() {

        try{
            const products = await fs.readFile(this.ruta , 'utf-8')
            return JSON.parse(products);
        }catch(error){
            console.log(this.ruta);
            console.log('hubo un error en getAll')
            return [];
        }
        
    }

    async guardar(obj) {

        const products = await this.listarAll();

        products.push(obj);
        products.length === 0 ? obj.id = 1 : obj.id = products.length

        try{
            fs.writeFile(this.ruta,JSON.stringify(products , null , 2) )
            console.log("se agrego el item correctamente");
            console.log(obj);
        }catch(error){
            console.log('hubo un error en Save')
            return [];
        }
        
    }

    async actualizar(prod, id) {
        const products = await this.listarAll();
        let productById = products.filter(p => p.id !== id);
        const oldProduct = products.find(p => p.id === id);
        console.log(`Muestro el producto anterior ${JSON.stringify(oldProduct)} `);
        productById.push(prod);
        productById.sort((a, b) => (a.id > b.id ? 1 : -1))
        try{
        fs.writeFile(this.ruta,JSON.stringify(productById , null , 2) )
        console.log(`Muestro el producto actualizado ${JSON.stringify(prod)}`);
        return productById;
        }catch(error){
            console.log('hubo un error en actualizar')
            return [];
        }
        
    }

    async borrar(id) {

        try{
            const products = await this.listarAll();
            const productById = products.filter(p => p.id !== id);
            fs.writeFile('productos.txt',JSON.stringify(productById , null , 2))
            console.log(`Se elimino el producto con id ${id} Correctamente`)
            return productById;
            }catch(error){
            console.log('hubo un error en deleteById')
            return [];
            }
        
    }
}

module.exports = ProductosApi