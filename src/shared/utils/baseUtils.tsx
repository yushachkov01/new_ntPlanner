import { Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

/** Словарь типов-значений */
export type AnyDict = Record<string, any>;

/** Добавить точки к расширениям */
export const withDots = (arr: string[]) => arr.map((x) => (x.startsWith('.') ? x : `.${x}`));

/** Нормализованный список допустимых расширений без точки, в нижнем регистре */
export function resolveNormalizedAllowed(
  allowedExtensions: string[] | undefined,
  accept: string | undefined,
  defaults: readonly string[],
): string[] {
  if (allowedExtensions?.length)
    return allowedExtensions.map((x) => x.replace(/^\./, '').toLowerCase());
  if (accept?.length) {
    return accept
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^\./, '').toLowerCase());
  }
  return [...defaults];
}

/** Итоговое значение для Upload.accept */
export function resolveEffectiveAccept(
  accept: string | undefined,
  normalizedAllowed: string[],
  defaultAccept: string,
): string {
  if (accept?.length) return accept;
  if (normalizedAllowed.length) return withDots(normalizedAllowed).join(',');
  return defaultAccept;
}

/** Проверка расширения файла */
export function checkExtension(
  fileName: string,
  normalizedAllowed: string[],
): { ok: boolean; ext: string } {
  const ext = (fileName.split('.').pop() || '').toLowerCase();
  const ok = ext !== '' && normalizedAllowed.includes(ext);
  return { ok, ext };
}

/** Сообщение об неподдерживаемом формате */
export function buildUnsupportedMsg(
  ext: string,
  normalizedAllowed: string[],
  CONFIG_UPLOADER_TEXT: AnyDict,
): string {
  return `${CONFIG_UPLOADER_TEXT.unsupportedPrefix}.${ext || '?'}${CONFIG_UPLOADER_TEXT.unsupportedSuffix}${withDots(
    normalizedAllowed,
  ).join(', ')}`;
}

/** Guard для beforeUpload: возвращает Upload.LIST_IGNORE либо false */
export function beforeUploadGuardReturn(
  fileName: string,
  normalizedAllowed: string[],
  CONFIG_UPLOADER_TEXT: AnyDict,
  showError: (msg: string) => void,
): typeof Upload.LIST_IGNORE | false {
  const { ok, ext } = checkExtension(fileName, normalizedAllowed);
  if (!ok) {
    const msg = buildUnsupportedMsg(ext, normalizedAllowed, CONFIG_UPLOADER_TEXT);
    showError(msg);
    return Upload.LIST_IGNORE;
  }
  return false;
}

/** Выбор кандидата UploadFile из аргумента onChange */
export function pickUploadCandidate(
  arg: UploadChangeParam<UploadFile> | { fileList: UploadFile[] },
): UploadFile | undefined {
  const anyArg: any = arg as any;
  const fromList: UploadFile[] | undefined = anyArg?.fileList;
  const candidate: UploadFile | undefined =
    anyArg?.file ?? (fromList && fromList[fromList.length - 1]);
  return candidate;
}

/** Достаём оригинальный File */
export function getOriginalFile(candidate: UploadFile | undefined): File | undefined {
  const originalFile: File | undefined =
    (candidate as any)?.originFileObj || (candidate as unknown as File | undefined);
  if (!originalFile || typeof originalFile.name !== 'string') return undefined;
  return originalFile;
}

/** Открыть превью в новой вкладке, если урл есть */
export function previewRecord(
  rec: { previewUrl?: string },
  LINK_TARGET_BLANK: string,
  WINDOW_FEATURES_NOOPENER: string,
): void {
  if (!rec?.previewUrl) return;
  window.open(rec.previewUrl, LINK_TARGET_BLANK, WINDOW_FEATURES_NOOPENER);
}

/** Скачать файл по клику */
export function downloadRecord(
  event: MouseEvent,
  configFile: { previewUrl?: string; name?: string },
  DEFAULT_DOWNLOAD_NAME: string,
): void {
  event.preventDefault();
  if (!configFile?.previewUrl) return;
  const downloadLink = document.createElement('a');
  downloadLink.href = configFile.previewUrl;
  downloadLink.download = configFile.name || DEFAULT_DOWNLOAD_NAME;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/** Удаление из списка с обновлением стейта */
export function removeFlow<T extends { uid: string }>(
  files: T[],
  uid: string,
  onChange: ((files: T[]) => void) | undefined,
  setInner: (files: T[]) => void,
): void {
  const next = (files ?? []).filter((file) => file.uid !== uid);
  if (onChange) onChange(next);
  else setInner(next);
}

/** "#" если нет ссылки */
export const hrefOrPlaceholder = (url?: string) => url || '#';

/** Пропсы для кнопки превью (disabled/title без тернарки в компоненте) */
export function previewButtonProps(url: string | undefined, STAGE_PANEL_TEXT: AnyDict) {
  const disabled = !url;
  const title = !url
    ? STAGE_PANEL_TEXT.files.availableAfterUpload
    : STAGE_PANEL_TEXT.files.previewBtn;
  return { disabled, title };
}

/** Основной флоу onChange загрузчика: валидация, сохранение, локальный стейт, уведомления */
export async function handleConfigUploaderChangeFlow<
  TFile extends { uid: string; name: string },
  TStored extends TFile & { key: string },
>(
  arg: UploadChangeParam<UploadFile> | { fileList: UploadFile[] },
  normalizedAllowed: string[],
  files: TFile[],
  onChange: ((files: TFile[]) => void) | undefined,
  setInner: (files: TFile[]) => void,
  setPreviewByUid: (updater: (prev: Record<string, string>) => Record<string, string>) => void,
  showError: (msg: string) => void,
  persistToMinio: (file: File) => Promise<TStored>,
  CONFIG_UPLOADER_TEXT: AnyDict,
  STAGE_PANEL_TEXT: AnyDict,
  clearError: () => void,
): Promise<void> {
  const candidate = pickUploadCandidate(arg);
  if (!candidate) return;

  const originalFile = getOriginalFile(candidate);
  if (!originalFile) return;

  const { ok, ext } = checkExtension(originalFile.name, normalizedAllowed);
  if (!ok) {
    const msg = buildUnsupportedMsg(ext, normalizedAllowed, CONFIG_UPLOADER_TEXT);
    showError(msg);
    return;
  }

  try {
    const stored = await persistToMinio(originalFile);

    const localUrl = URL.createObjectURL(originalFile);
    setPreviewByUid((prev) => ({ ...prev, [stored.uid]: localUrl }));

    const exists = (files ?? []).some((file) => file.uid === stored.uid);
    const next = exists
      ? files
      : [...(files ?? []), { uid: stored.uid, name: stored.name } as unknown as TFile];

    if (onChange) onChange(next);
    else setInner(next);

    clearError();
    try {
      message.success(CONFIG_UPLOADER_TEXT.addedMessage);
    } catch {}
  } catch (e: any) {
    showError(
      e?.name === 'NoSuchBucket'
        ? STAGE_PANEL_TEXT.errors.noBucket
        : STAGE_PANEL_TEXT.files.uploadError,
    );
  }
}

/** Нормализация имени файла для ключа */
export const sanitizeName = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-');

/** суффикс */
export const rnd = (len = 6) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + len);

/** YYYYMMDD */
export const yyyymmdd = (d = new Date()) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
