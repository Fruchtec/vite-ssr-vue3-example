const state = () => ({
  count: 0
})

const getters = {

}

const mutations = {
  INCREMENT(state: any) {
    state.count += 1
  }
}

const actions = {
  increment({ commit }: any) {
    commit('INCREMENT')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
