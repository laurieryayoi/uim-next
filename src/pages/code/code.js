import Vue from 'vue'
import 'normalize.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import '../../css/global.styl'
import VeScatter from 'v-charts/lib/scatter.common'
import RingChart from 'v-charts/lib/ring.common'
import App from './code.vue'
import Uimclip from '../../directives/clip'

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.component(VeScatter.name, VeScatter)
Vue.component(RingChart.name, RingChart)

Vue.directive('uimclip', Uimclip)

new Vue({
  render: h => h(App),
}).$mount('#app')