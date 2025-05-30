export interface Props {
  plan: number;
  ppr: number;
  request: number;
  work: number;
  step: number;
  onStep?: () => void;
  customIcon?: React.ReactNode;
  title?: string;
}
