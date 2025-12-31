import { createRouter, createWebHistory } from 'vue-router';
import WalletWeb3 from '../views/TransferWebJS.vue';
import WalletSDK from '../views/TransferSDK.vue';
import CryptoTransfer from '../views/CryptoTransfer.vue';
import TransactionHistory from '../views/TransactionHistory.vue';
import Zombies from '../views/Zombies.vue';
import Home from '../views/Home.vue';
import MetaMaskComponent from '@/views/MetaMaskComponent.vue';
import web3Direct from '@/views/TransferDirect.vue';

const routes = [
  { path: '/wallet-web3', component: WalletWeb3, name: 'wallet-web3' },
  //{ path: '/wallet-sdk', component: WalletSDK, name: 'wallet-sdk' },
  { path: '/web3-direct', component: web3Direct, name: 'web3-direct' },
  { path: '/crypto-transfer', component: CryptoTransfer, name: 'crypto-transfer' },
  { path: '/transaction-history', component: TransactionHistory, name: 'transaction-history' },
  { path: '/zombies', component: Zombies, name: 'zombies' },
  { path: '/home', component: Home, name: 'home' },
  { path: '/matamask-comp', component: MetaMaskComponent, name: 'matamask-comp' },
  { path: '/', redirect: '/home' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
