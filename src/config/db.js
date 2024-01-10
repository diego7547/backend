import {createPool} from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


const conexion = createPool(
    {
        host:process.env.HOST,
        port:process.env.PORTDB,
        user:process.env.USERDB,
        password:process.env.PASSWORD,
        database:process.env.DB,
        
    }
);




export default conexion;
