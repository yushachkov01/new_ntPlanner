import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';

/**
 * Настройка MinIO
 * - endpoint: адрес локального MinIO
 * - credentials: учётные данные (по умолчанию admin/secretpassword)
 * - forcePathStyle: обязательно для корректного построения URL
 */
export const minio = new S3Client({
  region: 'us-east-1',
  endpoint: import.meta.env.VITE_MINIO_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_MINIO_ACCESS,
    secretAccessKey: import.meta.env.VITE_MINIO_SECRET,
  },
  forcePathStyle: true,
});

/** проверить/создать бакет */
export const ensureBucket = async (bucket: string) => {
  try {
    await minio.send(new HeadBucketCommand({ Bucket: bucket }));
    return true;
  } catch (e: any) {
    // нет бакета — пробуем создать
    try {
      await minio.send(new CreateBucketCommand({ Bucket: bucket }));
      return true;
    } catch {
      // если creation — просто продолжаем, дальнейший PUT покажет реальную ошибку
      return false;
    }
  }
};
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

/** Вспомогательная конвертация тела запроса  */
const toUint8Array = async (
  data: Blob | File | ArrayBuffer | Uint8Array | string,
): Promise<Uint8Array> => {
  if (typeof window !== 'undefined' && typeof Blob !== 'undefined' && data instanceof Blob) {
    const buf = await data.arrayBuffer();
    return new Uint8Array(buf);
  }
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (data instanceof Uint8Array) return data;
  if (typeof data === 'string') return new TextEncoder().encode(data);
  throw new Error('Unsupported body type for upload');
};

/** PUT текстового объекта (использует безопасную отправку) */
export const putObjectText = async (
  bucket: string,
  key: string,
  text: string,
  contentType: string = 'text/yaml; charset=utf-8',
) => {
  await ensureBucket(bucket);
  const Body = await toUint8Array(text);
  await minio.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body,
      ContentType: contentType,
    }),
  );
  return key;
};

/** БЕЗОПАСНАЯ загрузка файла */
export const putObjectBytes = async (
  bucket: string,
  key: string,
  fileOrBytes: File | Blob | ArrayBuffer | Uint8Array,
  contentType?: string,
) => {
  await ensureBucket(bucket);

  const Body = await toUint8Array(fileOrBytes as any);
  const ContentType =
    contentType ||
    (typeof Blob !== 'undefined' && fileOrBytes instanceof Blob && fileOrBytes.type) ||
    'application/octet-stream';

  await minio.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body,
      ContentType,
    }),
  );
  return key;
};
