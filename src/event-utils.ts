import { faker } from '@faker-js/faker'; // 生成伪事件, 有后端就不用这个
import { EventInput } from '@fullcalendar/core';
// import { getCalendarEvents } from "@/api/home"; // 后端接口用于获取数据
import dayjs from 'dayjs';

// let eventGuid = 0;
// /** 生成事件id, 跟后端接口配合使用  */
// export function createEventId() {
//   return String(eventGuid++);
// }

/** 初始化事件, 生成随机事件用于展示, 有后端就不用这个 */
export const INITIAL_EVENTS: EventInput[] = [
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().toISOString(),
    end: dayjs().add(10, 'hour').toISOString(),
    color: '#7a0916',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().add(1, 'day').toISOString(),
    end: dayjs().add(3, 'day').toISOString(),
    allDay: false,
    color: '#00b8d9',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().add(3, 'day').toISOString(),
    end: dayjs().add(5, 'day').toISOString(),
    allDay: false,
    color: '#ff5630',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().add(7, 'day').toISOString(),
    end: dayjs().add(8, 'day').toISOString(),
    allDay: false,
    color: '#ffab00',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().add(7, 'day').toISOString(),
    end: dayjs().add(8, 'day').toISOString(),
    allDay: false,
    color: '#ffab00',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().add(8, 'day').toISOString(),
    end: dayjs().add(9, 'day').toISOString(),
    allDay: false,
    color: '#8e33ff',
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    start: dayjs().add(10, 'day').toISOString(),
    end: dayjs().add(11, 'day').toISOString(),
    color: '#00a76f',
  },
];

/** 获取后端初始事件 */
// export async function fetchInitialEvents(): Promise<EventInput[]> {
//   try {
//     const response = await getCalendarEvents();
//     if (response.code === 0) {
//       const events = response.result.map((event: any) => ({
//         id: event.id || createEventId(),
//         title: event.title,
//         start: event.start,
//         end: event.end,
//         allDay: event.allDay,
//         color: event.color,
//         description: event.description
//       }));

//       // 找到最大 id
//       const maxId = Math.max(
//         ...events.map(event => parseInt(event.id, 10)).filter(id => !isNaN(id)),
//         0
//       );

//       // 设置 eventGuid 为最大 id 加 1
//       eventGuid = maxId + 1;

//       return events;
//     } else {
//       console.error("Failed to fetch events:", response.message);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     return [];
//   }
// }