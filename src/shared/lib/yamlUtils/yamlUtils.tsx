/**
 * Парсит YAML-строку в JavaScript-объект.
 *
 * @param src - исходный YAML в виде строки
 * @returns объект с распаршенными данными и сообщением об ошибке, если она была
 */
import yaml from 'js-yaml';

export function parseYaml(src: string): { data: unknown; error: string | null } {
  try {
    return { data: yaml.load(src), error: null };
  } catch (e) {
    /**при ошибке парсинга возвращаем пустой объект и текст ошибки */
    return { data: {}, error: (e as Error).message };
  }
}
