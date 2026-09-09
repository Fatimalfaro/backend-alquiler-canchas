import cloudinary from "./cloudinary";

/**
 * @param {Buffer} buffer
 * @returns {Promise<Object>}
 */

const subirImagenACloudinary = (buffer) =>{
    return new Promise ((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream({folder: 'imagenes-cancha'}, (error, result)=>{
            if(result){
                resolve(result)
            }else{
                reject(error)
            }
        })
        stream.end(buffer)
    })
}

export default subirImagenACloudinary