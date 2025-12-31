<template>
  <v-container fluid class="text-center pa-0 ma-0">
    <v-card>
      <!-- Kapatma butonu (sağ üst köşede) -->
      <v-btn icon class="float-right ma-2" @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="headline">Create New Zombie</v-card-title>

      <v-card-text>
        <!-- Text input alanı -->
        <v-text-field
          v-model="inputValue"
          label="Enter a zombie name"
          outlined
          class="mt-4"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <div>
          <!-- LOADING işi-->
          <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

          <div v-else>
            <!-- İçerik burada -->
          </div>
        </div>

        <v-spacer></v-spacer>
        <!-- Kaydet butonu -->
        <v-btn color="primary" @click="createZombie()"> Kaydet </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
//import { ref } from 'vue';
//import * as utils from '../utils';
import { useWalletStore } from '@/stores/wallet';

export default {
  props: {
    loading: false,
  },
  data() {
    return {
      AppState: useWalletStore(),
      inputValue: '',
    };
  },
  methods: {
    createZombie() {
      if (this.inputValue !== '') {
        this.AppState.zombieName = this.inputValue;
        this.closePopup();
      }
    },
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>
