import {createPool} from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


const conexion = createPool(
    {
        host:"bisy3vus6cp8hqicxxv5-mysql.services.clever-cloud.com",
        port:"3306",
        user:"u7exgb84kaqt9ci0",
        password:"vEhnK7T9KQSfshRffF2E",
        database:"bisy3vus6cp8hqicxxv5",
        
    }
);




export default conexion;
