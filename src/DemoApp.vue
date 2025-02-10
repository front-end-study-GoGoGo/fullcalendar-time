<script setup lang="ts" name="Home">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { faker } from '@faker-js/faker' // 用于生成id, 有后端就不用这个
// import { addCalendarEvents, updateCalendarEvents, deleteCalendarEvents } from "@/api/home"; // 后端接口
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core'
import { INITIAL_EVENTS } from './event-utils' // 初始化事件, 有后端就不用INITIAL_EVENTS, 改为fetchInitialEvents, createEventId创建id
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list' // 提供 listWeek view
import CalendarEventForm, { CalendarEventFormFieldType } from './calendar-event-form.vue'
import CalendarHeader, { HandleMoveArg, ViewType } from './calendar-header.vue'

// 默认事件初始化值
const DefaultEventInitValue = {
  id: '',
  title: '',
  description: '',
  allDay: false,
  start: dayjs().format(),
  end: dayjs().format(),
  color: ''
}

const open = ref(false)
const fullCalendarRef = ref()
const eventInitValue = ref<CalendarEventFormFieldType>(DefaultEventInitValue)
const eventFormType = ref<'add' | 'edit'>('add') // 事件表单的类型（添加或编辑）
const view = ref<ViewType>('dayGridMonth')
const date = ref(dayjs().toDate())

/**
 * 日历网格事件处理
 */
// 选择日期范围
function handleDateSelect(selectInfo: DateSelectArg) {
  if (selectInfo.view.type === 'dayGridMonth' && isOneDayApart(selectInfo.startStr, selectInfo.endStr)) {
    // 在月视图模式下选择的是一天，则自动切换到日视图
    const calendarApi = fullCalendarRef.value!.getApi()
    handleViewTypeChange('timeGridDay')
    date.value = selectInfo.start
    calendarApi.gotoDate(selectInfo.start)
    return
  }
  open.value = true
  eventFormType.value = 'add'
  let calendarApi = selectInfo.view.calendar
  calendarApi.unselect() // clear date selection
  selectInfo.allDay = false

  eventInitValue.value = {
    id: '',
    title: '',
    description: '',
    allDay: selectInfo.allDay,
    start: dayjs(selectInfo.startStr).format(),
    end: dayjs(selectInfo.endStr).format(),
    color: ''
  }
}
/**
 * 日历事件处理
 */
// 点击事件并打开模态框
const handleEventClick = (arg: EventClickArg) => {
  const { title, extendedProps, allDay, start, end, backgroundColor, id } = arg.event
  open.value = true
  eventFormType.value = 'edit'
  const newEventValue: CalendarEventFormFieldType = {
    id,
    title,
    allDay,
    color: backgroundColor,
    description: extendedProps.description
  }
  if (start) {
    newEventValue.start = dayjs(start).format()
  }

  if (end) {
    newEventValue.end = dayjs(end).format()
  }
  eventInitValue.value = newEventValue
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  headerToolbar: false,
  initialView: view.value,
  views: {
    timeGridWeek: {
      type: 'timeGrid',
      allDaySlot: false
    },
    timeGridDay: {
      type: 'timeGrid',
      allDaySlot: false
    }
  },
  locale: 'zh-cn',
  firstDay: 1,
  events: INITIAL_EVENTS, // 初始化事件, 可以改为获取后端数据 fetchInitialEvents
  droppable: true,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick
} as CalendarOptions)

/**
 * 日历头部事件处理
 */
const handleMove = (action: HandleMoveArg) => {
  const calendarApi = fullCalendarRef.value!.getApi()
  switch (action) {
    case 'prev':
      calendarApi.prev()
      break
    case 'next':
      calendarApi.next()
      break
    case 'today':
      calendarApi.today()
      break
    default:
      break
  }
  date.value = calendarApi.getDate()
}

// 取消事件
const handleCancel = () => {
  eventInitValue.value = DefaultEventInitValue
  open.value = false
}

// 删除事件
const handleDelete = async (id: string) => {
  const calendarApi = fullCalendarRef.value!.getApi()
  const oldEvent = calendarApi.getEventById(id)
  // await deleteCalendarEvents(Number(id)); // 后端
  oldEvent?.remove()
}

// 创建事件
const handleCreate = async (values: CalendarEventFormFieldType) => {
  const calendarApi = fullCalendarRef.value!.getApi()
  const { title = '', description, start, end, allDay, color } = values
  const newEvent: EventInput = {
    id: faker.string.uuid(), // 改为数据库中的最大id + 1, 往后顺延 createEventId
    title,
    allDay,
    color,
    extendedProps: {
      description
    }
  }
  if (start) newEvent.start = start
  if (end) newEvent.end = end
  // await addCalendarEvents(newEvent); // 后端
  // 刷新日历显示
  calendarApi.addEvent(newEvent)
}

// 编辑事件
const handleEdit = async (values: CalendarEventFormFieldType) => {
  const { id, title = '', description, start, end, allDay = false, color } = values
  const calendarApi = fullCalendarRef.value!.getApi()
  const oldEvent = calendarApi.getEventById(id)

  const newEvent: EventInput = {
    id,
    title,
    allDay,
    color,
    extendedProps: {
      description
    }
  }
  if (start) newEvent.start = start
  if (end) newEvent.end = end
  // await updateCalendarEvents(newEvent); // 后端
  // 刷新日历显示
  oldEvent?.remove()
  calendarApi.addEvent(newEvent)
}

const handleViewTypeChange = (newView: ViewType) => {
  const calendarApi = fullCalendarRef.value!.getApi()
  calendarApi.changeView(newView)
  view.value = newView
}

const isOneDayApart = (date1: string | Date, date2: string | Date): boolean => {
  const day1 = dayjs(date1).startOf('day')
  const day2 = dayjs(date2).startOf('day')
  const diffInDays = day2.diff(day1, 'day')
  return Math.abs(diffInDays) === 1
}
</script>

<template>
  <el-card>
    <div class="StyledCalendar">
      <CalendarHeader :now="date" :view="view" :onMove="handleMove" :onCreate="() => (open = true)" :onViewTypeChange="handleViewTypeChange" />
      <FullCalendar ref="fullCalendarRef" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <div class="fc-event-main-wrapper" :style="{ color: arg.backgroundColor }">
            <div class="fc-event-main-frame">
              <div class="fc-event-time">{{ arg.timeText }}</div>
              <div class="fc-event-title-container">
                <div class="fc-event-title fc-sticky">
                  {{ arg.event.title }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
    <CalendarEventForm :open="open" :type="eventFormType" :initValues="eventInitValue" :onCancel="handleCancel" :onDelete="handleDelete" :onCreate="handleCreate" :onEdit="handleEdit" />
  </el-card>
</template>

<style lang="scss" scoped></style>
