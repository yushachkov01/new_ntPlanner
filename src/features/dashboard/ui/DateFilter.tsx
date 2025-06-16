import { CalendarOutlined } from '@ant-design/icons';
import { Popover, DatePicker } from 'antd';
import ruRU from 'antd/es/date-picker/locale/ru_RU';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { FC } from 'react';
import '@/pages/DashboardPage/ui/DashboardPage.css';

const { RangePicker } = DatePicker;

interface Props {
  visible: boolean;
  onVisibleChange: (v: boolean) => void;
  onDateChange: (vals: [Dayjs, Dayjs] | null) => void;
}

export const DateFilter: FC<Props> = ({ visible, onVisibleChange, onDateChange }) => (
  <Popover
    content={
      <div className="popover-inner">
        <div className="popover-title">Фильтр по дате</div>
        <RangePicker
          locale={ruRU}
          allowClear
          onChange={(vals) => {
            if (vals && vals[0] && vals[1]) onDateChange(vals as any);
            else onDateChange(null);
          }}
        />
      </div>
    }
    trigger="click"
    visible={visible}
    onVisibleChange={onVisibleChange}
    placement="bottom"
  >
    <CalendarOutlined className={`calendar-icon ${visible ? 'on' : ''}`} />
  </Popover>
);
