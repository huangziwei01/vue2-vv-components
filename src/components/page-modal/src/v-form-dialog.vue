<template>
  <div>
    <el-dialog
      custom-class="form-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="480px"
      @closed="closeBtnClick"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <!-- <tab-filter v-bind="formDialogConfig" v-model="formData"></tab-filter> -->

      <div class="form-container">
        <el-form label-width="100px" ref="dialogForm">
          <el-row
            v-for="(item, idx) in formItems"
            :key="idx"
            @click="selectIdx = idx"
          >
            <el-col v-bind="colLayout">
              <el-form-item
                v-for="(i, index) in item"
                :key="index"
                :label="colon(i.label)"
                :rules="i.rules"
              >
                <template v-if="i.type === 'input'">
                  <el-input
                    :value="value[`${i.field}`]"
                    @input="updateFormData($event, i.field)"
                    placeholder="请输入内容"
                  ></el-input>
                </template>
                <!-- 选择下拉 -->
                <template v-if="i.type === 'select'">
                  <el-select
                    :value="value[`${i.field}`]"
                    @input="updateFormData($event, i.field)"
                    placeholder="请选择"
                    :style="{ width: isSelectAddBtnShow ? '90%' : '100%' }"
                  >
                    <el-option
                      v-for="s in i.selectList"
                      :key="s.value"
                      :label="s.label"
                      :value="s.value"
                    >
                    </el-option>
                  </el-select>
                  <i
                    v-if="isSelectAddBtnShow"
                    class="el-icon-circle-plus-outline select-add-icon"
                    @click="selectAddBtnClick(i.field)"
                  ></i>
                </template>
                <!-- 文本框 -->
                <template v-if="i.type === 'textarea'">
                  <el-input
                    type="textarea"
                    :value="value[`${i.field}`]"
                    @input="updateFormData($event, i.field)"
                    :placeholder="i.placeholder"
                  ></el-input>
                </template>
                <!-- 单选按钮 -->
                <template v-if="i.type === 'radio'">
                  <el-radio-group
                    :value="value[`${i.field}`]"
                    @input="updateFormData($event, i.field)"
                  >
                    <el-radio
                      v-for="s in i.selectList"
                      :key="s.value"
                      :label="s.value"
                      >{{ s.label }}</el-radio
                    >
                  </el-radio-group>
                </template>
                <!-- 日期 -->
                <template v-if="i.type === 'date'">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    :value="value[`${i.field}`]"
                    @input="updateDateFormData($event, i.field)"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>

                  <el-radio-group
                    v-if="i.timePeriod"
                    v-model="dateRadio"
                    style="margin-left: 16px"
                    @input="radioChange"
                  >
                    <el-radio :label="1">最近一周</el-radio>
                    <el-radio :label="2">最近一月</el-radio>
                    <el-radio :label="3">最近三月</el-radio>
                  </el-radio-group>
                </template>
                <template v-if="i.type === 'checkbox'">
                  <el-checkbox-group
                    :value="value[`${i.field}`]"
                    @input="updateFormData($event, i.field)"
                  >
                    <el-checkbox
                      v-for="c in i.checkBoxList"
                      :key="c.label"
                      :label="c.value"
                      >{{ c.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </template>
                <!-- 没有选择开始结束的 日期 -->
                <template v-if="i.type === 'date2'">
                  <el-date-picker
                    :value="value[`${i.field}`]"
                    @input="updateFormData($event, i.field)"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </template>
                <!-- 图片上传 -->
                <template v-if="i.type === 'picture-upload'">
                  <el-upload
                    class="fileupload"
                    ref="upload"
                    list-type="picture-card"
                    action="#"
                    :auto-upload="false"
                    :file-list="fileList"
                    accept="image/png,image/gif,image/jpg,image/jpeg"
                    show-file-list
                    multiple
                    :on-change="pictureUpload"
                  >
                    <i class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{ file }">
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                      />
                      <span class="el-upload-list__item-actions">
                        <!-- 放大预览 -->
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePicPreview(file)"
                        >
                          <i class="el-icon-zoom-in" />
                        </span>
                        <!-- 删除 -->
                        <span
                          class="el-upload-list__item-delete"
                          @click="handlePicRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                    <!-- <div slot="tip" class="el-upload__tip">{{ i.tip }}</div> -->
                  </el-upload>
                  <div class="pic-upload-tip">{{ i.tip }}</div>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div class="btn-list">
          <div class="btn default" @click="cancelBtnClick()">取消</div>
          <div class="btn primary" @click="confirmBtnClick()">确认</div>
        </div>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="previewDialogVisible"
      :modal-append-to-body="false"
    >
      <div class="preview-img">
        <img :src="imageUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putFile, removeFile } from "@/api/bussiness/bussiness";
export default {
  name: "TrioFasWebVFormDialog",
  props: {
    //与page-modal双向绑定
    value: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    //标题
    title: {
      type: String,
      default: "提示",
    },
    //表单项
    formItems: {
      type: Array,
      required: true,
    },
    //表单样式
    colLayout: {
      type: Object,
      default: () => ({
        xl: 6, // ≥1920px
        lg: 6, // ≥1200px
        md: 12, // ≥992px
        sm: 24, // ≥768px
        xs: 24, // <768px
      }),
    },
    //下拉框后是否显示增加按钮
    isSelectAddBtnShow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dialogVisible: false,
      // 上传图片预览显示隐藏
      // uploadVisible: false,
      // 预览图片路径
      imageUrl: "",
      // 图片列表
      fileList: [],
      previewDialogVisible: false,
      // 暂存图片上传规则
      // picRules: {},
    };
  },

  computed: {},

  methods: {
    colon(labek) {
      if (!labek) {
        return;
      }
      return labek + "：";
    },
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
    //图片预览
    handlePicPreview(file) {
      this.imageUrl = file.url;
      this.previewDialogVisible = true;
    },
    // 图片上传
    pictureUpload(file, fileList) {
      // this.$refs.formRef.clearValidate("picture");

      const fileItem = new FormData();
      fileItem.append("file", file.raw);
      putFile(fileItem).then((res) => {
        console.log("上传图片", res);
        file.attachId = res.data.data.attachId;
      });
      this.fileList.push(file);
      // console.log(this.fileList);
      // this.formDialogOption.form["picture"].push(file);
      // this.picRules = this.formDialogOption.formRules.picture;
      this.$emit("input", { ...this.value, pic: [...this.fileList] });
    },
    // 图片删除事件
    handlePicRemove(file) {
      let index = this.fileList.findIndex(
        (item) => item.attachId == file.attachId
      );

      removeFile([this.fileList[index].attachId]).then((res) => {
        console.log("删除图片", res);
      });

      this.fileList.splice(index, 1);

      // this.formDialogOption.form["picture"].splice(index, 1);

      // if (this.fileList.length == 0) {
      //   this.formDialogOption.formRules.picture = this.picRules;
      // }
      this.$emit("input", { ...this.value, pic: [...this.fileList] });
    },
    //表单更新
    updateFormData(val, field) {
      this.$emit("input", { ...this.value, [field]: val });
    },
    updateDateFormData(val, field) {
      let start = moment(Number(val[0])).format("YYYY-MM-DD HH:mm:ss");
      let end = moment(Number(val[1])).format("YYYY-MM-DD HH:mm:ss");
      this.$emit("input", { ...this.value, beginTime: start, endTime: end });
    },
    //下拉框新增按钮点击
    selectAddBtnClick(field) {
      this.$emit("selectAddBtnClick", field);
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

  .el-select {
    .el-input el-input--suffix {
      width: 100%;
    }
    .el-input.is-focus {
      .el-input__inner {
        border-color: #2227d1;
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: #2227d1;
    }

    &:focus {
      border-color: #2227d1;
    }
  }

  .el-textarea__inner {
    &:hover {
      border-color: #2227d1;
    }

    &:focus {
      border-color: #2227d1;
    }
  }

  .el-radio {
    //鼠标滑过改变字体和小圆圈边框的样式
    &:hover {
      border-color: #2227d1 !important;
      color: #2227d1 !important;

      //鼠标滑过时小圆点边框显示
      .el-radio__inner {
        border-color: #2227d1;
      }
    }

    .el-radio__input {
      //选中时的样式
      &.is-checked {
        .el-radio__inner {
          //选中时小圆圈的的颜色
          background-color: #2227d1;
          border-color: #2227d1;
        }

        + .el-radio__label {
          //选中时字体的颜色
          color: #2227d1 !important;
        }
      }

      .el-radio__inner {
        // 鼠标滑过小圆点时的样式
        &:hover {
          border-color: #2227d1;
        }
      }
    }
  }

  .preview-img {
    width: 100%;
    height: 100%;
    padding: 24px;

    img {
      // width: 500px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .el-form-item {
    display: flex;

    .el-form-item__content {
      flex: 1;
      margin-left: 0 !important;

      .fileupload {
        width: 100%;
        // height: 100%;

        .uploader-icon {
          font-size: 40px;

          &:hover {
            color: royalblue;
          }
        }
      }

      .el-select {
        flex: 1;
      }

      .fileupload {
        display: flex;
        flex-wrap: wrap;

        .el-upload-list--picture-card {
          .el-upload-list__item.is-ready {
            width: 88px;
            height: 88px;
          }
        }

        .el-upload--picture-card {
          width: 88px;
          height: 88px;
          display: flex;
          justify-content: center;
          align-items: center;

          &:hover {
            border-color: #2227d1;
          }

          &:focus {
            border-color: #2227d1;
          }
        }
      }
    }
  }
}

.form-container {
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .form-content {
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

.select-add-icon {
  cursor: pointer;
  margin-left: 10px;
}
</style>
