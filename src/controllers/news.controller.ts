import { Request, Response } from 'express';
import News from '../models/News';
import { Op } from 'sequelize';

interface NewsAttributes {
    title: string;
    description: string;
    image: string;
    user_id: number;
}

export const createNews = async (req: Request, res: Response) => {
    const { title, description, image, user_id } = req.body;
    console.log(req.body);
    if (!title || !description || !image || !user_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        const news = await News.create({ title, description, image, user_id });
        res.status(201).json(news);
    } catch (error) {
        console.error('Error al crear noticia:', error);
        res.status(500).json({ message: 'Error al crear la noticia' });
    }
}

export const getAllNews = async (req: Request, res: Response) => {
    try {
        const news = await News.findAll();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las noticias' });
    }
}

export const getNewsById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la noticia' });
    }
}

export const updateNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, image } = req.body;

    try {
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        if (title) {
            (news as any).title = title;
        }
        if (description) {
            (news as any).description = description;
        }
        if (image) {
            (news as any).image = image;
        }

        await news.save();
        res.status(200).json(news);
    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        res.status(500).json({ message: 'Error al actualizar la noticia' });
    }
}

export const updateNewsAlternative = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, image } = req.body;

    try {
        // Crear un objeto con solo los campos que queremos actualizar
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (image) updateData.image = image;

        // Actualizar directamente usando el método update
        const [updated] = await News.update(updateData, {
            where: { id }
        });

        if (updated === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        // Obtener la noticia actualizada
        const updatedNews = await News.findByPk(id);
        res.status(200).json(updatedNews);
    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        res.status(500).json({ message: 'Error al actualizar la noticia' });
    }
}

export const deleteNews = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        await news.destroy();
        res.status(200).json({ message: 'Noticia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
}





