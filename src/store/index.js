import Vue from 'vue'
import Vuex from 'vuex'
import { queryInfo } from './modules/queryInfo'
import { selectData } from './modules/selectData'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    queryInfo,
    selectData,
  },
})

export default store
