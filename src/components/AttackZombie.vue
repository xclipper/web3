<template>
  <v-container fluid class="text-center pa-0 ma-0">
    <v-card>
      <!-- Kapatma butonu (sağ üst köşede) -->
      <v-btn icon class="float-right ma-2" @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="headline">Attack a Zombie</v-card-title>

      <v-card-text>
        <!-- Select alanı -->
        <v-select
          v-model="enemyZombie"
          :items="enemyZombieArmy"
          item-title="name"
          item-value="id"
          label="Select target zombie"
          outlined
          :loading="loading"
          class="mt-4"
        ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- Kaydet butonu -->
        <v-btn color="primary" @click="attackZombie()"> Start Attack </v-btn>
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
    enemyZombieArmy: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      AppState: useWalletStore(),
      enemyZombie: '',
    };
  },
  methods: {
    attackZombie() {
      if (this.enemyZombie !== '') {
        this.$emit('attackzombie', {
          toBeAttackedID: this.enemyZombie,
        });
        this.closePopup();
      }
    },
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>
