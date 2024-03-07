import { login, logout, getInfo, updateInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: null,
    email: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, userId) => {
    state.id = userId
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, validCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, validCode: validCode }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { username, avatar, id, email } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_ID', id)
        commit('SET_EMAIL', email)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  updateUser({ commit }, userInfo) {
    return new Promise(resolve => {
      updateInfo(userInfo)
        .then(res => {
          commit('SET_NAME', userInfo.username);
          resolve()
        });
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

