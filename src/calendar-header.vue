<template>
  <div class="relative flex items-center justify-between py-5">
    <el-dropdown @command="handleMenuClick" >
      <el-button size="small">
        <div class="flex items-center">
          <iconify-icon :icon="currentView.icon" />
          <span class="mx-1 text-sm font-medium">{{ currentView.label }}</span>
          <SolarAltArrowDownOutline />
        </div>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in items"
            :key="item.key"
            :command="item.key"
          >
            <iconify-icon :icon="item.icon" />
            <span class="mx-1 text-sm font-medium">{{ item.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="flex items-center justify-center">
      <!-- <SolarAltArrowLeftOutline @click="() => onMove('prev')" /> -->
      <iconify-icon icon="solar:alt-arrow-left-outline" class="mr-1 cursor-pointer text-2xl" @click="() => onMove('prev')"></iconify-icon>
      <span class="mx-2 text-lg font-bold">{{ formattedDate }}</span>
      <!-- <SolarAltArrowRightOutline @click="() => onMove('next')" /> -->
      <iconify-icon icon="solar:alt-arrow-right-outline" class="ml-1 cursor-pointer text-2xl" @click="() => onMove('next')"></iconify-icon>
    </div>

    <div class="flex items-center">
      <el-button type="primary" @click="() => onMove('today')">今天</el-button>
      <iconify-icon icon="icon-park:add" class="ml-2 cursor-pointer text-4xl" @click="onCreate"></iconify-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";

// import SolarAltArrowLeftOutline from "~icons/solar/alt-arrow-left-outline";
// import SolarAltArrowRightOutline from "~icons/solar/alt-arrow-right-outline";

export type HandleMoveArg = "next" | "prev" | "today";
export type ViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";

type ViewTypeMenu = {
  key: string;
  label: string;
  view: ViewType;
  icon: any;
};

const props = defineProps<{
  now: Date;
  view: ViewType;
  onMove: (action: HandleMoveArg) => void;
  onCreate: VoidFunction;
  onViewTypeChange: (view: ViewType) => void;
}>();

const items = ref<ViewTypeMenu[]>([
  {
    key: "1",
    label: "月",
    view: "dayGridMonth",
    icon: "mdi:calendar-month-outline",
  },
  {
    key: "2",
    label: "周",
    view: "timeGridWeek",
    icon: "mdi:calendar-weekend-outline",
  },
  {
    key: "3",
    label: "日",
    view: "timeGridDay",
    icon: "mdi:calendar-today-outline",
  },
  {
    key: "4",
    label: "列表",
    view: "listWeek",
    icon: "mdi:view-agenda-outline",
  },
]);

const handleMenuClick = (command: string) => {
  const selectedViewType = items.value.find((item) => item.key === command);
  if (selectedViewType) {
    props.onViewTypeChange(selectedViewType.view);
    // console.log(`viewType "${command}" is selected.`);
  } else {
    console.error(`viewType "${command}" is not available.`);
  }
};

const currentView = computed(
  () => items.value.find((item) => item.view === props.view) || items.value[0]
);

const formattedDate = computed(() => dayjs(props.now).format("YYYY年 MM月 DD日"));
</script>

<style scoped></style>
