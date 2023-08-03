<template>
  <div class="page-modal">
    <!-- 详情表单 -->
    <v-detail-dialog
      ref="detailDialogRef"
      v-bind="detailDialogConfig"
      @cancelBtnClick="handleCancelBtnClick('detail')"
      @confirmBtnClick="handleConfirmBtnClick('detail')"
      @closeBtnClick="handleCloseBtnClick('detail')"
    ></v-detail-dialog>
    <!-- 输入表单 -->
    <v-form-dialog
      ref="formDialogRef"
      v-bind="formDialogConfig"
      v-model="formData"
      @cancelBtnClick="handleCancelBtnClick('form')"
      @confirmBtnClick="handleConfirmBtnClick('form')"
      @closeBtnClick="handleCloseBtnClick('form')"
      @selectAddBtnClick="selectAddBtnClick"
    ></v-form-dialog>
    <!-- 文本表单 -->
    <v-text-dialog
      ref="textDialogRef"
      v-bind="textDialogConfig"
      @cancelBtnClick="handleCancelBtnClick('text')"
      @confirmBtnClick="handleConfirmBtnClick('text')"
      @closeBtnClick="handleCloseBtnClick('text')"
    ></v-text-dialog>
  </div>
</template>

<script>
import vDetailDialog from "./v-detail-dialog.vue";
import vFormDialog from "./v-form-dialog.vue";
import vTextDialog from "./v-text-dialog.vue";

export default {
  components: { vDetailDialog, vFormDialog, vTextDialog },
  name: "TrioFasWebVPageModal",
  props: {
    //详情表单配置项
    detailDialogConfig: {
      type: Object,
      default: () => ({}),
    },
    //输入表单配置项
    formDialogConfig: {
      type: Object,
      default: () => ({}),
    },
    //文本表单配置项
    textDialogConfig: {
      type: Object,
      default: () => ({}),
    },
    //当前输入表单的类型
    currentFormDialogType: {
      type: String,
      default: "",
    },
    //当前文本表单的类型
    currentTextDialogType: {
      type: String,
      default: "",
    },
    //当前详情表单的类型
    currentDetailDialogType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      originFormData: {},
      formData: {},
    };
  },

  created() {
    //自动生成表单存储数据
    // const formItems = this.formDialogConfig.formItems.flat(Infinity);
    // for (const formItem of formItems) {
    //   this.originFormData[`${formItem.field}`] = "";
    // }
    // this.formData = { ...this.originFormData };
  },
  // watch: {
  //   formDialogConfig: {
  //     deep: true,
  //     immediate: true,
  //     handler(newVal, oldVal) {
  //       const formItems = newVal.formItems.flat(Infinity);
  //       for (const formItem of formItems) {
  //         this.originFormData[`${formItem.field}`] = "";
  //       }
  //       this.formData = { ...this.originFormData };
  //     },
  //   },
  // },
  methods: {
    //所有表单点击取消按钮后的回调
    handleCancelBtnClick(type) {
      switch (type) {
        case "detail":
          this.$emit(`${this.currentDetailDialogType}Cancel`, this.formData);
          return;
        case "form":
          this.$emit(`${this.currentFormDialogType}Cancel`, this.formData);
          return;
        case "text":
          this.$emit(`${this.currentTextDialogType}Cancel`, this.formData);
          return;
      }
    },
    //所有表单点击右上角关闭按钮后的回调
    handleCloseBtnClick(type) {
      switch (type) {
        case "detail":
          this.$refs.detailDialogRef.dialogVisible = false;
          return;
        case "form":
          this.formData = this.originFormData;
          this.$refs.formDialogRef.dialogVisible = false;
          return;
        case "text":
          this.$refs.textDialogRef.dialogVisible = false;
          return;
      }
    },
    //所有表单点击确定按钮后的回调
    handleConfirmBtnClick(type) {
      switch (type) {
        case "detail":
          this.$emit(`${this.currentDetailDialogType}Confirm`, this.formData);
          return;
        case "form":
          this.$emit(`${this.currentFormDialogType}Confirm`, this.formData);
          return;
        case "text":
          this.$emit(`${this.currentTextDialogType}Confirm`, this.formData);
          return;
      }
    },
    // 打开dialog
    openDialog(type, payload) {
      switch (type) {
        case "text":
          this.$refs.textDialogRef.dialogVisible = true;
          return;
        case "detail":
          this.$refs.detailDialogRef.dialogVisible = true;
          return;
        case "form":
          this.$refs.formDialogRef.dialogVisible = true;
          return;
      }
    },
    //根据传入参数判断关闭
    closeDialog(type, payload) {
      switch (type) {
        case "text":
          this.$refs.textDialogRef.dialogVisible = false;
          return;
        case "detail":
          this.$refs.detailDialogRef.dialogVisible = false;
          return;
        case "form":
          this.$refs.formDialogRef.dialogVisible = false;
          return;
      }
    },
    // 获取上传照片信息
    // getImgFileInfo(imgInfo) {
    //   this.$emit("getImgFileInfo", imgInfo);
    // },
    selectAddBtnClick(field) {
      this.$emit("selectAddBtnClick", field);
    },
  },
};
</script>

<style lang="scss" scoped></style>
