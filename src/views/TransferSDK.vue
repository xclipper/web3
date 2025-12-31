<template>
  <v-container fluid class="text-center pa-0 ma-0">
    <v-row>
      <v-col cols="12">
        <v-icon> <img src="../assets/metamask.png" height="50px" width="50px" /> </v-icon>
        <!-- <MetamaskFox /> -->
      </v-col>
    </v-row>
    <!-- Başlık Satırı -->
    <v-row no-gutters justify="center" class="mt-5">
      <v-col cols="12">
        <h1 class="text-h5 font-weight-bold">MetaMask (SDK)</h1>
      </v-col>
    </v-row>

    <!-- Alt Satır -->
    <v-row justify="center">
      <v-col cols="12">
        <v-text-field
          label="Wallet Address"
          v-model="this.AppState.WalletAdres"
          readonly
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Üst Satır -->
    <v-row class="align-center vrowbox" justify="center">
      <v-col cols="4" class="vcolbox">
        <v-text-field
          label="Balance"
          v-model="this.AppState.getAmountWithCurrency"
          readonly
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="vcolbox">
        <v-text-field
          label="Network"
          v-model="this.AppState.getFormatedChain"
          readonly
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="vcolbox">
        <v-btn color="primary" block large @click="connectWallet" :disabled="isBtnDisabled">{{
          bntLabel
        }}</v-btn>
      </v-col>
    </v-row>

    <!-- ErrorDialog Bileşeni Kullanımı -->
    <!-- <MsgDialog v-model:dialogVisible="dialogVisible" :message="this.strMessage" /> -->
  </v-container>
</template>
<script>
import { MetaMaskSDK } from '@metamask/sdk';
//import { Buffer } from 'buffer';
import { ref } from 'vue';
import * as utils from '../utils';
import { useWalletStore } from '@/stores/wallet';
import MsgDialog from '@/components/popupmessage.vue';

export default {
  components: {
    MsgDialog,
  },
  data() {
    return {
      AppState: useWalletStore(),
      strMessage: ref(''),
      isdialogVisible: ref(false), // varsayılan olarak kapalı
      currency: '',
      isBtnDisabled: false,
      bntLabel: ref('get data'),
      mybalance: null,
      mywalletAddress: null,
      ETHProvider: null,
      MMSDK: null,
      mypureBalance: 0,
      ETHProvider: null,
      connected: false,
      blnEthereumInstalled: false,
    };
  },
  created() {
    if (window.ethereum) this.blnEthereumInstalled = true;
    this.submitToStore(null, null, null); // Empty wallet store data
    this.currency = 'ETH';
    this.MMSDK = new MetaMaskSDK({
      dappMetadata: {
        url: window.location.href,
        name: 'MetaMask VueJS Example Dapp',
      },
      enableAnalytics: true,
      checkInstallationImmediately: true,
      headless: true,
      logging: {
        developerMode: true,
        sdk: true,
      },
      i18nOptions: {
        enabled: true,
        preferedMobile: true,
        preferedDesktop: false,
      },
    });
  },
  unmounted() {
    this.MMSDK = null;
    window.ETHProvider?.removeListener('accountsChanged', this.handleAccountsChanged);
    window.ETHProvider?.removeListener('chainChanged', this.handleChainChanged);
    //if (!this.blnEthereumInstalled)
    // window global çerçevesinde ethereum provider yoksa. Yani bu sayfadan dolayı yüklenmişse, çıkışta destroy et.
    //window.ethereum = null;
  },
  computed: {},
  mounted() {},
  methods: {
    async connectWallet() {
      if (this.isBtnDisabled) return;
      this.isBtnDisabled = true;
      this.bntLabel = 'working...';
      try {
        //Lets read data from Metamask
        await this.readFromMetamask(this.ETHProvider);
        // add listeners
        this.listenForWalletEvents(this.ETHProvider);
      } catch (error) {
        alert('Error occured : ' + utils.stringify(error.message));
      }
      this.isBtnDisabled = false;
      this.bntLabel = 'get data';
    },
    async readFromMetamask() {
      try {
        const accounts = await this.MMSDK?.connect();
        //await this.MMSDK?.connect();
        this.ETHProvider = this.MMSDK?.getProvider();
        this.mynetworkID = this.ETHProvider.getChainId();
        this.mywalletAddress = this.ETHProvider.getSelectedAddress();
        this.connected = true;
        //this.mynetworkID = await myProvider.request({ method: 'eth_chainId' });
        this.mywalletAddress = accounts[0];
        this.mybalance = await this.ETHProvider.request({
          method: 'eth_getBalance',
          params: [this.mywalletAddress],
        });
        this.mypureBalance = Number(BigInt(this.mybalance).toString(10)) / 1e18;
        this.submitToStore(this.mywalletAddress, Number(this.mynetworkID), this.mypureBalance);
      } catch (error) {
        if (error.code !== 4001)
          // USer rejected request error
          alert('İşlem Baiarısız 2 !! Hata : ' + utils.stringify(error.message));
      }
    },
    handleAccountsChanged(accounts) {
      //this.AppState.setWalletAddres(accounts[0])
      this.readFromMetamask();
    },
    handleChainChanged(chain) {
      //this.AppState.setWalletChain(Number(chain))
      this.readFromMetamask();
    },
    submitToStore(myadress, mychain, myamount) {
      this.AppState.$patch({
        WalletAdres: myadress,
        chainId: mychain,
        amount: myamount,
      });
    },
    listenForWalletEvents() {
      if (this.connected) {
        //listener for accounts changes
        this.ETHProvider.on('accountsChanged', this.handleAccountsChanged);
        //listener for chain changes
        this.ETHProvider.on('chainChanged', this.handleChainChanged);
      }
    },
  },
};
</script>

<style scoped>
#fox-logo {
  height: 50px;
  width: 50px;
}
</style>
