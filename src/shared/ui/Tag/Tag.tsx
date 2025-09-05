import React from 'react';
import type { FC, ReactNode } from 'react';
import './Tag.css';

export type TagVariant = 'default' | 'success' | 'danger';

export interface TagProps {
  /** Текст/содержимое тега */
  children: ReactNode;
  variant?: TagVariant;
  /** Дополнительные классы */
  className?: string;
  /** Тонкая версия (ниже высота/паддинги) */
  thin?: boolean;
  /** Заголовок для тултипа */
  title?: string;
  /** Все теги стадии */
  allTags?: string[];
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/**
 * - "пдс" -> success (зелёный)
 * - "rollback" ->  danger (красный)
 * Остальные -> default (серый).
 */
const Tag: FC<TagProps> = ({ children, variant, className, thin, title, allTags }) => {
  const text = String(children ?? '').trim();

  const autoVariant: TagVariant = React.useMemo(() => {
    if (variant) return variant;

    if (allTags && allTags.length > 0) {
      const normalizedTags = allTags.map((tags) => String(tags).trim().toLowerCase());
      if (normalizedTags.includes('rollback')) {
        return 'danger';
      }
      if (normalizedTags.includes('пдс')) {
        return 'success';
      }
      return 'default';
    }

    const norm = text.toLocaleLowerCase('ru-RU');

    if (norm === 'rollback' || norm === 'rb' || norm === 'откат') {
      return 'danger';
    }
    if (norm === 'пдс' || norm === 'pds') {
      return 'success';
    }
    return 'default';
  }, [text, variant]);

  return (
    <span
      role="status"
      className={cx(
        'tag',
        thin && 'tag--thin',
        autoVariant === 'success' && 'tag--success',
        autoVariant === 'danger' && 'tag--danger',
        autoVariant === 'default' && 'tag--default',
        className,
      )}
      title={title ?? text}
      aria-label={text}
    >
      {text}
    </span>
  );
};

export default Tag;
