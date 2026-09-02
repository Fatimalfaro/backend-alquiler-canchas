import Categoria from "../models/categoria.js";

export const crearCategoria = async (req, res) => {
    try{
        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save();
        res.status(201).json({ message: 'Categoria creada exitosamente' });
       
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar crear una categoria' });
    }
}
export const listarCategorias = async (req, res) => {
    try{
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar listar las categorias' });
    }
}

export const buscarCategoriaPorID = async (req, res) => {
    try{
        const categoriaBuscada = await Categoria.findById(req.params.id);
        if(!categoriaBuscada){
            return res.status(404).json({ message: 'Categoria no encontrada' });
        }
        res.status(200).json(categoriaBuscada);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar buscar la categoria' });
    }
}

export const borrarCategoriaPorID = async (req, res) => {
    try{
        const categoriaBorrada = await Categoria.findByIdAndDelete(req.params.id);
        if(!categoriaBorrada){
            return res.status(404).json({ message: 'Categoria no encontrada' });
        }
        res.status(200).json({ message: 'Categoria eliminada exitosamente' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar eliminar la categoria' });
    }
}

export const editarCategoriaPorID = async (req, res) => {
    try{
        const categoriaEditada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!categoriaEditada){
            return res.status(404).json({ message: 'Categoria no encontrada' });
        }
        res.status(200).json(categoriaEditada);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Ocurrio un error al intentar editar la categoria' });
    }
}
