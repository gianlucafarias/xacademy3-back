import { Request, Response } from 'express';
import  Courses  from '../models/Courses';
import CoursesCategory from '../models/CoursesCategory';
import { Op} from 'sequelize';

export const createCourse = async (req: Request, res: Response) => {
  const { 
    title, 
    description, 
    price, 
    quota, 
    startDate, 
    endDate, 
    hours, 
    modalidad, 
    image_url, 
    teacher_id,
    category_id
  } = req.body;

  
  try {
    // Validar que todos los campos requeridos estén presentes
    if (!title || !description || !price || !quota || !startDate || !endDate || !hours  || !modalidad || !teacher_id || !category_id) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar que la modalidad sea válida  
    if (!['PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'].includes(modalidad)) {
      return res.status(400).json({ error: 'Modalidad no válida' });
    }
    //Definir estado del curso dependiendo de la fecha
    const today = new Date();
    let status: string = 'PENDIENTE';//estado por defecto

    if(new Date(startDate) <= today && new Date(endDate) >= today){
      status = 'ACTIVO';
    }else if(new Date(endDate) < today){
      status = 'FINALIZADO';
    }
    console.log(status);

    // Crear el curso
    const course = await Courses.create({ 
      title, 
      description, 
      price, 
      quota, 
      startDate, 
      endDate, 
      hours, 
      status,
      modalidad,
      image_url,
      isActive: status !== 'FINALIZADO',
      teacher_id,
      category_id
    }
  );

    res.status(201).json({ message: 'Curso creado con éxito', course });
    console.log(course);
  } catch (error) {
    console.error('Error al crear el curso:', error);
    res.status(500).json({ error: 'Error al crear el curso' });
  }
}
/**
 * Actualizo automaticamente el estado del curso
 */

export const updateCourseStatus = async () => {
  try {
    const today = new Date();

    // Actualizar cursos que deben estar "ACTIVO"
    const updatedToActive = await Courses.update(
      { status: "ACTIVO", isActive: true }, // Asegúrate de establecer también `isActive`
      {
        where: {
          startDate: { [Op.lte]: today }, // Fecha de inicio menor o igual a hoy
          endDate: { [Op.gte]: today },   // Fecha de fin mayor o igual a hoy
          status: { [Op.ne]: "ACTIVO" },  // Solo actualiza si no están ya "ACTIVO"
        },
      }
    );

    // Actualizar cursos que deben estar "FINALIZADO"
    const updatedToFinalized = await Courses.update(
      { status: "FINALIZADO", isActive: false }, // Desactivar el curso
      {
        where: {
          endDate: { [Op.lt]: today },    // Fecha de fin menor a hoy
          status: { [Op.ne]: "FINALIZADO" }, // Solo actualiza si no están ya "FINALIZADO"
        },
      }
    );

    // Actualizar cursos que deben estar "PENDIENTE"
    const updatedToPending = await Courses.update(
      { status: "PENDIENTE", isActive: true }, // Activar curso como pendiente
      {
        where: {
          startDate: { [Op.gt]: today },  // Fecha de inicio mayor a hoy
          status: { [Op.ne]: "PENDIENTE" }, // Solo actualiza si no están ya "PENDIENTE"
        },
      }
    );

    console.log(
      `Estados de cursos actualizados: 
      Activo: ${updatedToActive[0]} | 
      Finalizado: ${updatedToFinalized[0]} | 
      Pendiente: ${updatedToPending[0]}`
    );
  } catch (error) {
    console.error("Error al actualizar el estado de los cursos:", error);
  }
};



export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Courses.findAll();
    res.status(200).json(courses);
  } catch (error) { 
    console.log(error)
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
}

export const getAllActiveCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Courses.findAll({ where: { isActive: true } });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos activos' });
  }
}

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
}
export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const categories = await CoursesCategory.findByPk(id);
    if (!categories) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
}

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params; // Obtener el ID del curso desde los parámetros de la URL
  const {
    title,
    description,
    price,
    quota,
    startDate,
    endDate,
    hours,
    status,
    modalidad,
    image_url,
    teacher_id,
    category_id
  } = req.body;
  console.log('Recibiendo image_url:', image_url);

  try {
    // Buscar si el curso existe
    const course = await Courses.findByPk(id);

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Validar que el status sea válido si se envía
    if (status && !['PENDIENTE', 'ACTIVO', 'FINALIZADO'].includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    // Validar que la modalidad sea válida si se envía  
    if (modalidad && !['PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'].includes(modalidad)) {
      return res.status(400).json({ error: 'Modalidad no válida' });
    }

    // Actualizar solo los campos que se enviaron en la solicitud
    await course.update({
      title,
      description,
      price,
      quota,
      startDate,
      endDate,
      hours,
      status,
      modalidad,
      image_url: image_url || image_url,
      teacher_id,
      category_id
    });

    res.status(200).json({ message: 'Curso actualizado con éxito', course });
  } catch (error) {
    console.error('Error al actualizar el curso:', error);
    res.status(500).json({ error: 'Error al actualizar el curso' });
  }
};

