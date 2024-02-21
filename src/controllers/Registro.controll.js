import conexion from "../config/db.js";
import moment from "moment";
import momentZ from "moment-timezone";

let dia = "";

const diasSemana = {
    Sunday: 'DOMINGO',
    Monday: 'LUNES',
    Tuesday: 'MARTES',
    Wednesday: 'MIERCOLES',
    Thursday: 'JUEVES',
    Friday: 'VIERNES',
    Saturday: 'SABADO'
};



// registro de entrada
export const registro = async (req, res) => {
    try {
        const zonaHorariaDeseada = "America/Lima";
        const { dniPersonal } = req.body;
        // comprobar si el pesonal existe
        const statusPersonal = await verificarPersonal(dniPersonal);
        // comporbar si el personal tiene un jornada laboral 
        const statusHorarioLaboral = await verificarJornadaLaboral(dniPersonal);
        // comprobar si el personal no registro su asistencia de entrada
        const statusRegistro = await verificarRegistroPersonal(dniPersonal);
        const statusSalida = await verificarSalidaPersonal(dniPersonal);
        // fecha actual - zona horaria lima/peru
        
        // Obtener la fecha actual en la zona horaria deseada
        const fechaActual = moment().tz(zonaHorariaDeseada).format('YYYY-MM-DD');
        const tiempoActual = moment().tz(zonaHorariaDeseada).format('H:mm:ss');

        const fecha1 = moment().tz(zonaHorariaDeseada).format('YYYY-MM-DD H:mm:ss')
        
        const fecha2 = moment().tz(zonaHorariaDeseada).format('YYYY-MM-DD')
        const tiempoInicioLaburo = moment((statusHorarioLaboral.time || '00:00:00'), 'H:mm:ss').format('H:mm:ss');
        // obtener la hora de tardanza

        const momento1 = moment(new Date(fecha1));
        const momento2 = moment(new Date(`${fecha2} ${tiempoInicioLaburo}`));
        const diferenciaEnMilisegundos = momento2.diff(momento1);

        // Obtener la diferencia en un formato específico (por ejemplo, horas y minutos)
        const duracion = moment.duration(diferenciaEnMilisegundos);
        let tiempoDeTardanza = '';
        if((duracion.hours() < 0 ) || (duracion.minutes() < 0) || (duracion.seconds() < 0)){
            const diferenciaEnHoras = ((Math.abs(duracion.hours()) <= 9)) ? `0${Math.abs(duracion.hours())}`:`${Math.abs(duracion.hours())}`;
            const diferenciaEnMinutos =  ((Math.abs(duracion.minutes()) <= 9))?`0${Math.abs(duracion.minutes())}`:`${Math.abs(duracion.minutes())}`;
            const diferenciaEnSegundos = ((Math.abs( duracion.seconds()) <= 9)) ? `0${Math.abs( duracion.seconds())}`:`${Math.abs( duracion.seconds())}`;
             tiempoDeTardanza = `${diferenciaEnHoras}:${diferenciaEnMinutos}:${diferenciaEnSegundos}`;
        }else{
            tiempoDeTardanza = '00:00:00';
        }
        
        
        if (statusPersonal.status) {
            
            if (statusHorarioLaboral.status) {
                if(!statusSalida.status){
                    if(!statusRegistro.status){
                        const sql = "insert into registro (	fcRegistro,hdeRegistro,estRegistro,dniPersonal ,hdtRegistro,hdsRegistro,obsRegistro) values(?,?,?,?,?,?,?)";
                       await conexion.query(sql,[fechaActual,tiempoActual,'PRESENTE',dniPersonal,tiempoDeTardanza,'00:00:00',''])
                        res.json({status:true, data: 'Registro de entrada exitosamente !!! ' })
                    }else{
                        res.json({ data: 'No puede registrar su asistencia de entrada nuevamente', status: false }).status(404)
                    }
                }else{
                    res.json({ data: 'Actualmente ya se encuentra registrado', status: false }).status(404)

                }
            } else {
                res.json({ data: 'Actualmente no tiene un horario establecido', status: false }).status(404)
            }
        } else {
            res.json({
                data: 'Personal no identificado',
                status: false
            }).status(404);
        }
    } catch (error) {
        res.json({ message: error.message }).status(404)
    }
}

