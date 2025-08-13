<template>
  <!-- Hauptbild Swiper -->
  <swiper
    :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }"
    :spaceBetween="10"
    :navigation="true"
    :thumbs="{ swiper: thumbsSwiper }"
    :modules="modules"
    class="mySwiper2"
  >
    <swiper-slide v-for="(img, index) in images" :key="index">
      <img :src="img" />
    </swiper-slide>
  </swiper>

  <!-- Thumbnail Swiper -->
  <swiper
    class="mySwiper"
    :modules="modules"
    :spaceBetween="10"
    :slidesPerView="4"
    :watchSlidesProgress="true"
    @swiper="setThumbsSwiper"
  >
    <swiper-slide v-for="(img, index) in images" :key="'thumb-' + index">
      <img :src="img" />
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'

// Props
defineProps<{
  images: string[]
}>()

// Swiper setup

const thumbsSwiper = ref<SwiperClass | null>(null)
function setThumbsSwiper(swiper: SwiperClass) {
  thumbsSwiper.value = swiper
}

const modules = [FreeMode, Navigation, Thumbs]
</script>

<style scoped>
/* Basis-Swiper-Container */
.swiper {
  width: 100%;
}

/* Haupt-Slider (großes Bild) */
.mySwiper2 {
  aspect-ratio: 1 / 1; /* erzwingt quadratischen Container */
  width: 100%;
  max-width: 500px; /* optional: begrenze Breite auf Desktop */
  margin: 0 auto;
  background-color: #eceef0; /* optional: Hintergrundfarbe */
  border-radius: 5%;
  padding: 20px;
}

/* Bilder im Haupt-Slider */
.mySwiper2 .swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

/* Thumbnail-Slider */
.mySwiper {
  height: auto;
  box-sizing: border-box;
  margin-top: 50px;
}

/* Thumbnail-Bilder */
.mySwiper .swiper-slide {
  aspect-ratio: 1 / 1; /* quadratische Thumbnails */
  opacity: 0.4;
  transition: opacity 0.3s ease;
  background-color: #eceef0; /* optional: Hintergrundfarbe */
  border-radius: 5%;
  padding: 20px;
}

/* Aktives Thumbnail */
.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}
</style>
