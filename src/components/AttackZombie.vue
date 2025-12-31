vue Copy
<template>
  <v-container fluid class="text-center pa-0 ma-0">
    <v-card>
      <!-- Kapatma butonu (sağ üst köşede) -->
      <v-btn icon class="float-right ma-2" @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="headline">Create New Zombie</v-card-title>

      <v-card-text>
        <!-- 1. Select alanı -->
        <v-select
          v-model="myZombie"
          :items="myZombieArmy"
          label="Select zombie type"
          outlined
          class="mt-4"
        ></v-select>

        <!-- 2. Select alanı -->
        <v-select
          v-model="enemyZombie"
          :items="enemyZombieArmy"
          label="Select zombie attribute"
          outlined
          class="mt-4"
        ></v-select>
      </v-card-text>

      <v-card-actions>
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
    myZombieArmy: {
      type: [],
      default: () => [],
    },
    enemyZombieArmy: {
      type: [],
      default: () => [],
    },
  },
  data() {
    return {
      AppState: useWalletStore(),
      enemyZombie: '',
      myZombie: '',
    };
  },
  methods: {
    attackZombie() {
      if (this.myZombie !== '' && this.enemyZombie) {
      }
      this.$emit('attack', {
        atackedOne: this.myZombie,
        toBeAttckedOne: this.enemyZombie,
      });
      this.closePopup();
    },
  },
  closePopup() {
    this.$emit('closePopup');
  },
};
</script>
