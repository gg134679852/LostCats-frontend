import { createStore } from 'vuex'
import { axiosHelper } from '../utils/helpers'
export default createStore({
  state: {
    currentUser: {
      id: -1,
      name: '',
      email: '',
      isAdmin: false
    },
    favoriteCats: [],
    isAuthenticated: false
  },
  getters: {
  },
  mutations: {
    setUser (state, payLoad) {
      state.currentUser = {
        ...state.currentUser,
        ...payLoad.user
      }
      state.favoriteCats = payLoad.favoriteCats
      state.isAuthenticated = true
    },
    revokeAuthentication (state) {
      state.currentUser = {
        id: -1,
        name: '',
        email: '',
        isAdmin: false
      }
      state.favoriteCats = []
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    fetchCurrentUser (state) {
      axiosHelper('user/CurrentUser')
        .then((obj) => {
          const { user, favoriteCats, isAuthenticated } = obj.data
          state.currentUser = {
            ...state.currentUser,
            ...user
          }
          state.favoriteCats = favoriteCats
          state.isAuthenticated = isAuthenticated
        })
    }
  },
  actions: {
    setUser ({ commit }, value) {
      const { token } = value
      const { favoriteCats } = value.userData
      const { email, name, id, isAdmin } = value.userData.user
      commit('setUser', { favoriteCats, user: { email, name, id, isAdmin } })
      localStorage.setItem('token', JSON.stringify(token))
    },
    revokeAuthentication ({ commit }) {
      commit('revokeAuthentication')
    },
    fetchCurrentUser ({ commit }) {
      commit('fetchCurrentUser')
    }
  },
  modules: {
  }
})
