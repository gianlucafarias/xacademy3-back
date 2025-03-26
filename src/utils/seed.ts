import { sequelize } from "../../config/dbConfig";
import User from "../models/User";
import Teacher from "../models/Teacher";
import CoursesCategory from "../models/CoursesCategory";
import Courses from "../models/Courses";
import Class from "../models/Class";
import Student from "../models/Student";
import News from "../models/News";
import Payment from "../models/Payment";
import Inscription from "../models/Inscription";
import Assist from "../models/Assist";
import Certificate from "../models/Certificates";
import { Optional } from "sequelize";
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    // Crear categorías de cursos
    const categories = await Promise.all([
      CoursesCategory.create({ title: "Programación" }),
      CoursesCategory.create({ title: "Diseño Gráfico" }),
      CoursesCategory.create({ title: "Marketing Digital" }),
      CoursesCategory.create({ title: "Administración" }),
      CoursesCategory.create({ title: "Oficios" }),
      CoursesCategory.create({ title: "Gastronomía" }),
      CoursesCategory.create({ title: "Idiomas" }),
      CoursesCategory.create({ title: "Salud" }),
      CoursesCategory.create({ title: "Música" }),
      CoursesCategory.create({ title: "Electricidad" })
    ]);

    // Crear usuarios profesores
    const teacherUsers = await Promise.all([
      User.create({
        name: "Ana",
        lastname: "García",
        email: "ana.garcia@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "TEACHER",
        birthday: new Date("1980-05-15"),
        dni: 25123456,
        phone: "1112345678",
        address: "Calle Falsa 123"
      }),

      // crear admin
      User.create({
        name: "Admin",
        lastname: "Admin",
        email: "admin@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "ADMIN",
        birthday: new Date("1980-05-15"),
        dni: 25123456,
        phone: "1112345678",
        address: "Calle Falsa 123"
      }),
      
      User.create({
        name: "Carlos",
        lastname: "López",
        email: "carlos.lopez@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "TEACHER",
        birthday: new Date("1975-10-20"),
        dni: 20654321,
        phone: "1198765432",
        address: "Avenida Siempreviva 742"
      }),
      
      User.create({
        name: "Laura",
        lastname: "Martínez",
        email: "laura.martinez@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "TEACHER",
        birthday: new Date("1988-03-01"),
        dni: 33987654,
        phone: "1156789012",
        address: "Calle Principal 456"
      }),
      
      User.create({
        name: "Roberto",
        lastname: "Pérez",
        email: "roberto.perez@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "TEACHER",
        birthday: new Date("1970-12-10"),
        dni: 18123789,
        phone: "1123456789",
        address: "Avenida Central 789"
      }),
      
      User.create({
        name: "Sofia",
        lastname: "Rodriguez",
        email: "sofia.rodriguez@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "TEACHER",
        birthday: new Date("1992-07-25"),
        dni: 36543987,
        phone: "1187654321",
        address: "Calle Secundaria 101"
      })
    ]);

    // Crear usuarios estudiantes
    const studentUsers = await Promise.all([
      User.create({
        name: "Juan",
        lastname: "Rodriguez",
        email: "juan.perez@incubadoranoc.com",
        password: await bcrypt.hash("123456789", 10),
        userRole: "STUDENT",
        birthday: new Date("2000-01-01"),
        dni: 42123456,
        phone: "1111111111",
        address: "Calle Estudiante 1"
      }),
      
      User.create({
        name: "María",
        lastname: "Gómez",
        email: "maria.gomez@incubadoranoc.com",
        password: await bcrypt.hash("estudiante2", 10),
        userRole: "STUDENT",
        birthday: new Date("2001-02-02"),
        dni: 43234567,
        phone: "1122222222",
        address: "Calle Estudiante 2"
      }),
      
      User.create({
        name: "Pedro",
        lastname: "López",
        email: "pedro.lopez@incubadoranoc.com",
        password: await bcrypt.hash("estudiante3", 10),
        userRole: "STUDENT",
        birthday: new Date("2002-03-03"),
        dni: 44345678,
        phone: "1133333333",
        address: "Calle Estudiante 3"
      }),
      
      User.create({
        name: "Lucía",
        lastname: "Martínez",
        email: "lucia.martinez@incubadoranoc.com",
        password: await bcrypt.hash("estudiante4", 10),
        userRole: "STUDENT",
        birthday: new Date("2003-04-04"),
        dni: 45456789,
        phone: "1144444444",
        address: "Calle Estudiante 4"
      }),
      
      User.create({
        name: "Diego",
        lastname: "Rodríguez",
        email: "diego.rodriguez@incubadoranoc.com",
        password: await bcrypt.hash("estudiante5", 10),
        userRole: "STUDENT",
        birthday: new Date("2004-05-05"),
        dni: 46567890,
        phone: "1155555555",
        address: "Calle Estudiante 5"
      })
    ]);

    // Crear profesores
    const teachers = await Promise.all([
      Teacher.create({
        user_id: teacherUsers[0].get('id'),
        specialty: "Desarrollo Web"
      }),
      
      Teacher.create({
        user_id: teacherUsers[1].get('id'),
        specialty: "Programacion"
      }),
      
      Teacher.create({
        user_id: teacherUsers[2].get('id'),
        specialty: "Marketing Digital Estratégico"
      }),
      
      Teacher.create({
        user_id: teacherUsers[3].get('id'),
        specialty: "Oficios"
      }),
      
      Teacher.create({
        user_id: teacherUsers[4].get('id'),
        specialty: "Electricidad"
      })
    ]);

    // Crear cursos
    const courses = await Promise.all([
      Courses.create({
        title: "Desarrollo Web Full Stack",
        description: "Aprende a crear aplicaciones web completas. Incluye HTML, CSS, JavaScript, React, Node.js, Express, MongoDB. En este curso aprenderas a crear aplicaciones web desde cero hasta la entrega final. La programacion web es una de las tecnologias mas demandadas en el mundo y en el mercado laboral.",
        price: 50000.00,
        quota: 20,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-06-30"),
        hours: 80,
        modalidad: "VIRTUAL",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Ffull%20stack.webp?alt=media&token=ecd9d174-53c7-4685-b7f8-66c982aabb79",
        category_id: categories[0].get('id'),
        teacher_id: teachers[0].get('id')
      }),
      
      Courses.create({
        title: "Diseño UX/UI Avanzado",
        description: "Mejora la experiencia de usuario de tus diseños. Incluye Figma, Adobe XD, Sketch, Invision, etc. En este curso aprenderas a crear diseños de alta calidad para aplicaciones web y moviles. Conoce las mejores practicas de diseño UX/UI y como aplicarlas en tus proyectos.",
        price: 40000.00,
        quota: 15,
        startDate: new Date("2025-03-15"),
        endDate: new Date("2025-05-15"),
        hours: 80,
        modalidad: "PRESENCIAL",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2FUX.webp?alt=media&token=1ec10692-9c89-4211-8c5e-2e64abaf510c",
        category_id: categories[1].get('id'),
        teacher_id: teachers[1].get('id')
      }),
      
      Courses.create({
        title: "Marketing Digital",
        description: "Domina las herramientas del marketing online. Incluye SEO, SEM, Redes Sociales, Email Marketing, etc. En este curso aprenderas a crear campañas de marketing digital efectivas y a medir su rendimiento. El marketing digital es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. ",
        price: 45000.00,
        quota: 25,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-07-01"),
        hours: 80,
        modalidad: "HÍBRIDO",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fmarketing.webp?alt=media&token=3a84243e-e7d1-4877-8f00-4da90c8e2244",
        category_id: categories[2].get('id'),
        teacher_id: teachers[2].get('id')
      }),
      
      Courses.create({
        title: "Administración de Pymes",
        description: "Gestiona eficientemente tu pequeña o mediana empresa. Incluye Gestion de Recursos Humanos, Gestion de Inventarios, Gestion de Finanzas, etc. En este curso aprenderas a gestionar tu empresa desde cero hasta la entrega final. La gestion de empresas es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 35000.00,
        quota: 30,
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-02-15"),
        hours: 60,
        modalidad: "VIRTUAL",
        status: "FINALIZADO",
        isActive: false,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fgestionpyme.webp?alt=media&token=6e117d2b-0790-4e56-bb42-89db1b24ea2b",
        category_id: categories[3].get('id'),
        teacher_id: teachers[3].get('id')
      }),
      
      Courses.create({
        title: "Electricidad",
        description: "Aprende a realizar instalaciones eléctricas seguras. Incluye Electricidad Residencial, Electricidad Industrial, Electricidad Comercial, etc. En este curso aprenderas a realizar instalaciones electricas desde cero hasta la entrega final. La electricidad es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 30000.00,
        quota: 10,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-08-01"),
        hours: 90,
        modalidad: "PRESENCIAL",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Felectricidad.webp?alt=media&token=b337cefa-256b-4e66-8cf7-19138e04bee3",
        category_id: categories[9].get('id'),
        teacher_id: teachers[4].get('id')
      }),
      
      Courses.create({
        title: "Panadería y Pastelería Básica",
        description: "Aprende a hornear pan y pasteles deliciosos. Incluye Panadería y Pastelería Básica, Panadería y Pastelería Intermedia, Panadería y Pastelería Avanzada, etc. En este curso aprenderas a hornear pan y pasteles desde cero hasta la entrega final. La panaderia y pastelería es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 25000.00,
        quota: 12,
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-03-15"),
        hours: 70,
        modalidad: "PRESENCIAL",
        status: "FINALIZADO",
        isActive: false,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fpanaderia.webp?alt=media&token=15b4994a-1ce1-475f-94d8-f01a3381b14b",
        category_id: categories[5].get('id'),
        teacher_id: teachers[0].get('id')
      }),
      
      Courses.create({
        title: "Inglés Avanzado",
        description: "Mejora tu fluidez en inglés. Incluye Inglés Avanzado, Inglés Intermedio, Inglés Básico, etc. En este curso aprenderas a hablar, leer, escribir y escuchar inglés desde cero hasta la entrega final. El ingles es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 38000.00,
        quota: 18,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-09-01"),
        hours: 110,
        modalidad: "VIRTUAL",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fporque-estudiar-ingles-gratis.webp?alt=media&token=e8d2ace1-56f8-4d3d-9b96-52e8983b5c51",
        category_id: categories[6].get('id'),
        teacher_id: teachers[1].get('id')
      }),
      
      Courses.create({
        title: "Primeros Auxilios",
        description: "Aprende a responder ante emergencias. Incluye Primeros Auxilios Básicos, Primeros Auxilios Intermedios, Primeros Auxilios Avanzados, etc. En este curso aprenderas a responder ante emergencias desde cero hasta la entrega final. Los primeros auxilios son una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 20000.00,
        quota: 20,
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-02-15"),
        hours: 50,
        modalidad: "PRESENCIAL",
        status: "FINALIZADO",
        isActive: false,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fprimeros%20auxilios.webp?alt=media&token=8b02f697-dd96-4b4e-b950-bd546ed223ff",
        category_id: categories[7].get('id'),
        teacher_id: teachers[2].get('id')
      }),
      
      Courses.create({
        title: "Guitarra para Principiantes",
        description: "Aprende a tocar guitarra desde cero. Incluye Guitarra Clásica, Guitarra Electrica, Guitarra Acustica, etc. En este curso aprenderas a tocar guitarra desde cero hasta la entrega final. La guitarra es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 32000.00,
        quota: 15,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-10-01"),
        hours: 90,
        modalidad: "HÍBRIDO",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fguitarra.webp?alt=media&token=be93c66e-8393-4fb7-ae31-2d49abb30876",
        category_id: categories[8].get('id'),
        teacher_id: teachers[3].get('id')
      }),
      
      Courses.create({
        title: "Reparación de Celulares",
        description: "Aprende a solucionar problemas comunes en celulares. Incluye Reparación de Celulares Básicos, Reparación de Celulares Intermedios, Reparación de Celulares Avanzados, etc. En este curso aprenderas a solucionar problemas comunes en celulares desde cero hasta la entrega final. La reparacion de celulares es una de las tecnologias mas demandadas en el mundo y en el mercado laboral. Se te brindara un entorno de trabajo real para que puedas aplicar los conocimientos adquiridos.",
        price: 28000.00,
        quota: 10,
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-09-15"),
        hours: 60,
        modalidad: "PRESENCIAL",
        status: "ACTIVO",
        isActive: true,
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2F800_imagen%20(1).webp?alt=media&token=21c77cb3-000c-40dc-93c7-984453c306d2",
        category_id: categories[9].get('id'),
        teacher_id: teachers[4].get('id')
      }),

      Courses.create({
        title: "Corte y Confección con circularidad textil",
        description: "Aprende a cortar y confeccionar prendas de vestir de manera profesional. Este curso cubre corte y confección de prendas de vestir, patronaje, costura, terminado y acabado de prendas.",
        price: 50000,
        quota: 30,
        startDate: new Date("2025-03-08"),
        endDate: new Date("2025-06-30"),
        hours: 120,
        modalidad: "PRESENCIAL",
        status: "ACTIVO",
        isActive: true,
        category_id: categories[4].get('id'),
        teacher_id: teachers[1].get('id'),
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fmoda-circular.webp?alt=media&token=ae6a224b-be0b-4bf5-8c7b-ea6245ed88df"
      } as Optional<typeof Courses, keyof typeof Courses>),

      Courses.create({
        title: "Seminario de Costura",
        description: "Creá tu set matero de manera profesional. Este curso cubre costura de prendas de vestir, patronaje, costura, terminado y acabado de prendas.",
        price: 50000,
        quota: 30,
        startDate: new Date("2025-02-08"),
        endDate: new Date("2025-05-30"),
        hours: 120,
        modalidad: "PRESENCIAL",
        status: "ACTIVO",
        isActive: true,
        category_id: categories[4].get('id'),
        teacher_id: teachers[2].get('id'),
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2F800_imagen.webp?alt=media&token=bcdbd635-4316-45ce-930f-815ce6a3a750"
      } as Optional<typeof Courses, keyof typeof Courses>),

      Courses.create({
        title: "Sublimación artesanal",
        description: "Aprende a instalar y reparar circuitos eléctricos de manera profesional. Este curso cubre instalación y reparación de circuitos eléctricos, cables, interruptores, tomas y enchufes.",
        price: 50000,
        quota: 30,
        startDate: new Date("2025-02-08"),
        endDate: new Date("2025-05-30"),
        hours: 120,
        modalidad: "PRESENCIAL",
        status: "ACTIVO",
        isActive: true,
        category_id: categories[4].get('id'),
        teacher_id: teachers[3].get('id'),
        image_url: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2Fsublimacion-1.webp?alt=media&token=7628bae1-c189-42a8-adec-e40b1482e84f"
      } as Optional<typeof Courses, keyof typeof Courses>)
    ]);

    // Crear clases
    const classes = await Promise.all([
      Class.create({
        topic: "Introducción a HTML",
        class_date: new Date("2025-03-05"),
        course_id: courses[0].get('id')
      }),
      
      Class.create({
        topic: "CSS Básico",
        class_date: new Date("2025-03-07"),
        course_id: courses[0].get('id')
      }),
      
      Class.create({
        topic: "Fundamentos de UX",
        class_date: new Date("2025-03-18"),
        course_id: courses[1].get('id')
      }),
      
      Class.create({
        topic: "Diseño de Interfaces",
        class_date: new Date("2025-03-20"),
        course_id: courses[1].get('id')
      }),
      
      Class.create({
        topic: "SEO Introductorio",
        class_date: new Date("2025-04-03"),
        course_id: courses[2].get('id')
      }),
      
      Class.create({
        topic: "Marketing de Contenido",
        class_date: new Date("2025-04-05"),
        course_id: courses[2].get('id')
      }),
      
      Class.create({
        topic: "Planificación Empresarial",
        class_date: new Date("2025-04-17"),
        course_id: courses[3].get('id')
      }),
      
      Class.create({
        topic: "Gestión de Recursos",
        class_date: new Date("2025-04-19"),
        course_id: courses[3].get('id')
      }),
      
      Class.create({
        topic: "Instalación de Circuitos",
        class_date: new Date("2025-05-03"),
        course_id: courses[4].get('id')
      }),
      
      Class.create({
        topic: "Reparación de Cableado",
        class_date: new Date("2025-05-06"),
        course_id: courses[4].get('id')
      }),

      Class.create({
        topic: "Introducción a la Costura",
        class_date: new Date("2025-03-08"),
        course_id: courses[10].get('id')
      }),
      
      Class.create({
        topic: "Costura de Prendas",
        class_date: new Date("2025-03-08"),
        course_id: courses[11].get('id')
      }),

      Class.create({
        topic: "Patrones de Costura",
        class_date: new Date("2025-02-08"),
        course_id: courses[12].get('id')
      }),
    ]);

    // Crear noticias
    await News.create({
      title: "Invitación Especial a la Jornada Emprendedora del Norte Cordobés",
      description: "¿Sos emprendedor o estás pensando en iniciar tu propio negocio? ¡Esta jornada es para vos!\n\nSumate a este día lleno de inspiración, aprendizaje y conexiones valiosas. Te esperamos para disfrutar de:\n\n🤝 *Networking:* Conectate con otros emprendedores y crea alianzas que impulsen tu negocio.\n\n📈 *Capacitación en Marketing Digital:* Aprendé las estrategias más efectivas para hacer crecer tu presencia en línea y alcanzar a más clientes.\n\n💬 *Panel de Emprendedores:* Escuchá a emprendedores que han transformado sus ideas en negocios prósperos y descubre sus secretos para el éxito.\n\n🗓 Jueves 14 de noviembre de 2024\n🕒 17.30 hs\n📍 Centro Cultural Municipal, España 151, Deán Funes\n\nActividad gratuita con cupos limitados\nNo pierdas la oportunidad de potenciar tu emprendimiento. ¡Inscríbete ahora y asegura tu lugar!\n\n🔗 https://forms.gle/2m5VsVsvNUwwNfjy9\n\n¡Te esperamos para crear juntos un futuro lleno de posibilidades!",
      image: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2F464871695_1228700741725165_3554827246414072985_n.jpg?alt=media&token=b5885cd2-6cc4-43a6-bfa2-45c78237167b",
      user_id: teacherUsers[0].get('id')
    });

    await News.create({
      title: "Inscripciones Abiertas al Concurso de Ideas Emprendedoras",
      description: "📢📢📢Atención emprendedores 📢📢📢\nSe encuentran abiertas las inscripciones para Concurso Ideas Emprendedoras 2022💡\n📌$1.500.000 entre los 15 primeros puestos‼️\n➡️Las inscripciones se podrán realizar hasta el 24 de junio en este link: https://bit.ly/concursoideas2022\n✅ Bases, condiciones y formulario de inscripción:\nhttps://cordobaproduce.cba.gov.ar/14947/ideas-emprendedoras-2022/\nMás info y consultas en:\n📩 subsecretariapymecba@gmail.com\ny por Whatsapp al +5493515491702",
      image: "https://firebasestorage.googleapis.com/v0/b/xacademy-3.firebasestorage.app/o/uploads%2Fcursos%2F284960003_739527797066198_7930903536872275566_n.jpg?alt=media&token=b74fbcb8-e25c-49f2-85b8-35facb6f0cb8",
      user_id: teacherUsers[1].get('id')
    });

    console.log("Base de datos poblada exitosamente");
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
    throw error;
  }
};

export default seedDatabase; 