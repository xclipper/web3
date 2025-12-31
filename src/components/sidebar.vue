<template>
  <v-navigation-drawer>
    <!-- 🏠 Sol Üst Köşeye Home İkonu -->
    <v-list-item @click="goToPage('home')" class="home-icon-iptaL">
      <v-icon></v-icon>
      <v-list-item-title><b>Do a Transfer</b></v-list-item-title>
    </v-list-item>
    <v-list>
      <v-list-item @click="goToPage('wallet-web3')">Using Metamask & Web3JS Lib.</v-list-item>
      <!-- <v-list-item @click="goToPage('wallet-sdk')">Using Metamask SDK</v-list-item>-->
      <v-list-item @click="goToPage('web3-direct')">Direct Using Infura</v-list-item>
      <!-- <v-list-item @click="goToPage('crypto-transfer')">Kripto Transfer Et</v-list-item>
      <v-list-item @click="goToPage('transaction-history')">Transfer İşlemi Sorgula</v-list-item>
      <v-list-item @click="goToPage('matamask-comp')">Metamask Component</v-list-item>
    -->
      <v-list-item @click="goToPage('zombies')">Zombies</v-list-item>
      <v-list-item @click="logout">Çıkış Yap</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true, // Menü açılış durumunu kontrol eder
      isMobile: false, // Ekran boyutunu kontrol etmek için
    };
  },
  created() {
    // Ekran boyutunu kontrol et ve mobil ise menüyü geçici yap
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  unmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 600; // 600px altındaki ekranlar için mobil kabul edilir
    },
    goToPage(page) {
      this.$router.push({ name: page }); // Sayfaya yönlendirme
    },
    logout() {
      // Çıkış işlemleri
    },
  },
};
</script>

<style scoped>
/* Home ikonunu üste hizala ve stil ver */
.home-icon {
  display: flex;
  align-items: center;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
}

.home-icon v-icon {
  margin-right: 8px;
}
</style>
