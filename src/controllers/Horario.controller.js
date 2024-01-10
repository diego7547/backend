import conexion from "../config/db.js";


export const createHorario = async  (req,res)=>{
    try {
        const {hdiHorario,hdsHorario,dniPersonal,dsHorario} = req.body;
        const data  =await verificarPersonal(dniPersonal);  
        const horarioUnique= await verficarHorarioAndPersonal(dniPersonal ,dsHorario);
           
         if(data.status){
            if(horarioUnique.status){
                res.json({data:"El horario ya esta registrado",status:false}).status(404);
            }else{
                const consultaSql ="insert into horario_laboral (hdiHorario,hdsHorario,dniPersonal,dsHorario) values(?,?,?,?)";
               await conexion.query(consultaSql,[hdiHorario,hdsHorario,dniPersonal,dsHorario]);
               res.status(201).send(""); 
            }
        }else{
            res.json({status:false}).status(404);
        } 
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}



export const getAllHorario = async (req,res)=>{
    try {
        const consultaSql = "SELECT * FROM horario_laboral INNER join personal on horario_laboral.dniPersonal = personal.dniPersonal ";
        const [horario] = await conexion.query(consultaSql);
        res.status(200).json(horario);

    } catch (error) {
        res.status(404).json({message:error.message});
    }
}


export const updateHorario = async (req, res)=>{
    try {
        const {id} = req.params;
        const {hdiHorario,hdsHorario,dniPersonal, dsHorario}=req.body;
       
        const personal = await verificarPersonal(dniPersonal);
        const horario = await verificarHorario(id);
        
         if((!personal.status) || (!horario.status) ){
            return res.json({status:false}).status(404);
        }
        const consultarData = "update horario_laboral set hdiHorario = ?, hdsHorario =? ,dniPersonal =? , dsHorario =? WHERE idHorario = ? ";
        await conexion.query(consultarData ,[hdiHorario,hdsHorario,dniPersonal,dsHorario,id]);
        res.status(204).send("");  
    } catch (error) {
        res.json({message:error.message});
    }
}

export const findOneHorario = async ( req,res)=>{
    try {
        const {id} = req.params;
      
        const consultaSql2 = "select * from horario_laboral where idHorario = ?";
        const [horario] = await conexion.query(consultaSql2,[id]);
        if(!horario[0]){
            return res.status(404).send("");
        }
       const consultarData = "SELECT * FROM horario_laboral INNER join personal on horario_laboral.dniPersonal = personal.dniPersonal WHERE horario_laboral.idHorario = ? ";
       const [data] = await conexion.query(consultarData,[id]);
        res.json(data[0]);      
    } catch (error) {
        res.json({message:error.message});
    }
}




export const deleteHorario  = async (req,res)=>{
    try {
        const {id} = req.params;
        const data = await verificarHorario(id);
        if(data.status){
            const consultaSql = "delete from horario_laboral where idHorario = ?";
            await conexion.query(consultaSql,[id]);
            res.status(204).send("");
        }else
        {
            res.json(data);
        }
    } catch (error) {
        
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

// verifica si el horario existe
const verificarHorario = async (horario)=>{
    try {
        const consultaSql = "select * from horario_laboral where idHorario = ?"; 
        const [data] = await conexion.query(consultaSql,[horario]);
        if(data[0]){
            return {status:true, data:data[0]};   
        }else {
            return {status:false, data:'horario no identificado'};   
        }
    } catch (error) {
        return {data:false , data:error.message}
    }
}

const verficarHorarioAndPersonal=async (dniPersonal, diaSemana)=>{
    try {
        const consultaSql = "select * from horario_laboral where dniPersonal= ? and dsHorario = ?"; 
        const [data] = await conexion.query(consultaSql,[dniPersonal,diaSemana]);
        if(data[0]){
            return {status:true };   
        }else {
            return {status:false };   
        }
    } catch (error) {
        return {data:false , data:error.message}
    }
}