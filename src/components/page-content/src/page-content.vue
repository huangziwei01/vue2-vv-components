<template>
  <div class="page-content">
    <v-table
      ref="vTable"
      v-bind="contentConfig"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @selectionChange="selectionChange"
      @editableBlur="editableBlur"
    >
      <!-- 头部按钮插槽 -->
      <template #header-handler>
        <slot name="header-handler"></slot>
      </template>

      <!-- 侧边栏按钮插槽 -->
      <template #aside-handler="scope">
        <slot name="aside-handler" :row="scope.row"></slot>
      </template>

      <!-- 分页器 -->
      <template #footer>
        <div class="footer-box">
          <div class="total-num-box">
            共<span>{{ contentConfig.tableTotal }}</span
            >项数据
          </div>
          <foot-pagination
            :currentPage="currentPage"
            :layout="layout"
            :pageSize="pageSize"
            :total="contentConfig.tableTotal"
            :pageSizes="pageSizes"
            @handleSizeChangeBack="pageSizeChangeBack"
            @handleCurrentChangeBack="pageCurrentChangeBack"
          />
        </div>
      </template>

      <!-- SPC基础配置可编辑表格 -->
      <template #basicInput="scope">
        <slot name="basicInput" :row="scope.row"></slot>
      </template>
    </v-table>
  </div>
</template>

<script>
import vTable from "./v-table.vue";
import footPagination from "@/components/business/foot-pagination.vue";

import { mapState } from "vuex";

export default {
  name: "TrioFasWebPageContent",
  props: {
    contentConfig: Object,
    default: () => ({}),
  },
  components: {
    vTable,
    footPagination,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      layout: "sizes, prev, pager, next, jumper",
      pageSizes: [10, 20, 30],
    };
  },

  mounted() {},
  computed: {
    // ...mapState("queryInfo", ["queryInfo"]),
  },
  methods: {
    //分页器页码数量大小改变
    pageSizeChangeBack(pageSize) {
      this.$emit("pageSizeChange", pageSize);
    },
    //当前页码改变
    pageCurrentChangeBack(currentPage) {
      this.$emit("currentPageChange", currentPage);
    },
    //用户对数据进行多选
    selectionChange(rows) {
      this.$emit("selectionChange", rows);
    },
    //表格双击可编辑
    editableBlur(newVal, index, prop) {
      // console.log(newVal);
      this.$emit("editableBlur", newVal, index, prop);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  .footer-box {
    position: relative;
    padding: 16px 0;

    .total-num-box {
      position: absolute;
      left: 0;
      top: 21px;
      color: rgba(#000, 0.4);
      font-weight: 400;
      font-size: 14px;
    }

    span {
      padding: 0 4px;
    }
  }
}
</style>
