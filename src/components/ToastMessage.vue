<template>
  <Teleport to="body">
    <!-- Gruppiere Toasts nach Position -->
    <div
      v-for="(groupedToasts, position) in toastsByPosition"
      :key="position"
      :class="getContainerClasses(position as ToastPosition)"
      class="fixed z-[1000] space-y-2 w-[min(92vw,360px)]"
      aria-atomic="true"
    >
      <div
        v-for="t in groupedToasts"
        :key="t.id"
        :role="t.type === 'error' ? 'alert' : 'status'"
        :aria-live="t.type === 'error' ? 'assertive' : 'polite'"
        class="rounded-2xl border bg-white/95 backdrop-blur p-4 shadow-lg transition-all will-change-transform"
      >
        <p class="apple-text text-sm">{{ t.message }}</p>

        <div class="mt-3 flex items-center gap-2">
          <button
            v-if="t.actionLabel"
            type="button"
            class="text-sm underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            @click="(t.onAction?.(), dismiss(t.id))"
          >
            {{ t.actionLabel }}
          </button>

          <button
            type="button"
            class="ml-auto rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toast schließen"
            @click="dismiss(t.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useToast, type ToastPosition } from '@/hooks/useToast'

const { toasts, dismiss } = useToast()

// Gruppiere Toasts nach Position
const toastsByPosition = computed(() => {
  return toasts.value.reduce(
    (groups, toast) => {
      const position = toast.position || 'top-right'
      if (!groups[position]) {
        groups[position] = []
      }
      groups[position].push(toast)
      return groups
    },
    {} as Record<string, typeof toasts.value>,
  )
})

// Generiere Container-Klassen basierend auf Position
const getContainerClasses = (position: ToastPosition): string => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  return positionClasses[position] || positionClasses['top-right']
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && toasts.value.length) {
    // Letzten Toast schließen
    const last = toasts.value[toasts.value.length - 1]
    dismiss(last.id)
  }
}

onMounted(() => window.addEventListener('keydown', onEsc))
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))
</script>

<style>
@media (prefers-reduced-motion: reduce) {
  .will-change-transform {
    transition: none !important;
  }
}
</style>
