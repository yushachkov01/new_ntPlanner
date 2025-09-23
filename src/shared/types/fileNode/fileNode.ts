import {Rule} from "antd/es/form";

/** Узел декларативного дерева для рендера */
export type FieldNode =
    | {
    kind: 'field';
    key: string;
    label: string;
    rawType: string;
    widget: 'input' | 'number' | 'checkbox' | 'select' | 'textarea' | 'radio';
    options?: Array<{ label: string; value: any }>;
    rules?: Rule[];
    /** множественный выбор для select */
    multiple?: boolean;
    /** числовые ограничения (если есть) */
    min?: number;
    max?: number;
    step?: number;
    /** плейсхолдер, если задан в схеме */
    placeholder?: string;
}
    | {
    kind: 'interface';
    key: string;
    label: string;
    requestType?: string;
    withVlan?: boolean;
    /** множественный выбор интерфейсов (для коллекций) */
    multiple?: boolean;
};
