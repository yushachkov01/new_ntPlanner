import type { Work } from 'entities/work/model/types';

import type { WorkDto } from './types';

export function mapWorkDtoToWork(dto: WorkDto): Work {
  return {
    id: dto.id,
    date: dto.date,
    project: dto.project,
    site: dto.site,
    description: dto.description,
    timeRange: dto.time_range,
    status: dto.status as Work['status'],
    pprHours: dto.ppr_hours,
    workHours: dto.work_hours,
    overtimeHours: dto.overtime_hours,
  };
}
