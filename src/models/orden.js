import mongoose, {Schema} from "mongoose";

const ordenSchema = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        ref:"usuario",
        required: true
    },

    items: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: "producto",
                required: true,
            },
            nombreProducto: {
                type: String,
                required: true,
            },
            precioUnitario: {
                type: Number,
                required: true,
            },
            cantidad: {
                type: Number,
                default: 1,
                min: 1,
            },
        },
    ],

    montoTotal:{
        type: Number,
        required: true,
    },

    estado: {
        type: String,
        enum: ["pendiente", "aprobada", "rechazada" ,"cancelada"],
        default: "pendiente"
    },

    preferenceId: {
        type: String
    },

    paymentId: {
        type: String
    },
},
{
    timestamps: true,
});

const Orden = mongoose.model('orden', ordenSchema)

export default Orden;