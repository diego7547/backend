import conexion from "../config/db.js";


export const createPersonal = async (req,res)=>{
    try {
        const {dniPersonal,nomPersonal,apePersonal,direcPersonal,telPersonal,fnacPersonal,rolPersonal} = req.body;
        const consultaSql = "insert into personal (dniPersonal,nomPersonal,apePersonal,direcPersonal,telPersonal,fnacPersonal,rolPersonal) values (?,?,?,?,?,?,?)"
        const data = await verificarPersonal(dniPersonal); 
        if(data.status){
            return res.json({status:false}).status(404);
        }else{
            await conexion.query(consultaSql,[dniPersonal,nomPersonal,apePersonal,direcPersonal,telPersonal,fnacPersonal,rolPersonal]);
            res.status(204).send(""); 
        }
    } catch (error) {
        res.json({message:error.message});
    }
}


export const findAllPersonal = async (req,res)=>{
    try {
        const consultaSql = "select * from personal";
        const [personal] = await conexion.query(consultaSql);
        res.json(personal);
    } catch (error) {
        res.json({message:error.message});
    }
}


export const updatePersonal = async (req,res)=>{
    try {
        const {dni} = req.params;
        const {nomPersonal,apePersonal,direcPersonal,telPersonal,fnacPersonal,rolPersonal} = req.body;
        const data = await verificarPersonal(dni);
        if(data.status){
            const consultaSql = "update personal set nomPersonal = ? ,apePersonal=?,direcPersonal = ?,telPersonal = ?,fnacPersonal = ?,rolPersonal = ?  where dniPersonal = ?";
            await conexion.query(consultaSql,[nomPersonal,apePersonal,direcPersonal,telPersonal,fnacPersonal,rolPersonal,dni]);
            return  res.status(204).send("");
        }else{
            return res.json({status:false}).status(404);
        }
     
      
    } catch (error) {
        res.json({message:error.message});
    }
}


export const deletePersonal = async (req,res)=>{
    try {
        const {dni} = req.params;
        const data = await verificarPersonal(dni);
        if(data.status){
            const consultaSql = "delete from personal where dniPersonal = ?";
            await conexion.query(consultaSql,[dni]);
           return  res.status(204).send("");
        }

        return res.status(404).send("");
        
    } catch (error) {
        res.json({message:error.message});
    }
}

export const getPersonalByDni = async (req,res)=>{
    try {
       
        const {dni} = req.params;
        const personal = await verificarPersonal(dni);
        if(personal.status){
           return  res.json(personal.data);
        }
        return res.status(404).send("");
        
    } catch (error) {
        res.json({status:false}).status(404);
    }
}

// verificar si el pesonal existe
const verificarPersonal = async (dniPersonal)=>{
    try {
        const consultaSql = "select * from personal where dniPersonal = ?"; 
        const [personal] = await conexion.query(consultaSql,[dniPersonal]);
        if(personal[0]){
            return {status:true, data:personal[0]};   
        }else {
            return {status:false, data:'personal no identificado'};   
        }
    } catch (error) {
        return {data:false , data:error.message}
    }
}