// registro de salida
export const finalizar = async (req, res) => {
    try {
        const zonaHorariaDeseada = "America/Lima";
        const {dniPersonal} = req.body;
        // verificar si el personal existe 
        const statusPersonal = await verificarPersonal(dniPersonal);
        // comporbar si el personal tiene un jornada laboral 
        const statusHorarioLaboral = await verificarJornadaLaboral(dniPersonal);
         // comprobar si el personal  registro su asistencia de entrada
         const statusRegistro = await verificarRegistroPersonal(dniPersonal);
         // comprobar si el personal no registro su salida
         const statusSalida = await verificarSalidaPersonal(dniPersonal);
        
         // Obtener la fecha actual en la zona horaria deseada
         const fechaActual = moment().tz(zonaHorariaDeseada).format('YYYY-MM-DD');
         const tiempoActual = moment().tz(zonaHorariaDeseada).format('H:mm:ss');

         if(statusPersonal.status){
            if(statusHorarioLaboral.status){
                if(!statusSalida.status){
                    if(statusRegistro.status){
                        const consultaSql = "update registro set hdsRegistro = ? ,estRegistro = ? where dniPersonal = ? and  fcRegistro = ?";
                        await conexion.query(consultaSql,[tiempoActual,'FINALIZO',dniPersonal,fechaActual]);
                        res.json({ data: 'Registro de salida exitosamente !!!', status: true })
                    }else{
                        res.json({ data: 'Debe de registrar su asistencia de entrada', status: false }).status(404)

                    }
                    
                }else{
                    res.json({ data: 'No puede registrar su asistencia de salida nuevamente', status: false }).status(404)
                }

            }else {
                res.json({ data: 'Actualmente no tiene un horario establecido', status: false }).status(404)
            }
         }else {
            res.json({
                data: 'Personal no identificado',
                status: false
            }).status(404);
         }
        
    } catch (error) {
        res.json({ message: error.message }).status(404)
    }
}



















// identificacion del personal 
const verificarPersonal = async (dniPersonal) => {
    try {
        const zonaHorariaDeseada = "America/Lima";
        const consultaSql = "select * from personal where dniPersonal = ?";
        const [data] = await conexion.query(consultaSql, [dniPersonal]);
        if (data[0]) return { status: true };
        return { status: false };
    } catch (error) {
        return error.message
    }
}


// verificar jornada laboral
const verificarJornadaLaboral = async (dniPersonal) => {
    try {
        const zonaHorariaDeseada = "America/Lima";
        const diaActual = moment().format('dddd');
        dia = diasSemana[diaActual];
        
        const consultaSql = "select * from horario_laboral where dniPersonal = ? and dsHorario = ? ";
        const [data] = await conexion.query(consultaSql, [dniPersonal, dia]);
        if (data[0]) return { status: true, time: data[0]['hdiHorario'] }
        return { status: false }
    } catch (error) {
        return {
            status: false
        }
    }
}

// verificar si el registro existe actualmente
const verificarRegistroPersonal = async (dniPersonal)=>{
    try {
        const zonaHorariaDeseada = "America/Lima";
        const consultaSql = "select * from registro where fcRegistro = ? and estRegistro = ? and dniPersonal = ?";
        const fechaActual = moment().tz(zonaHorariaDeseada).format('YYYY-MM-DD');
        
        const [dataRegistro] = await conexion.query(consultaSql,[fechaActual.toString(), 'PRESENTE',dniPersonal]);
        if(dataRegistro[0]) return {status:true}
        return {status:false}
    } catch (error) {
        return {
            status: false
        }
    }
}

const verificarSalidaPersonal = async (dniPersonal)=>{
    try {
        const zonaHorariaDeseada = "America/Lima";
        const consultaSql = "select * from registro where fcRegistro = ? and estRegistro = ? and dniPersonal = ?";
        const fechaActual = moment().tz(zonaHorariaDeseada).format('YYYY-MM-DD');
        
        const [dataRegistro] = await conexion.query(consultaSql,[fechaActual.toString(), 'FINALIZO',dniPersonal]);
        if(dataRegistro[0]) return {status:true}
        return {status:false}
    } catch (error) {
        return {
            status: false
        }
    }
}