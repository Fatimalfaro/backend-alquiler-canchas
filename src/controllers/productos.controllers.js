import Producto from "../models/producto.js";
import subirImagenACloudinary from "../utils/cloudinaryUploader.js";

export const agregarProducto = async (req, res) => {
    try {
        let imagenUrl = "";
        if(req.file){
            const resultado = await subirImagenACloudinary(req.file.buffer);
            imagenUrl = resultado.secure_url;
        }else{
            imagenUrl = "https://images.pexels.com/photos/9853347/pexels-photo-9853347.jpeg";
        }
        const nuevoProductoData = {
            ...req.body,
            imagen: imagenUrl,
        };

        const producto = new Producto(nuevoProductoData);
        await producto.save();

        res.status(201).json({ message: 'Producto agregado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar agregar un producto' });
    }
}

export const listarProductos = async (req, res) => {
    try {
        const { termino, pagina, limite } = req.query;
        const numeroPagina = parseInt(pagina)
        const cantProductos = parseInt(limite) 
        const salto = (numeroPagina - 1) * cantProductos;


        const query = {}

        if (termino) {
            query.nombreProducto = { $regex: termino, $options: 'i' };
            }

        const [productos, cantidadProductos] = await Promise.all([
            Producto.find(query).populate("categoria", "nombreCategoria").skip(salto).limit(cantProductos),
            Producto.countDocuments(query)
        ]);


        res.status(200).json({ productos, cantidadProductos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar listar los productos' });
    }
}

export const buscarProductoPorID = async (req, res) => {
    try {
        const productoBuscado = await Producto.findById(req.params.id);
        if (!productoBuscado) {
            return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
        }
        res.status(200).json(productoBuscado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar buscar un producto por id' });
    }
}

export const borrarProductoPorID = async (req, res) => {
    try {
        const productoBorrado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoBorrado) {
            return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
        }
        res.status(200).json({ message: 'El producto se elimino correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar borrar un producto por id' });
    }
}

export const editarProductoPorID = async (req, res) => {
    try {

        const { id } = req.params;
        const productoExistente = await Producto.findById(id);
        if (!productoExistente) {
            return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
        }
        
        let imagenUrl = productoExistente.imagen; 
        
        if (req.file) {
            const resultado = await subirImagenACloudinary(req.file.buffer);
            imagenUrl = resultado.secure_url;
        }

        const datosActualizados = {
            ...req.body,
            imagen: imagenUrl,
        };

        const productoEditado = await Producto.findByIdAndUpdate(req.params.id, datosActualizados, { new: true });
        if (!productoEditado) {
            return res.status(404).json({ message: 'No se encontro un producto con el ID enviado' });
        }
        res.status(200).json({ message: 'El producto se actualizo correctamente', producto: productoEditado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar editar un producto por id' });
    }
}