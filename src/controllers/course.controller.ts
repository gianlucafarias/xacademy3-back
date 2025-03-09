import { Request, Response } from 'express';
import  Courses  from '../models/Courses';
import CoursesCategory from '../models/CoursesCategory';
import { Op } from 'sequelize';

export const createCourse = async (req: Request, res: Response) => {
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

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!title || !description || !price || !quota || !startDate || !endDate || !hours || !status || !modalidad || !teacher_id || !category_id) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar que el status sea válido
    if (!['PENDIENTE', 'ACTIVO', 'FINALIZADO'].includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    // Validar que la modalidad sea válida  
    if (!['PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'].includes(modalidad)) {
      return res.status(400).json({ error: 'Modalidad no válida' });
    }

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
      isActive: true,
      teacher_id,
      category_id
    });

    res.status(201).json({ message: 'Curso creado con éxito', course });
    console.log(course);
  } catch (error) {
    console.error('Error al crear el curso:', error);
    res.status(500).json({ error: 'Error al crear el curso' });
  }
}

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
  const { id } = req.params;
  const { title, description, price, quota, startDate, endDate, hours } = req.body;
  try {
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    await course.update({ title, description, price, quota, startDate, endDate, hours });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el curso' });
  }
}

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
    const { categories, price, orderBy } = req.query;

    let whereClause: any = {};
    let orderClause: any = [];

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

    const courses = await Courses.findAll({
      where: whereClause,
      order: orderClause,
    });

    res.status(200).json(courses);
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
