export const getCourseByCategory = async (req: Request, res: Response) => {
  const { category_id } = req.params;
  try {
    const courses = await Courses.findAll({ where: { category_id } });

    if (!courses) {
      return res.status(404).json({ error: 'No se encontraron cursos para esta categoría' });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos por categoría' });
  }
}

export const createCourseCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const courseCategory = await CoursesCategory.create({ name });
    res.status(201).json(courseCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de curso' });
  }
}

export const getAllCourseCategories = async (req: Request, res: Response) => {
  try {
    const courseCategories = await CoursesCategory.findAll();
    if (!courseCategories) {
      return res.status(404).json({ error: 'No se encontraron categorías de cursos' });
    }
    res.status(200).json(courseCategories);

  } catch (error) {
    console.error('Error al obtener las categorías de cursos:', error);
    res.status(500).json({ error: 'Error al obtener las categorías de cursos' });
  }
}

export const editCourseCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const courseCategory = await CoursesCategory.findByPk(id);
    if (!courseCategory) {
      return res.status(404).json({ error: 'Categoría de curso no encontrada' });
    }
    await courseCategory.update({ name });
    res.status(200).json(courseCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría de curso' });
  }
}

export const getCoursesCount = async (req: Request, res: Response) => {
  try {
    const coursesCount = await Courses.count();
    res.status(200).json(coursesCount);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el conteo de cursos' });
  }
}

export const getCoursesByTeacher = async (req: Request, res: Response) => {
  const { teacher_id } = req.params;
  try {
    const courses = await Courses.findAll({ where: { teacher_id } });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos por profesor' });
  }
}

export const getCoursesByCategory = async (req: Request, res: Response) => {
  const { category_id } = req.params;
  try {
    const courses = await Courses.findAll({ where: { category_id } });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos por categoría' });
  }
} 

export const getCoursesBySearch = async (req: Request, res: Response) => {
  const { search } = req.params;
  try {
    const courses = await Courses.findAll({ where: { title: { [Op.like]: `%${search}%` } } });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos por búsqueda' });
  }
}

export const getActiveCoursesCount = async (req: Request, res: Response) => {
  try {
    const activeCoursesCount = await Courses.count({ where: { isActive: true } });
    res.status(200).json(activeCoursesCount);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el conteo de cursos activos' });
  }
}

export const getFilteredCourses = async (req: Request, res: Response) => {
  try {
    const { categories, price, orderBy, page = 1, limit = 10 } = req.query;

    let whereClause: any = {};
    let orderClause: any = [];
    const offset = (Number(page) - 1) * Number(limit);

    if (categories) {
      const categoryIds = (categories as string).split(',').map(id => parseInt(id.trim(), 10));
      whereClause.category_id = { [Op.in]: categoryIds };
    }

    if (price === 'gratuitos') {
      whereClause.price = 0; 
    } else if (price === 'arancelados') {
      whereClause.price = { [Op.gt]: 0 }; 
    }

    if (orderBy) {
      switch (orderBy) {
        case 'fecha':
          orderClause = [['updatedAt', 'DESC']];  
          break;
        // case 'populares':
        //   orderClause = [['views', 'DESC']]; 
        //   break;
        // case 'recomendados':
        //   orderClause = [['views', 'DESC']]; 
        //   break;
        default:
          orderClause = [['updatedAt', 'DESC']]; 
          break;
      }
    }

    const { count, rows } = await Courses.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: Number(limit),
      offset: offset
    });

    res.status(200).json({
      courses: rows,
      totalItems: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit))
    });

  } catch (error) {
    console.error('Error al filtrar cursos:', error);
    res.status(500).json({ error: 'Error al obtener los cursos filtrados' });
  }
};

export const findCourseById = async (courseId: number) => {
  try {
    const course = await Courses.findByPk(courseId);
    return course;
  } catch (error) {
    console.error('Error al buscar el curso:', error);
    throw new Error('Error al obtener el curso');
  }
};

export const changeCourseActive = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;
  console.log(req.body);
  try {
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    await course.update({ isActive, status: isActive ? 'ACTIVO' : 'PENDIENTE' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar el estado del curso' });
  }
}

export const lastestCourses = async (req: Request, res: Response)=>{
  try {
    const lastestCourses = await Courses.findAll({
      where:{isActive:true},
      order:[['createdAt', 'DESC']],
      limit:3
    });
    res.json(lastestCourses);
  } catch (error) {
    res.status(500).json({message:'Error al obtener los ultimos cursos'})
  }
}













