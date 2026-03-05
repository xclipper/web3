<template>
  <v-container fluid class="text-center pa-0 ma-0">
    <div>
      <v-row>
        <v-col cols="12">
          <v-icon> <img src="../assets/metamask.png" height="50px" width="50px" /> </v-icon>
          <!-- <MetamaskFox /> -->
        </v-col>
      </v-row>
      <!-- Başlık Satırı -->
      <v-row no-gutters justify="center" class="mt-5">
        <v-col cols="12">
          <h1 class="text-h5 font-weight-bold">Zombies (web3JS)</h1>
        </v-col>
      </v-row>

      <!-- Alt Satır -->
      <v-row justify="center" no-gutters>
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
        <v-divider tickness="6"></v-divider>
      </v-row>
    </div>
    <v-row class="font-weight-bold">
      <v-col cols="2">Seç</v-col>
      <v-col cols="2">Name</v-col>
      <v-col cols="2">DNA</v-col>
      <v-col cols="2">Level</v-col>
      <!-- <v-col cols="2">WinCount</v-col>
      <v-col cols="2">LossCount</v-col> -->
      <v-col cols="2">ReadyTime</v-col>
      <v-divider thickness="6"></v-divider>
    </v-row>
    <v-row v-for="(item, index) in this.items" :key="index">
      <v-col cols="2">
        <input
          type="radio"
          :name="'itemGroup'"
          :value="item.id"
          v-model="selectedZombieItemID"
          @change="onItemSelected(item)"
          :disabled="!fnZombieIsReady(item)"
          :class="{
            'ready-zombie': fnZombieIsReady(item),
            'not-ready-zombie': !fnZombieIsReady(item),
          }"
        />
      </v-col>
      <v-col cols="2">{{ item.name }}</v-col>
      <v-col cols="2">{{ item.dna }}</v-col>
      <v-col cols="2">{{ item.level }}</v-col>
      <!--<v-col cols="2">{{ item.winCount }}</v-col>
        <v-col cols="2">{{ item.lossCount }}</v-col>
      <v-col cols="2">{{ item.readyTime }}</v-col> -->
      <v-col cols="2">{{ this.FormatDate(item.readyTime) }}</v-col>
    </v-row>

    <v-row v-if="items.length === 0">
      <v-col cols="12" class="text-center">No data available</v-col>
    </v-row>

    <!-- Toplam kayıt sayısı -->
    <v-row>
      <v-col cols="12" class="text-right font-weight-bold">
        Toplam Kayıt Sayısı: {{ items.length }}
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="getZombiesByOwner()" class="custom-space"
          >List Zombies</v-btn
        >
        <v-btn color="primary" @click="add" class="custom-space">Create a Zombie</v-btn>
        <v-btn color="primary" @click="attack" class="custom-space">Attack Zombie</v-btn>
        <v-btn color="primary" @click="feed" class="custom-space">Feed the zombie </v-btn>
        <v-btn color="primary" @click="destroy" class="custom-space">Destroy the zombie</v-btn>
      </v-col>
    </v-row>

    <!-- ErrorDialog Bileşeni Kullanımı -->
    <MsgDialog v-model:dialogVisible="dialogVisible" :message="this.strMessage" />

    <v-dialog v-model="IsCreateZombie" persistent width="auto" max-width="800px" min-width="400px">
      <pgCreateZombie @closePopup="doCloseZombieCreate" @createzombie="DOcreateZombie()" />
      <!-- "createzombie" event i pgCreateZombie component içinden "$emit() raise edilir -->
    </v-dialog>

    <v-dialog v-model="IsAttackZombie" persistent width="auto" max-width="800px" min-width="400px">
      <pgAttackZombie
        @closePopup="doCloseAttackZombie()"
        @attackzombie="doAttack($event)"
        :enemyZombieArmy="getEnemyZombiesArmy()"
        :loading="loading"
      />
    </v-dialog>
    <v-dialog v-model="IsFeedZombie" persistent width="auto" max-width="800px" min-width="400px">
      <pgFeedZombie
        @closePopup="doCloseFeedZombie()"
        @kitty-selected="doFeedKitty($event)"
        :loading="loading"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import Web3 from 'web3';
import { ref } from 'vue';
import MsgDialog from '../components/popupmessage.vue';
import * as utils from '../utils';
import { useWalletStore } from '@/stores/wallet';
import { cryptoZombiesABI } from '@/contracts/index';
import { KittyConractABI } from '@/contracts/index';
import pgCreateZombie from '@/components/CreateZombie.vue';
import pgAttackZombie from '@/components/AttackZombie.vue';
import pgFeedZombie from '@/components/kittyList.vue';

