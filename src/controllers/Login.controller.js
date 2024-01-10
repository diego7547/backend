import e from "express";
import conexion from "../config/db.js";
import jwt  from 'jsonwebtoken';

const secret = process.env.KEY_TOKEN;
const expired = process.env.EXP_TOKEN;


 export const login = async (req,res)=>{
    try {
        const {username,password} = req.body;
        if(username === password){
            const consultaSql = "select * from personal where dniPersonal = ?";
            const [data] = await conexion.query(consultaSql,[username]);
            const rolPersonal =data[0].rolPersonal;
            if(rolPersonal === "DIRECTOR" || rolPersonal === "ADMINISTRACION"){
                const token = jwt.sign({id:data[0].nomPersonal},secret,{expiresIn:expired});
                return  res.json({token,status:true}); 
            } else{
                return  res.json({status:false}).status(404);
            }
        }else{
            return  res.json({status:false}).status(404);
        }
    } catch (error) {
        res.json({message:error.message});
    }
    
    
   
} 


export const verificarToken = (req,res)=>{

    try {
        const {token} = req.body;
     if(!token){
            return res.json({status:false}).status(404);
        }
     const payload = jwt.verify(token,secret);
     const expiracion = payload.exp * 1000 ;
    if(Date.now() > expiracion) return res.json({status:false}).status(404);
     return   res.json({status:true});
     
      
    } catch (error) {
        res.json({status:false}).status(404);
    }
}


