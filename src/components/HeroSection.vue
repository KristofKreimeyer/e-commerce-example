<template>
  <!-- Hero Section -->
  <section class="relative bg-white overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
    <div class="relative max-w-6xl mx-auto px-6 py-24">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-6xl md:text-8xl font-light apple-text mb-6 tracking-tight">Premium</h1>
        <h2 class="text-4xl md:text-6xl font-light gradient-text mb-8 tracking-tight">
          Shopping Experience
        </h2>
        <p class="text-xl apple-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          Entdecke außergewöhnliche Produkte mit der Qualität und dem Design, die du verdienst.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonComponent
            type="button"
            size="lg"
            variant="primary"
            class="apple-button text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg cursor-pointer"
          >
            Kollektion entdecken
          </ButtonComponent>

          <ButtonComponent
            type="button"
            size="lg"
            variant="outline"
            class="border border-gray-300 apple-text px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 cursor-pointer"
          >
            Mehr erfahren
          </ButtonComponent>
        </div>
      </div>
    </div>
  </section>
</template>
