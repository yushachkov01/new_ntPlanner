export type Status =
  | 'done'
  | 'done_on_time'
  | 'overtime'
  | 'pending_manual'
  | 'pending_auto'
  | 'info';

export interface SubStep {
  id: number;
  label: string;
}

export interface BlockData {
  id: number;
  startTime: string;
  endTime: string;
  label: string;
  status?: Status;
  subSteps?: SubStep[];
}

export interface UserData {
  id: number;
  name: string;
  blocks: BlockData[];
}

export interface TaskDetailProps {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  performer: string;
  status?: Status;
  subSteps?: SubStep[];
  onClose: () => void;
  /**
   * Если нужно передать данные (id, файл, описание) наверх
   */
  onMarkDone?: (id: number, file: UploadedFile | null, description: string) => void;
}
export type UploadedFile = {
  name: string;
  type: string;
  url: string;
};

export interface TimelineBlockProps {
  block: BlockData;
  totalWindowMin: number;
  expandedBlockId: number | null;
  setExpandedBlockId: (id: number | null) => void;
  onDoubleClickBlock: (id: number) => void;
  isCovered: boolean;
}
