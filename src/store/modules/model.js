

export default {
    state: {
        pageData: {}
    },
    mutations: {
        SET_DATA: (state, page) => {
            state.pageData = page;
        }
    },
    actions: {
        getPage({ commit, state }){

        }
    }
}