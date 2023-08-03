<template>
  <div class="page-search">
    <v-form v-bind="searchConfig" v-model="formData" ref="tabFilter">
      <template #handler>
        <div class="search-btn" @click="queryBtnClick">查询</div>
        <div class="reset-btn" @click="resetBtnClick">重置</div>
      </template>
      <template #form-slot>
        <slot name="form-slot"></slot>
      </template>
    </v-form>
  </div>
</template>

<script>
import vForm from "./v-form.vue";
export default {
  name: "TrioFasWebPageSearch",
  components: { vForm },
  props: {
    searchConfig: Object,
    default: () => ({}),
  },
  data() {
    return {
      originFormData: {},
      //表单信息
      formData: {},
    };
  },
  created() {
    //根据配置文件自动生成表单字段
    const formItems = this.searchConfig.formItems.flat(Infinity);
    for (const formItem of formItems) {
      this.originFormData[`${formItem.field}`] = "";
    }
    this.formData = { ...this.originFormData };
  },
  mounted() {},
  methods: {
    queryBtnClick() {
      this.$emit("searchBtnClick");
    },
    resetBtnClick() {
      //将点击重置前的表单数据发送出去
      this.$emit("resetBtnClick", this.formData);
      //重置当前组件的表单
      this.formData = this.originFormData;
      this.$refs.tabFilter.dateRadio = "";
    },
  },
  watch: {
    //监听表单信息变化然后存入vuex
    formData: {
      handler: function (newVal, oldVal) {
        this.$store.dispatch("queryInfo/queryInfoChange", newVal);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.page-search {
  .search-btn,
  .reset-btn {
    width: 60px;
    height: 29px;
    text-align: center;
    line-height: 29px;
    // padding: 5px 16px;
    // height: 100%;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
