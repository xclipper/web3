// Utilities
import { defineStore } from 'pinia';
import * as utils from '@/utils';
import { ref, reactive } from 'vue';

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    WalletAdres: '',
    chainId: '',
    amount: 0,
    zombieName: '',
  }),
  getters: {
    getAmountWithCurrency() {
      return (this.amount ?? 0) + ' ETH';
    },
    getFormatedChain() {
      return this.chainId > 0 ? utils.getNetworkName(this.chainId) : null;
    },
    getZombieName() {
      return this.zombieName;
    },
  },
  actions: {
    //setZombieName(pName) {
    //  if (pName !== '') this.zombieName = pName;
    //},
  },
});
