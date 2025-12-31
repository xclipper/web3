//import '@mdi/font/css/materialdesignicons.css' // Material Design Icons
import 'vuetify/styles' // Vuetify stillerini import et
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify kurulumunu yap
export default createVuetify({
  theme: {
    defaultTheme: 'light', // Tema ayarı
  },
  components, // Bileşenleri ekledik
  directives, // Direktifleri ekledik
})
