/**
 * Утилиты для получения и подгрузки YAML-шаблонов из MinIO.
 *
 * - Формирует список кандидатов ключей для поиска YAML-файла шаблона.
 * - Подгружает "raw" YAML содержимое, если его нет в объекте шаблона.
 */

import { getMinioClient } from '@/shared/minio/getMinioClient';
import type { Template } from '@entities/template/model/store/templateStore.ts';
import { joinKey } from '@features/pprEdit/ui/utils/minioKey/minioKey';

/**
 * Формирует список возможных ключей объекта в MinIO для загрузки raw YAML.
 *
 * @param templateObj - объект шаблона (может содержать поля objectKey, key, templateName)
 * @param prefix - префикс для ключа в бакете MinIO
 * @returns список кандидатов ключей (уникальные значения)
 */
export const resolveObjectKeyCandidates = (templateObj: any, prefix = ''): string[] => {
  /** Накопленный список возможных ключей */
  const candidates: string[] = [];

  if (templateObj?.objectKey) {
    candidates.push(String(templateObj.objectKey));
  }

  if (templateObj?.key) {
    candidates.push(String(templateObj.key));
  }

  /** Базовое имя шаблона (используется для построения имени файла) */
  const templateNameBase = templateObj?.templateName || '';
  if (templateNameBase) {
    candidates.push(joinKey(prefix, `${templateNameBase}.yaml`));
    candidates.push(joinKey(prefix, `${templateNameBase}.yml`));
  }

  /** Возвращаем уникальный список, отфильтровав пустые значения */
  return Array.from(new Set(candidates.filter(Boolean)));
};

/**
 * Загружает "raw" YAML в объект шаблона, если его там нет.
 *
 * @param templateObj - объект шаблона
 * @param bucket - имя бакета MinIO (по умолчанию "yamls")
 * @param prefix - префикс для ключей (по умолчанию пустая строка)
 * @returns обновлённый шаблон с полем raw либо undefined, если загрузка не удалась
 */
export const resolveTemplateWithRaw = async (
  templateObj: Template | undefined,
  bucket = 'yamls',
  prefix = '',
): Promise<Template | undefined> => {
  if (!templateObj) return undefined;

  /** Если raw уже есть и он не пустой — возвращаем шаблон как есть */
  if ((templateObj as any)?.raw && String((templateObj as any).raw).trim().length > 0) {
    return templateObj;
  }

  /** Получаем список кандидатов ключей для поиска */
  const candidates = resolveObjectKeyCandidates(templateObj as any, prefix);

  /** Пытаемся поочередно загрузить содержимое из MinIO */
  for (const candidateKey of candidates) {
    try {
      const { getObjectText } = await getMinioClient();
      const text = await getObjectText(bucket, candidateKey);
      if (text && String(text).trim().length > 0) {
        return { ...(templateObj as any), raw: text } as Template;
      }
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.warn(`[resolveTemplateWithRaw] Не удалось загрузить "${candidateKey}":`, error);
      }
    }
  }

  /** Ничего не нашли — возвращаем undefined */
  return undefined;
};
