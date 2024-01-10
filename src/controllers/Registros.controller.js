import conexion from "../config/db.js";



export const findAllRegistro = async (req,res)=>{
    try {
        
        const consultaSql = "select * from registro INNER join personal on registro.dniPersonal = personal.dniPersonal";
        const [registro] = await conexion.query(consultaSql);
        res.json({data:registro});
    } catch (error) {
        res.json({message:error.message});
    }
}


export const updateRegistro = async (req,res)=>{
    try {
      
        const {id} = req.params;
        const {fcRegistro,hdeRegistro,hdsRegistro,estRegistro,dniPersonal , obsRegistro} = req.body;
        const dataPersonal = await verificarPersonal(dniPersonal);
        const dataRegistro = await verificarRegistro(id);
     
         if((!dataPersonal.status) || (!dataRegistro.status) ){
            return res.json({status:false}).status(404);
        }
        const consultaSql = "update registro set fcRegistro = ?,hdeRegistro = ?,hdsRegistro = ?,estRegistro = ?,obsRegistro = ?, dniPersonal=? where idRegistro = ?";
        await conexion.query(consultaSql,[fcRegistro,hdeRegistro,hdsRegistro,estRegistro,obsRegistro,dniPersonal,id])
        res.status(204).send("");  
    } catch (error) {
        res.json({message:error.message});

    }
}

export const deleteRegistro = async (req,res)=>{
    try {
       
        const {id} = req.params;
        const data = await verificarRegistro(id);
        if(data.status){
            const consultaSql = "delete from registro where idRegistro = ?";
            await conexion.query(consultaSql,[id]);
            res.status(204).send("");
        }else{
            res.json({status:false}).status(404);
        }
    } catch (error) {
        res.json({message:error.message});
    }
}


//implementacion de busquead
export const findByIdRegistro = async(req,res)=>{
    try {
       
        const {id} = req.params;
        const registro = await verificarRegistro(id);
        if(registro.status){
            return res.json(registro.data);
        }else{
            return res.json({status:false}).status(404);
        }
    } catch (error) {
        res.json({message:error.message});
    }
}


export const insertRegistro= async(req,res) =>{
    try {
        const {fcRegistro,hdeRegistro,hdsRegistro,estRegistro,dniPersonal,obsRegistro}=req.body;
        const consultaSql = "insert into registro (fcRegistro,hdeRegistro,hdsRegistro,estRegistro,dniPersonal,obsRegistro,hdtRegistro) values(?,?,?,?,?,?,?)";
        const data = await verificarPersonal(dniPersonal);
        if(data.status){
            await conexion.query(consultaSql,[fcRegistro,hdeRegistro,hdsRegistro,estRegistro,dniPersonal,obsRegistro,"00:00:00"]);
           return res.status(204).send("");
        }else{
            return res.json({status:false}).status(404);
        }
    } catch (error) {
        res.json({message:error.message});
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


const verificarRegistro = async (id)=>{
    try {
        const consultaSql = "select * from registro where idRegistro = ?"; 
        const [registro] = await conexion.query(consultaSql,[id]);
        if(registro[0]){
            return {status:true, data:registro[0]};   
        }else {
            return {status:false, data:'registro no identificado'};   
        }
    } catch (error) {
        return {data:false , data:error.message}
    }
}

