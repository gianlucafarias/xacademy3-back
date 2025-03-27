import { sequelize } from "../../config/dbConfig";
import seedDatabase from "./seed";

const runSeed = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Base de datos sincronizada");

    // Ejecutar el seed
    await seedDatabase();
  } catch (error) {
    console.error("Error al ejecutar el seed:", error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
  }
};

runSeed(); 