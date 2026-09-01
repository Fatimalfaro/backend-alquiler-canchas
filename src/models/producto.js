import mongoose, {Schema} from "mongoose";

const productoSchema = new Schema({
  nombreProducto: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    trim: true
  },
  precio: {
    type: Number,
    required: true
  },
  imagen:{
    type: String,
    required: true,
    validate:{
        validator:(valor) => {
             return /^https:\/\/.+\.(jpg|jpeg|png|webp|avif|svg)$/.test(valor);
        }
    }

  },
  categoria:{
    type: String,
    required: true,
    enum: ["Indumentaria deportiva", "Calzado", "Accesorios deportivos", "Pelotas", "Bebidas", "Snacks"]
  }
},
{
  timestamps: true
});

const Producto = mongoose.model("producto", productoSchema);

export default Producto