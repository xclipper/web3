<template>
  <v-layout style="width:">
    <pgAppBar />
    <pgSidebar />

    <v-main style="min-height: 450px; min-width: 1200px; border-style: none; padding-top: 0%">
      <RouterView />
    </v-main>
    <pgFooter />
  </v-layout>
</template>

<script>
import pgSidebar from './components/sidebar.vue'
import pgFooter from './components/footer.vue'
import pgAppBar from './components/appBar.vue'

export default {
  components: {
    pgSidebar,
    pgFooter,
    pgAppBar,
  },
}
</script>
