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
        uri:"mysql://u7exgb84kaqt9ci0:vEhnK7T9KQSfshRffF2E@bisy3vus6cp8hqicxxv5-mysql.services.clever-cloud.com:3306/bisy3vus6cp8hqicxxv5"
    }
);




export default conexion;
