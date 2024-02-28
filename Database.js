import mongoose from "mongoose";

class Database {
    static async  connect() {
        try {
            await mongoose.connect(process.env.DB_CONNECTION_STRING);
            console.log("Подключение к базе данных успешно")
        } catch(e) {
            console.log("Ошибка подключения к базе данных");
            console.log(e);
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log("Соединение с базой данных отключено")
        } catch(e) {
            console.log("Ошибка отключения соединения с базой данных");
            console.log(e);
        }
    }
}

export default Database;