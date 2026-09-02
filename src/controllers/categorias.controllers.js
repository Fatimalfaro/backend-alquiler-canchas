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