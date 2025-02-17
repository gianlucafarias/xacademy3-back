import { Request, Response } from 'express';
import  Courses  from '../models/Courses';

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
    courses_category_id
  } = req.body;

  try {
    // Validar que todos los campos requeridos estén presentes
    if (!title || !price || !quota || !startDate || !endDate || !hours || !status || !modalidad || !image_url || !teacher_id || !courses_category_id) {
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
      courses_category_id
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
    res.status(500).json({ error: 'Error al obtener los cursos' });
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







