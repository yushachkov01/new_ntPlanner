import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

/**
 * Настройка MinIO
 * - endpoint: адрес локального MinIO
 * - credentials: учётные данные (по умолчанию admin/secretpassword)
 * - forcePathStyle: обязательно для корректного построения URL
 */
export const minio = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:9000',
  credentials: { accessKeyId: 'admin', secretAccessKey: 'secretpassword' },
  forcePathStyle: true,
});

/**
 * Получить список объектов из указанного бакета и префикса.
 * @param bucket — имя бакета в MinIO
 * @param prefix — путь внутри бакета
 * @returns Promise<Contents[]> — массив метаданных объектов
 */
export const listObjects = async (bucket: string, prefix = '') => {
  const { Contents } = await minio.send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }),
  );
  return Contents ?? [];
};

/**
 * Загрузить текстовое содержимое объекта по ключу.
 * @param bucket — имя бакета в MinIO
 * @param key — ключ объекта в бакете
 * @returns Promise<string> — текстовое содержимое файла
 */
export const getObjectText = async (bucket: string, key: string) => {
  const { Body } = await minio.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return Body!.transformToString();
};
