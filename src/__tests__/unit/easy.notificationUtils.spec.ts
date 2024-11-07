import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const events: Event[] = [
  {
    id: '0',
    title: '팀 회의',
    date: '2024-10-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 회의',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '팀 점심',
    date: '2024-10-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 점심',
    location: '식당',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '3',
    title: '팀 미팅',
    date: '2024-10-05',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const upcomingEvents = getUpcomingEvents(events, new Date('2024-10-01T09:59'), []);
    expect(upcomingEvents).toEqual([events[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const upcomingEvents1 = getUpcomingEvents(events, new Date('2024-10-01T09:59'), ['0']);
    expect(upcomingEvents1).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const upcomingEvents = getUpcomingEvents(events, new Date('2024-10-01T09:00'), []);
    expect(upcomingEvents).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const upcomingEvents = getUpcomingEvents(events, new Date('2024-10-01T12:00'), []);
    expect(upcomingEvents).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const notificationMessage = createNotificationMessage(events[0]);
    expect(notificationMessage).toBe('1분 후 팀 회의 일정이 시작됩니다.');
  });
});
