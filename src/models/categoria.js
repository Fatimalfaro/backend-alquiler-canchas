import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    nombreCategoria: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 100,
        trim: true
    },
},
{
    timestamps: true,
}
);

const Categoria = mongoose.model('categoria', categoriaSchema);

export default Categoria;