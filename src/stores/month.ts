import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMonthStore = defineStore('monthSelected', () => {
  const month = ref<Month>()
  function saveMonth(selectedMonth: Month) {
    month.value = selectedMonth
  }

  function getMonth() {
    return month.value as Month
  }

  return { month, saveMonth, getMonth }
})
