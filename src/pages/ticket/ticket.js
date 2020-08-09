import Vue from 'vue'
import 'normalize.css'
import ElementUI from 'element-ui';
import mavonEditor from 'mavon-editor'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import 'mavon-editor/dist/css/index.css'
import '../../css/global.styl'
import App from './ticket.vue'
import Uimclip from '../../directives/clip'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(mavonEditor)

Vue.directive('uimclip', Uimclip)

new Vue({
  render: h => h(App),
}).$mount('#app')