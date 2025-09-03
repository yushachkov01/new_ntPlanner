/**
 *  Возвращает модуль с функциями работы с MinIO, загружая его лениво (по требованию).
 *  Позволяет вынести тяжёлую зависимость в отдельный чанк и не грузить её при старте приложения.
 */
let cached: Promise<typeof import('./MinioClient')> | null = null;

export function getMinioClient() {
  if (!cached) cached = import('./MinioClient');
  return cached;
}