export default {
  components: {
    //Bu bölüme modül içinde kullanılan componentler yazılır. Bu komponentler import edilmiş olmalı
    MsgDialog,
    pgCreateZombie,
    pgAttackZombie,
    pgFeedZombie,
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
      bntLabel: ref('connect wallet'),
      mybalance: null,
      mywalletAddress: null,
      mynetworkID: null,
      mypureBalance: 0,
      name: '',
      dna: '',
      level: '',
      //winCount: '',
      //lossCount: '',
      readyTime: '',
      selectedZombieItemID: null, // seçilen radio butonun değeri
      // Örnek veri
      items: [
        // Boş bir tablo için bu array boş bırakılabilir
        // Örnek veri eklemek için:
        {
          id: 0,
          name: '',
          dna: '',
          level: 0,
          winCount: 0,
          lossCount: 0,
          readyTime: 0,
        },
      ],
      web3Contract: null,
      IsCreateZombie: false,
      IsAttackZombie: false,
      IsFeedZombie: false,
    };
  },
  created() {
    //this.submitToStore(null, null, null);
  },
  mounted() {
    //if (!window.ethereum) this.isBtnDisabled = true;
  },
  unmounted() {
    //window.ethereum?.removeListener('accountsChanged', this.handleAccountsChanged);
    //window.ethereum?.removeListener('chainChanged', this.handleChainChanged);
    this.Web3 = null;
    this.web3Contract = null;
  },

  methods: {
    FormatDate(ts) {
      return utils.formatDate(ts);
    },
    onItemSelected(selItem) {
      //alert('Item selected : ' + selItem + ' - selectedItemID : ' + this.selectedZombieItemID);
    },
    fnZombieIsSelected() {
      if (this.selectedZombieItemID !== undefined && this.selectedZombieItemID !== null) {
        return true;
      }
      return false;
    },
    getMyZombiesArmy() {
      //Zombie army. Prepare id,name as a key-value couple
      const myItems = [];
      this.items.forEach((item, index) => {
        myItems.push({
          id: item.id,
          name: item.name,
        });
      });
      return myItems;
    },
    getEnemyZombiesArmy() {
      const myItems = [];
      this.items.forEach((item, index) => {
        if (item.id !== this.selectedZombieItemID) {
          // Selected Zombie enemy listesine eklenmez çünkü contract aynı zombiye saldırıyı engeller
          myItems.push({
            id: item.id,
            name: item.name,
          });
        }
      });
      return myItems;
    },
    async connectWallet() {
      if (this.isBtnDisabled) return;
      //this.isBtnDisabled = true;
      this.bntLabel = 'working...';
      if (window.ethereum && window.ethereum.isMetaMask) {
        this.web3 = new Web3(window.ethereum);

        this.web3Contract = new this.web3.eth.Contract(
          cryptoZombiesABI,
          import.meta.env.VITE_ZOMBIE_CONTRACT_ADDRESS,
        );

        /*
        this.web3Contract = new this.web3.eth.Contract(
          KittyConractABI,
          import.meta.env.VITE_KITTY_CONTRACT_ADDRESS,
        );
        return;
        */

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
      this.bntLabel = 'connect wallet';
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
    emptyZombieArray() {},
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
    async doCloseZombieCreate() {
      this.IsCreateZombie = false;
    },
    async doCloseAttackZombie() {
      this.IsAttackZombie = false;
    },
    async doCloseFeedZombie() {
      this.IsFeedZombie = false;
    },

    async getZombiesByOwner(pSlient = false) {
      const myItems = {
        id: 0,
        name: '',
        dna: '',
        level: 0,
        winCount: 0,
        lossCount: 0,
        readyTime: 0,
      };

      if (this.AppState.WalletAdres) {
        try {
          /*
           getZombiesByOwner() geri uint olarak owner a ait zombilerin index (ID) verisini
           döndürür.
          */
          this.web3Contract.methods
            .getZombiesByOwner(this.AppState.WalletAdres)
            .call()
            .then((data) => {
              let zombie = null;
              //this.items.length = 0;
              if (!pSlient) this.items = [];
              data.forEach(async (value) => {
                zombie = await this.web3Contract.methods.zombies(value).call();
                const myItems = {
                  id: Number(value),
                  name: zombie.name,
                  dna: zombie.dna,
                  level: zombie.level,
                  winCount: zombie.winCount,
                  lossCount: zombie.lossCount,
                  readyTime: zombie.readyTime,
                };
                this.items.push(myItems);
                //this.items = [...this.items, zombie];
                //this.items = [...this.items, myItems];
              });
              //this.items.splice(0, 1);
            });
        } catch (error) {
          if (error.code !== 4001) {
            this.strMessage = 'Error occured 3 : ' + utils.stringify(error.message);
            this.dialogVisible = true;
          }
        }
      }
    },
    async DOcreateZombie() {
      if (this.AppState.WalletAdres && this.AppState.zombieName !== '') {
        try {
          this.items = await this.web3Contract.methods
            .createRandomZombie(this.AppState.zombieName)
            .send({ from: this.AppState.WalletAdres })
            .on('receipt', function (receipt) {
              //this.getZombiesByOwner(true);
            });
          this.AppState.zombieName = '';
          this.IsCreateZombie = false;
          //(true);
        } catch (error) {
          this.AppState.zombieName = '';
          this.IsCreateZombie = false;
          if (error.code !== 4001) {
            this.strMessage = 'Error occured : ' + utils.stringify(error.message);
            this.dialogVisible = true;
          }
        }
      }
    },
    async add() {
      // Ekleme işlemleri
      if (this.AppState.WalletAdres) {
        this.AppState.zombieName = '';
        this.IsCreateZombie = true;
      }
    },
    async attack() {
      if (this.AppState.WalletAdres && this.fnZombieIsSelected()) {
        // Saldırı işlemleri part : 1
        this.IsAttackZombie = true;
      }
    },
    async doAttack(eventData) {
      //Saldırı işlemleri part : 2
      try {
        //attack() metodunun tahmini ne kadar gas harcayacağını öğrenelim.
        const gasEstimate = await this.web3Contract.methods
          .attack(this.selectedZombieItemID, eventData.toBeAttackedID)
          .estimateGas({ from: this.AppState.WalletAdres });

        const maxAllowedGas = 16000000; // cap'in biraz altında

        await this.web3Contract.methods
          .attack(this.selectedZombieItemID, eventData.toBeAttackedID)
          .send({
            from: this.AppState.WalletAdres,
            gas: Math.min(Number(gasEstimate), maxAllowedGas),
          })
          .on('receipt', function (receipt) {
            //this.getZombiesByOwner(true);
          });
        this.IsAttackZombie = false;
        //this.getZombiesByOwner(true);
      } catch (error) {
        this.IsAttackZombie = false;
        if (error.code !== 4001) {
          this.strMessage = 'Error occured : ' + utils.stringify(error.message);
          this.dialogVisible = true;
        }
      }
    },

    async doFeedKitty(kittyId) {
      try {
        //attack() metodunun tahmini ne kadar gas harcayacağını öğrenelim.
        const gasEstimate = await this.web3Contract.methods
          .feedOnKitty(this.selectedZombieItemID, kittyId)
          .estimateGas({ from: this.AppState.WalletAdres });

        const maxAllowedGas = 16000000; // cap'in biraz altında

        await this.web3Contract.methods
          .feedOnKitty(this.selectedZombieItemID, kittyId)
          .send({
            from: this.AppState.WalletAdres,
            gas: Math.min(Number(gasEstimate), maxAllowedGas),
          })
          .on('receipt', function (receipt) {
            //this.getZombiesByOwner(true);
          });
        this.IsAttackZombie = false;
        //this.getZombiesByOwner(true);
      } catch (error) {
        this.IsAttackZombie = false;
        if (error.code !== 4001) {
          this.strMessage = 'Error occured : ' + utils.stringify(error.message);
          this.dialogVisible = true;
        }
      }
    },
    feed() {
      // Feeding zombies OPS
      if (this.AppState.WalletAdres && this.fnZombieIsSelected()) {
        // Feeding ops part : 1
        this.IsFeedZombie = true;
      }
    },
    async destroy() {
      // Yıkım işlemleri
      //const mycodes = await this.web3.eth.getCode(import.meta.env.VITE_KITTY_CONTRACT_ADDRESS);

      await this.web3Contract.methods.setKittyContractAddress(
        import.meta.env.VITE_KITTY_CONTRACT_ADDRESS,
      );
      return;
      //alert('Codes : ' + mycodes);

      const result = await this.web3Contract.methods.getKitty(729283).call();
      alert('result : ' + JSON.stringify(result));
    },
    fnZombieIsReady(myItem) {
      const now = Math.floor(Date.now() / 1000);
      return myItem.readyTime < now; // true if readyTime is expired
    },
  },
};
</script>

<style scoped>
/* İsteğe bağlı stil düzenlemeleri */
.v-row {
  /*border-bottom: 1px solid #ddd; /* Satırlar arası çizgi */
}
.v-col {
  padding: 12px; /* Hücre içi boşluk */
}
.custom-space {
  margin-right: 24px;
}
.no-gutter {
  margin: 0;
  padding: 0;
  padding-top: 0;
}

.ready-zombie {
  /* Hazır zombiler için stil */
  accent-color: green;
}

.not-ready-zombie {
  /* Hazır olmayanlar için stil */
  opacity: 0.5;
}
</style>
