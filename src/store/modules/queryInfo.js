export const queryInfo = {
  namespaced: true,
  state: {
    queryInfo: {},
    pageParams: {
      pageSize: 10,
      currentPage: 1,
    },
  },
  mutations: {
    UPDATE_QUERY_INFO(state, payload) {
      delete payload.date;
      state.queryInfo = { ...state.queryInfo, ...payload };
    },
    UPDATE_PAGE_PARAMS(state, payload) {
      state.pageParams = { ...state.pageParams, ...payload };
    },
  },
  actions: {
    queryInfoChange({ commit }, val) {
      let beginTime = "";
      let endTime = "";
      let singleDate = "";
      const hasBeginAndEndDate = Object.keys(val).some(
        (item) => item === "beginAndEndDate"
      );
      const hasSingleDate = Object.keys(val).some(
        (item) => item === "singleDate"
      );
      if (hasBeginAndEndDate) {
        // let [beginTime, endTime] = val;
        beginTime = val.beginAndEndDate[0];
        endTime = val.beginAndEndDate[1];
        commit("UPDATE_QUERY_INFO", { ...val, beginTime, endTime });
      } else if (hasSingleDate) {
        singleDate = val.singleDate;
        commit("UPDATE_QUERY_INFO", { ...val, singleDate });
      } else {
        commit("UPDATE_QUERY_INFO", val);
      }
      // console.log(val);
    },
    pageParamsChange({ commit }, val) {
      commit("UPDATE_PAGE_PARAMS", val);
    },
  },
};
