import {createPool} from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


const conexion = createPool(
    {
         host:"bisy3qicxxv5-mysql.services.clever-cloud.com",
        port:"3306",
        user:"u7exgb84k",
        password:"vEhnK7T9KQSfshR",
        database:"bisy3vus6cp8hqic", 
       /*  host:"localhost",
        port:"3306",
        user:"root",
        password:"",
        database:"colegio2", */
    }
);




export default conexion;
