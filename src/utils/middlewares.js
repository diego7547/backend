import jwt from "jsonwebtoken";

const secret = process.env.KEY_TOKEN;


export const checkToken = (req,res,next)=>{

        
        if(!req.headers['authorization']){
            return res.status(404).send(" ");
        }   
        try {
            const token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token,"c1gpH4CXS460beN28skBV6zSR0Gf57raqM2SZwAP5xM=");
            const expiracion = payload.exp ;    
            if(!expiracion)  return res.status(404).send("");

       
    } catch (error) {
        return res.status(404).send("token invalido");
    }
    next();
}

