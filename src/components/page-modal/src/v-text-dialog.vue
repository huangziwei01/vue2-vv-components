<template>
  <div>
    <el-dialog
      custom-class="text-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="480px"
      @closed="closeBtnClick"
      :modal-append-to-body="false"
    >
      <div class="text-container">
        <div class="text-content" v-for="(t, idx) in textDialogList" :key="idx">
          <span class="label">{{ t.label }}</span>
          <span class="content" v-if="t.value !== '' && !t.isArray">{{
            t.value
          }}</span>
          <template v-if="t.value !== '' && t.isArray">
            <div style="display: flex; flex-wrap: wrap">
              <span
                class="content"
                v-for="(item, index) in t.value"
                :key="index"
                >{{ index + 1 == t.value.length ? item : `${item}、` }}</span
              >
            </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="btn-list">
          <div class="btn default" @click="cancelBtnClick">取消</div>
          <div class="btn primary" @click="confirmBtnClick">确认</div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrioFasWebVTextDialog",

  props: {
    //标题
    title: {
      type: String,
      default: "提示",
    },
    textDialogList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      dialogVisible: false,
    };
  },

  mounted() {},

  methods: {
    // 弹窗关闭按钮点击
    closeBtnClick() {
      this.$emit("closeBtnClick");
    },
    //取消按钮点击
    cancelBtnClick() {
      this.$emit("cancelBtnClick");
    },
    //确定按钮点击
    confirmBtnClick() {
      this.$emit("confirmBtnClick");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-dialog {
    border-radius: 8px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);

    .el-dialog__body {
      padding: 0;
    }

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.text-container {
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .text-content {
    display: flex;
    margin-bottom: 16px;
    font-size: 14px;

    .label {
      color: #000;
      opacity: 0.4;
      min-width: 70px;
    }

    .content {
      word-break: break-all;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.btn-list {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 32px;

  .btn {
    padding: 5px 16px;
    box-sizing: border-box;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    margin-right: 16px;
    cursor: pointer;

    &:last-of-type {
      margin-right: 0;
    }

    &.primary {
      background-color: #2227d1;
      color: #fff;
    }

    &.default {
      border: 1px solid #2227d1;
      background-color: #ffffff;
      color: #2227d1;
    }
  }
}
</style>
