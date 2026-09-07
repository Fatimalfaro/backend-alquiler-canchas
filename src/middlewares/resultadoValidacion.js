import {validationResult} from "express-validator";

export const resultadoValidacion = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    next();
};

export default resultadoValidacion;