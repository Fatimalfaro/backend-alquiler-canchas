import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        unique: true,
    },
    items: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: "producto"
        },
        cantidad: {
            type: Number,
            default: 1
        }
    }]
},
{
    timestamps: true,
});

const Carrito = mongoose.model('carrito', carritoSchema);

export default Carrito;