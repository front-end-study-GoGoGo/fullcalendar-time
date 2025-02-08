<template>
  <el-dialog
    :model-value="open"
    :title="title"
    center
    class="max-w-[500px]"
    @close="onCancel"
  >
    <el-form
      ref="formRef"
      :model="form"
      size="small"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>

      <el-form-item label="全天" prop="allDay">
        <el-switch v-model="form.allDay" />
      </el-form-item>

      <el-form-item label="开始时间" prop="start">
        <el-date-picker
          v-model="form.start"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="结束时间" prop="end">
        <el-date-picker
          v-model="form.end"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="颜色" prop="color">
        <el-color-picker
          v-model="form.color"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div v-if="type === 'edit'" class="flex justify-between">
        <el-button @click="handleDelete">删除</el-button>
        <div>
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="handleOk">OK</el-button>
        </div>
      </div>
      <div v-else class="flex justify-end">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="handleOk">OK</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

export type CalendarEventFormFieldType = {
  id: string
  title: string
  description?: string
  allDay: boolean
  color?: string
  start?: string
  end?: string
}

const props = defineProps<{
  type: 'edit' | 'add'
  open: boolean
  onCancel: VoidFunction
  onEdit: (event: CalendarEventFormFieldType) => void
  onCreate: (event: CalendarEventFormFieldType) => void
  onDelete: (id: string) => void
  initValues: CalendarEventFormFieldType
}>()

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const title = ref()
const formRef = ref()
let form = ref<CalendarEventFormFieldType>({
  id: '',
  title: '',
  description: '',
  allDay: false,
  color: '',
  start: '',
  end: '',
})

const rules = {
  title: [{ required: true, message: '请输入标题！', trigger: 'blur' }],
  start: [{ required: true, message: '请输入开始日期！', trigger: 'blur' }],
  end: [{ required: true, message: '请输入结束日期！', trigger: 'blur' }],
}

watch(
  () => props.initValues,
  (newVal) => {
    form.value = {
      ...newVal,
      allDay: newVal.allDay || false, // 确保 allDay 的初始值为 false
      start: dayjs(newVal.start).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs(newVal.end).format('YYYY-MM-DD HH:mm:ss'),
      color: newVal.color || '#00a76f',
    }
    title.value = props.type === 'add' ? '添加事件' : '编辑事件'
  },
  { immediate: true }
)

const handleOk = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const event = { ...form.value, id: props.initValues.id }
      if (props.type === 'add') props.onCreate(event)
      if (props.type === 'edit') props.onEdit(event)
      props.onCancel()
    } else {
      console.log('Validate Failed')
    }
  })
}

const handleDelete = () => {
  ElMessageBox.confirm('您确定要删除此事件吗？', 'Warning', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning',
  }).then(() => {
    props.onDelete(props.initValues.id)
    props.onCancel()
  })
}
</script>

<style scoped></style>
