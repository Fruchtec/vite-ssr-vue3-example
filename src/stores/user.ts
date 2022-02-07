const state = () => ({
  coins: 0
})

const mutations = {
  INCREMENT(state: any) {
    state.coins++
  }
}

const actions = {
  increment({ commit }: any) {
    commit('INCREMENT')
  }
}
//
// const getters = {
//     user: state => state.user
// }
//
// const mutations = {
//     SET_LOGIN_STATE(state, value) {
//         state.user.loggedIn = value
//     },
//     SET_USER(state, data) {
//         state.user.data = data
//     }
// }
//
// const actions = {
//     fetchUser({ commit }, { user, additionalUserData }) {
//         commit('SET_LOGIN_STATE', user !== null)
//         if (user) {
//             commit('SET_USER', {
//                 displayName: user.displayName,
//                 email: user.email,
//                 ...additionalUserData
//             })
//         } else {
//             commit('SET_USER', null)
//         }
//     },
//     logOut({ commit }) {
//         commit('SET_LOGIN_STATE', false)
//     }
// }

export default {
  state,
  // getters,
  mutations,
  actions
}
