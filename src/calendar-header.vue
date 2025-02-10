<template>
  <div class="relative flex items-center justify-between py-5">
    <el-radio-group v-model="tabSelect">
      <el-radio-button v-for="item in items" :key="item.key" :value="item.key" @click="handleMenuClick(item.key)">
        <div class="flex">
          <span class="mr-1px"><iconify-icon :icon="item.icon" /></span>
          <span>{{ item.label }}</span>
        </div>
      </el-radio-button>
    </el-radio-group>

    <div class="flex items-center justify-center">
      <iconify-icon icon="solar:alt-arrow-left-outline" class="mr-1 text-2xl cursor-pointer" @click="() => onMove('prev')"></iconify-icon>
      <span class="mx-2 text-lg font-bold">{{ formattedDate }}</span>
      <iconify-icon icon="solar:alt-arrow-right-outline" class="ml-1 text-2xl cursor-pointer" @click="() => onMove('next')"></iconify-icon>
    </div>

    <div class="flex items-center">
      <el-button type="primary" @click="() => onMove('today')">今天</el-button>
      <el-button type="primary" @click="onCreate">新建</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

export type HandleMoveArg = 'next' | 'prev' | 'today'
export type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'

type ViewTypeMenu = {
  key: string
  label: string
  view: ViewType
  icon: any
}

const props = defineProps<{
  now: Date
  view: ViewType
  onMove: (action: HandleMoveArg) => void
  onCreate: VoidFunction
  onViewTypeChange: (view: ViewType) => void
}>()

const items = ref<ViewTypeMenu[]>([
  {
    key: '1',
    label: '月',
    view: 'dayGridMonth',
    icon: 'mdi:calendar-month-outline'
  },
  {
    key: '2',
    label: '周',
    view: 'timeGridWeek',
    icon: 'mdi:calendar-weekend-outline'
  },
  {
    key: '3',
    label: '日',
    view: 'timeGridDay',
    icon: 'mdi:calendar-today-outline'
  }
  // {
  //   key: '4',
  //   label: '列表',
  //   view: 'listWeek',
  //   icon: 'mdi:view-agenda-outline'
  // }
])

const tabSelect = ref<'1' | '2' | '3'>('1')

const handleMenuClick = (command: string) => {
  console.log('command', command)
  const selectedViewType = items.value.find(item => item.key === command)
  if (selectedViewType) {
    props.onViewTypeChange(selectedViewType.view)
  } else {
    console.error(`viewType "${command}" is not available.`)
  }
}

const currentView = computed(() => items.value.find(item => item.view === props.view) || items.value[0])
console.log('currentView', currentView.value)

const formattedDate = computed(() => dayjs(props.now).format('YYYY年 MM月 DD日'))

watch(
  currentView,
  () => {
    tabSelect.value = currentView.value.key as any
  },
  { immediate: true }
)
</script>

<style scoped></style>
