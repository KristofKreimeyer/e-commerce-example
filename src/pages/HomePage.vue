<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features -->
    <FeatureSection />

    <!-- Categories -->
    <FeaturedCategories />

    <!-- Featured Products -->
    <FeaturedProducts />

    <!-- Newsletter -->
    <NewsletterComponent />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import FeaturedCategories from '@/components/FeaturedCategories.vue'
import FeaturedProducts from '@/components/FeaturedProducts.vue'
import NewsletterComponent from '@/components/NewsletterComponent.vue'
</script>
