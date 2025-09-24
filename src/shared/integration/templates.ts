export interface NativeMinioClient {
    listObjects(bucket: string, prefix?: string): Promise<Array<{ Key?: string }>>;
    getObjectText(bucket: string, key: string): Promise<string>;
}

/**
 * Универсальная загрузка YAML-шаблонов через клиент проекта.
 * Совместима с getMinioClient(): { listObjects, getObjectText }.
 * Фильтрует только .yaml/.yml и возвращает текст и распарсенные данные.
 */
export async function loadYamlTemplatesNative<T>(
    native: NativeMinioClient,
    bucket: string,
    prefix: string,
    parseYaml: (text: string) => T,
): Promise<Array<{ key: string; text: string; data: T }>> {
    const objects = await native.listObjects(bucket, prefix);
    const keys = (objects ?? [])
        .map((bucketObject) => bucketObject.Key)
        .filter((objectKey): objectKey is string => !!objectKey && /\.(ya?ml)$/i.test(objectKey));

    const results: Array<{ key: string; text: string; data: T }> = [];
    for (const key of keys) {
        const text = await native.getObjectText(bucket, key);
        const data = parseYaml(text);
        results.push({ key, text, data });
    }
    return results;
}
