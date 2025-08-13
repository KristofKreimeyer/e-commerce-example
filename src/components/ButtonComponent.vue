<!-- BaseButton.vue -->
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-full font-medium gap-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[sizeClasses, variantClasses, loading ? 'cursor-wait' : 'cursor-pointer']"
    @click="(ev: any) => emit('click', ev)"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type BtnType = 'button' | 'submit' | 'reset'
type Variant = 'primary' | 'outline' | 'icon'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    type?: BtnType
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
)

// Varianten aus deinen Beispielen (nutzt deine Custom-Klassen weiter)
const VARIANTS: Record<Variant, string> = {
  // fängt hover:scale-105 & shadow ab; apple-button liefert dein Gradient o.ä.
  primary: 'apple-button text-white shadow-lg hover:scale-105',
  // Border + ruhige Hover-Fläche
  outline: 'border border-gray-300 apple-text hover:bg-gray-50',
  // kompakter, runder Icon-Button mit leichtem Blur-Hintergrund
  icon: 'bg-white/80 apple-blur hover:bg-white',
}

// Text-Button Padding/Font aus deinen Snippets
const TEXT_SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-4 text-lg',
}

// Icon-Button feste Kantenlängen (Beispiel 2: w-10 h-10)
const ICON_SIZES: Record<Size, string> = {
  sm: 'w-8 h-8 text-sm p-0',
  md: 'w-10 h-10 text-base p-0',
  lg: 'w-12 h-12 text-lg p-0',
}

const variantClasses = computed(() => VARIANTS[props.variant])
const sizeClasses = computed(() =>
  props.variant === 'icon' ? ICON_SIZES[props.size] : TEXT_SIZES[props.size],
)

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()
</script>
