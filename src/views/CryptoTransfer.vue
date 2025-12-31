<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h5">Crypto Transfer Screen</v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-row>
            <!-- Sol Kısım -->
            <v-col cols="12" md="6" class="pr-md-4">
              <v-text-field
                label="Balance"
                v-model="balance"
                readonly
                outlined
                dense
              ></v-text-field>
              <v-text-field
                label="Chain ID"
                v-model="chainID"
                readonly
                outlined
                dense
              ></v-text-field>
              <v-text-field
                label="Wallet Address"
                v-model="walletAddress"
                readonly
                outlined
                dense
              ></v-text-field>
              <v-btn color="primary" block class="mb-2" @click="connectMetamask"
                >Metamask ile Bağlan</v-btn
              >
              <v-btn color="secondary" block>QR Kod ile Bağlan</v-btn>
            </v-col>

            <!-- Sağ Kısım -->
            <v-col cols="12" md="6" class="pl-md-4">
              <v-card class="pa-4">
                <v-card-title class="text-center text-subtitle-1"
                  >Crypto Transfer Data</v-card-title
                >
                <v-divider class="mb-4"></v-divider>
                <v-text-field
                  label="Receipt Address"
                  v-model="receiptAddress"
                  outlined
                  dense
                ></v-text-field>
                <v-text-field label="Amount to send" v-model="amount" outlined dense></v-text-field>
                <v-radio-group v-model="unit" row>
                  <v-radio label="Wei" value="wei"></v-radio>
                  <v-radio label="ETH" value="eth"></v-radio>
                </v-radio-group>
                <v-btn color="success" block @click="sendCrypto">Send Crypto</v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'
import MsgPopup from '../components/popupmessage.vue'

const balance = ref(null)
const chainID = ref(null)
const walletAddress = ref(null)
const receiptAddress = ref('')
const amount = ref('')
const unit = ref('wei')
const web3 = ref(null)

const connectMetamask = async () => {
  if (window.ethereum) {
    web3.value = new Web3(window.ethereum)
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await web3.value.eth.getAccounts()
      walletAddress.value = accounts[0]
      chainID.value = await web3.value.eth.getChainId()
      balance.value = await web3.value.eth.getBalance(walletAddress.value)
    } catch (error) {
      console.error('Metamask bağlantısı başarısız:', error)
    }
  } else {
    alert('Metamask yüklü değil!')
  }
}

const sendCrypto = async () => {
  if (!web3.value || !walletAddress.value || !receiptAddress.value || !amount.value) {
    alert('Lütfen tüm alanları doldurun!')
    return
  }

  try {
    const valueToSend =
      unit.value === 'eth' ? web3.value.utils.toWei(amount.value, 'ether') : amount.value

    await web3.value.eth.sendTransaction({
      from: walletAddress.value,
      to: receiptAddress.value,
      value: valueToSend,
    })
    alert('Transfer başarılı!')
  } catch (error) {
    console.error('Transfer başarısız:', error)
  }
}
</script>
