<template>
  <v-dialog v-model="isVisible" max-width="500px">
    <v-card>
      <v-card-title class="headline">Hata</v-card-title>
      <v-card-text>
        <p>{{ message }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green darken-1" text @click="closeDialog"> Kapat </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  dialogVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:dialogVisible']);

// Computed ile `dialogVisible` değerini yönetiyoruz
const isVisible = computed({
  get: () => props.dialogVisible,
  set: (value) => emit('update:dialogVisible', value),
});

const closeDialog = () => {
  isVisible.value = false;
};
</script>
