import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

// toBeInstanceOf : 기대값인 instance가 해당 클래스에 속하는지 확인
describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const dateTime = parseDateTime('2024-11-10', '09:00');
    expect(dateTime).toBeInstanceOf(Date);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const dateTime = parseDateTime('2024-11-10?', '09:00');
    expect(isNaN(dateTime.getDate())).toBe(true);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const dateTime = parseDateTime('2024-11-10', '09-00');
    expect(isNaN(dateTime.getTime())).toBe(true);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const dateTime = parseDateTime('', '09-00');
    expect(isNaN(dateTime.getDate())).toBe(true);
  });
});

describe('convertEventToDateRange', () => {
  const event: Event = {
    id: '1',
    title: '팀 회의',
    date: '2024-11-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  };

  const resultDateRange = {
    start: new Date(`${event.date}T${event.startTime}`),
    end: new Date(`${event.date}T${event.endTime}`),
  };

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    expect(convertEventToDateRange(event)).toEqual(resultDateRange);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    expect(isNaN(convertEventToDateRange(event).start.getDate())).toBe(false);
    expect(isNaN(convertEventToDateRange(event).end.getDate())).toBe(false);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    expect(isNaN(convertEventToDateRange(event).start.getTime())).toBe(false);
    expect(isNaN(convertEventToDateRange(event).end.getTime())).toBe(false);
  });
});

describe('isOverlapping', () => {
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
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const overlapping = isOverlapping(events[0], events[1]);
    expect(overlapping).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const overlapping = isOverlapping(events[0], events[2]);
    expect(overlapping).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '팀 회의',
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '2',
      title: '팀 회의',
      date: '2024-11-11',
      startTime: '12:00',
      endTime: '15:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '3',
      title: '팀 회의',
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      title: '팀 회의',
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    const overlappingEvents = findOverlappingEvents(newEvent, events);

    expect(overlappingEvents.map((event) => event.id)).toEqual(['1', '3']);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '5',
      title: '팀 미팅33',
      date: '2024-10-08',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅222',
      location: '사무실222',
      category: '업무22',
      repeat: { type: 'none', interval: 2 },
      notificationTime: 4,
    };
    const overlappingEvents = findOverlappingEvents(newEvent, events);
    expect(overlappingEvents).toEqual([]);
  });
});
