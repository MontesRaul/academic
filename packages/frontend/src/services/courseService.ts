import { apiRequest } from '../lib';

export type Course = {
  id: string;
  name: string;
  code: string;
  credits: number;
};

export async function getCourses(): Promise<Course[]> {
  return apiRequest<Course[]>('/courses', {
    defaultErrorMessage: 'Error al cargar cursos',
  });
}
