import type { Status } from '../model/types.ts';

export function getStatusClass(status: Status): string {
  switch (status) {
    case 'pending_manual':
    case 'pending_auto':
    case 'info':
      return 'timeline-block--info';
    case 'done_on_time':
      return 'timeline-block--ontime';
    case 'overtime':
      return 'timeline-block--overtime';
    default:
      return '';
  }
}
