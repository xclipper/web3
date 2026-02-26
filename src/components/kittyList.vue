<template>
  <v-container fluid class="text-center pa-0 ma-0">
    <v-card>
      <!-- Kapatma butonu (sağ üst köşede) -->
      <v-btn icon class="float-right ma-2" @click="closePopup()">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="headline">🐱 Select a CryptoKitty</v-card-title>

      <v-card-text>
        <!-- 2 sütunlu Kitty grid -->
        <v-row>
          <!-- 4 Kitty için 2'şer sütun (6+6=12) -->
          <v-col v-for="kitty in kittyList" :key="kitty.id" cols="6">
            <v-card
              :class="['kitty-card', { 'selected-card': selectedKittyId === kitty.id }]"
              @click="selectedKittyId = kitty.id"
              variant="outlined"
              :color="selectedKittyId === kitty.id ? 'primary' : ''"
              :elevation="selectedKittyId === kitty.id ? 8 : 2"
            >
              <v-card-text class="pa-3 text-center">
                <!-- Radio buton (görsel olarak üstte) -->
                <v-radio-group v-model="selectedKittyId" class="ma-0 pa-0" hide-details>
                  <v-radio :value="kitty.id" class="ma-0 pa-0"></v-radio>
                </v-radio-group>

                <!-- Kitty Avatar -->
                <v-avatar size="80" class="my-2">
                  <v-img
                    :src="kitty.image"
                    :alt="kitty.name"
                    @error="kitty.image = 'https://via.placeholder.com/80?text=🐱'"
                  ></v-img>
                </v-avatar>

                <!-- Kitty Bilgileri -->
                <div class="font-weight-bold text-subtitle-1">{{ kitty.name }}</div>

                <v-chip size="small" :color="kitty.color" class="my-1" text-color="white">
                  Gen: {{ kitty.generation }}
                </v-chip>

                <div class="text-caption mt-1">
                  <span class="font-weight-medium">ID:</span> #{{ kitty.id }}
                </div>

                <div class="text-caption text-truncate">
                  <span class="font-weight-medium">DNA:</span> {{ kitty.dnaShort }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Seçim yapılmadığında uyarı -->
        <v-alert v-if="!selectedKittyId" type="info" variant="tonal" class="mt-4">
          Please select a Kitty to feed your zombie
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <!-- Tamam butonu - sadece seçim varsa aktif -->
        <v-btn
          color="primary"
          @click="selectKitty()"
          :disabled="!selectedKittyId"
          size="large"
          min-width="200"
        >
          <v-icon left>mdi-check</v-icon>
          Confirm Selection
        </v-btn>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'pgTargetKitties',
  data() {
    return {
      selectedKittyId: null,

      // 🎯 HARDCODED KITTY LISTESI - 4 adet
      kittyList: [
        {
          id: 1,
          name: 'Genesis',
          generation: 0,
          dna: '0x0000000000000000000000000000000000000000000000000000000000000001',
          dnaShort: '0x0000...0001',
          color: 'orange',
          colorName: 'Orange',
          image: 'https://img.cryptokitties.co/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/1.png',
        },
        {
          id: 469927,
          name: 'Fluffy',
          generation: 5,
          dna: '0x0000000000000000000000000000000000000000000000000000000000072f2f',
          dnaShort: '0x0000...2f2f',
          color: 'white',
          colorName: 'White',
          image:
            'https://img.cryptokitties.co/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/469927.png',
        },
        {
          id: 697409,
          name: 'Dragon',
          generation: 42,
          dna: '0x00000000000000000000000000000000000000000000000000000000000aa3c1',
          dnaShort: '0x0000...a3c1',
          color: 'gold',
          colorName: 'Gold',
          image:
            'https://img.cryptokitties.co/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/697409.png',
        },
        {
          id: 729283,
          name: 'Vampire',
          generation: 63,
          dna: '0x00000000000000000000000000000000000000000000000000000000000b20c3',
          dnaShort: '0x0000...20c3',
          color: 'black',
          colorName: 'Black',
          image:
            'https://img.cryptokitties.co/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/729283.png',
        },
      ],
    };
  },
  methods: {
    // Kitty seçildi ve tamam butonuna basıldı
    selectKitty() {
      if (this.selectedKittyId) {
        // Seçilen Kitty ID'sini parent'a emit et
        this.$emit('kitty-selected', this.selectedKittyId);
        this.closePopup();
      }
    },

    // Popup'ı kapat
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>

<style scoped>
.kitty-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  border: 2px solid transparent;
}

.kitty-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.selected-card {
  border: 2px solid #1976d2 !important;
  background-color: rgba(25, 118, 210, 0.05);
}

/* Radio butonları daha belirgin yap */
:deep(.v-radio) {
  margin: 0 auto;
  display: inline-block;
}

:deep(.v-selection-control) {
  justify-content: center;
}
</style>
