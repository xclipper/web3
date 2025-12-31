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
        <h1 class="text-h5 font-weight-bold">MetaMask (web3JS)</h1>
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
        <p v-if="this.isBtnDisabled"><b>You do NOT have Metamask installed on your browser</b></p>
        <v-btn color="primary" block large @click="connectWallet" :disabled="isBtnDisabled">{{
          bntLabel
        }}</v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-center">Transfer</v-card-title>
      <v-card-text>
        <v-text-field label="Recipient Address" v-model="recipient"></v-text-field>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Amout to send" v-model="amount_sent" type="number"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-radio-group v-model="unit" row>
              <v-radio label="Wei" value="wei"></v-radio>
              <v-radio label="ETH" value="eth"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn color="primary" block large @click="sendCrypto()" :disabled="isBtnTransDisabled"
        >Submit</v-btn
      >
    </v-card>

    <!-- ErrorDialog Bileşeni Kullanımı -->
    <MsgDialog v-model:dialogVisible="dialogVisible" :message="this.strMessage" />
  </v-container>
</template>
<script>
import Web3 from 'web3';
import { ref } from 'vue';
import MsgDialog from '../components/popupmessage.vue';
import * as utils from '../utils';
import { useWalletStore } from '@/stores/wallet';

export default {
  components: {
    MsgDialog,
  },
  data() {
    return {
      AppState: useWalletStore(),
      strMessage: ref(''),
      dialogVisible: ref(false), // as initial disabled
      unit: 'wei',
      web3: null,
      network: null,
      isBtnDisabled: false,
      isBtnTransDisabled: false,
      bntLabel: ref('get data'),
      mybalance: null,
      mywalletAddress: null,
      mynetworkID: null,
      mypureBalance: 0,
      blnConnected: false,
      amount_sent: 0,
      recipient: '',
    };
  },
  created() {
    this.submitToStore(null, null, null);
  },
  mounted() {
    //if (!window.ethereum) this.isBtnDisabled = true;
  },
  unmounted() {
    //window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    //window.ethereum?.removeListener('chainChanged', handleChainChanged);
    window.ethereum?.removeListener('accountsChanged', this.handleAccountsChanged);
    window.ethereum?.removeListener('chainChanged', this.handleChainChanged);
    this.Web3 = null;
  },
  watch: {
    blnConnected(newValue, oldValue) {
      if (newValue && this.mypureBalance > 0) this.isBtnTransDisabled = false;
    },
  },
  methods: {
    async connectWallet() {
      if (this.isBtnDisabled) return;
      this.isBtnDisabled = true;
      this.bntLabel = 'working...';
      if (window.ethereum && window.ethereum.isMetaMask) {
        this.web3 = new Web3(window.ethereum);
        try {
          //Lets read data from Metamask
          this.readFromMetamask();
          // add listeners
          this.listenForWalletEvents();
        } catch (error) {
          if (error.code !== 4001) {
            //alert('Error occured : ' + utils.stringify(error.message));
            this.strMessage = 'Error occured : ' + utils.stringify(error.message);
            this.dialogVisible = true;
          }
        }
      } else {
        this.strMessage = 'MetaMask is NOT istalled in current your current browser.';
        this.dialogVisible = true;
        //alert('MetaMask is NOT istalled in current your current browser.');
      }
      this.isBtnDisabled = false;
      this.bntLabel = 'get data';
    },
    async sendCrypto() {
      try {
        let ValueToSend = this.amount_sent;
        if (this.unit === 'eth') ValueToSend = Number(ValueToSend * 1e18).toString(16);
        await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              to: this.recipient,
              from: this.AppState.WalletAdres,
              gas: '0x76c0',
              value: ValueToSend,
              data: '0x',
              gasPrice: '0x4a817c800',
            },
          ],
        });
      } catch (error) {
        this.strMessage =
          'Error occured while processing transfer : ' + utils.stringify(error.message);
        this.dialogVisible = true;
      }
    },
    async readFromMetamask() {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        let accounts = await this.web3.eth.getAccounts();
        this.mynetworkID = await this.web3.eth.getChainId();
        this.mywalletAddress = accounts[0];
        this.mybalance = await this.web3.eth.getBalance(this.mywalletAddress);
        this.mybalance = await this.web3.utils.fromWei(this.mybalance, 'ether');
        this.mypureBalance = this.mybalance;
        this.blnConnected = true;
        this.submitToStore(this.mywalletAddress, this.mynetworkID, this.mypureBalance);
      } catch (error) {
        if (error.code !== 4001) {
          this.strMessage = 'Error occured : ' + utils.stringify(error.message);
          this.dialogVisible = true;
        }
      }
    },
    handleAccountsChanged(accounts) {
      this.readFromMetamask();
    },
    handleChainChanged(chain) {
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
      if (window.ethereum) {
        //listener for accounts changes
        window.ethereum.on('accountsChanged', this.handleAccountsChanged);
        //listener for chain changes
        window.ethereum.on('chainChanged', this.handleChainChanged);
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
