<template>
  <div class="table-container">
    <slot name="header-handler" class="btn-list"></slot>

    <el-table
      v-loading="isTableLoading"
      :data="gridData"
      style="margin-bottom: 20px"
      max-height="520"
      :border="border"
      header-cell-class-name="live-header-cell"
      @selection-change="selectionChange"
    >
      <!-- 勾选框 -->
      <el-table-column
        type="selection"
        width="55"
        v-if="showSelectColumn"
        align="center"
      >
      </el-table-column>
      <!-- 序号排列 -->
      <el-table-column
        v-if="showIndexColumn"
        type="index"
        label="序号"
        align="center"
        width="50"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 表格列 -->
      <el-table-column
        v-for="(item, index) in propList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'left'"
        :show-overflow-tooltip="item.overHidden || true"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.slotName">
            <slot :name="item.slotName" :row="scope.row"></slot>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <!-- </template> -->
      <template v-if="needAsideHandler">
        <el-table-column width="180px" label="操作" align="center">
          <template slot-scope="scope">
            <slot name="aside-handler" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="footerPage">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrioMesTaiWebVTable",
  //从最外层组件接受loading值
  inject: ["tableLoading"],
  props: {
    //表头
    propList: {
      type: Array,
      default: () => ({}),
      // required: true,
    },
    //表格数据
    gridData: {
      type: Array,
      default: () => ({}),
    },
    //是否显示选中列
    showSelectColumn: {
      type: Boolean,
      default: false,
    },
    //是否显示序号列
    showIndexColumn: {
      type: Boolean,
      default: false,
    },
    //当前页码
    currentPage: {
      type: Number,
      default: 1,
    },
    //当前页数量
    pageSize: {
      type: Number,
      default: 10,
    },
    //表格是否有边框
    border: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Boolean,
      default: false,
    },
    //是否需要侧边操作栏
    needAsideHandler: {
      type: Boolean,
      default: false,
    },
    //是否显示分页器
    footerPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEditInputShow: false,
    };
  },
  computed: {
    //表格是否加载
    isTableLoading() {
      return this.tableLoading();
    },
  },
  mounted() {},

  methods: {
    // 表格多选事件
    selectionChange(rows) {
      this.$emit("selectionChange", rows);
    },
    //可编辑表格双击
    editableClick(e) {
      // this.editVal = e.target.innerText;
      this.isEditInputShow = true;
      e.target.setAttribute("contenteditable", true); // 开启 div 的编辑功能
      e.target.style.border = "1px solid #ccc"; // 给 div 设置一个边框
      e.target.focus(); // div 自动获取焦点，方便 blur 的逻辑运行
    },
    //可编辑表格失去焦点
    editableBlur(e, index, prop) {
      this.$emit("editableBlur", e.target.innerText, index, prop);
      e.target.setAttribute("contenteditable", false);
      e.target.style.border = "0 none";
      // this.isEditInputShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;

  .info {
    color: #909399;
  }

  .warning {
    color: #e6a23c;
  }

  .danger {
    color: #f56c6c;
  }

  .success {
    color: #67c23a;
  }

  .text {
    color: #000000;
  }

  .blue {
    color: #689ff2;
  }

  .edit {
    color: #2227d1;
    margin-right: 16px;
    cursor: pointer;

    &.more {
      margin-bottom: 20px;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }

  //   .btn-list {
  //     display: flex;
  //     justify-content: flex-end;
  //     width: 100%;
  //     height: 32px;
  //     margin-bottom: 24px;

  //     .btn {
  //       padding: 5px 16px;
  //       box-sizing: border-box;
  //       font-size: 14px;
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       border-radius: 3px;
  //       margin-right: 16px;
  //       cursor: pointer;

  //       &:last-of-type {
  //         margin-right: 0;
  //       }

  //       &.primary {
  //         background-color: #2227d1;
  //         color: #fff;
  //       }

  //       &.default {
  //         border: 1px solid #2227d1;
  //         background-color: #ffffff;
  //         color: #2227d1;
  //       }
  //     }
  //   }

  /deep/.el-table {
    color: rgba(#000000, 0.9);

    .el-table__cell {
      padding: 11px 0;
    }

    .live-header-cell {
      background-color: #f3f3f3;

      .cell {
        color: rgba(#000, 0.4);
        font-weight: 400;
        font-size: 14px;
      }
    }
  }

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

.tabelInput /deep/ .el-input__inner {
  width: 60%;
}

.editable {
  // width: 200px;
  border-radius: 4px;
}
</style>
