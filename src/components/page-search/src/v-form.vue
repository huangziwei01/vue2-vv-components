<template>
  <div class="tab-container" :class="{ unfold: isUnfold }">
    <div class="left" :style="`height:${checkLeftHeight}px`">
      <el-row
        :gutter="30"
        class="option-container"
        v-for="(item, idx) in formItems"
        :key="idx"
        @click="selectIdx = idx"
      >
        <el-col
          v-for="(i, index) in item"
          v-bind="colLayout"
          class="option-item"
          :class="{
            checkbox: i.type === 'checkbox',
            singleRow: i.singleRow,
          }"
          :key="index"
        >
          <span class="option-title" v-if="i.type !== 'radioGroup'"
            >{{ i.label }}：</span
          >
          <template v-if="i.type === 'slot'">
            <slot name="form-slot"></slot>
          </template>
          <!-- 输入框 -->
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
          <div
            v-if="i.type === 'date'"
            :class="{
              beginAndEndDateWithRadio: i.timePeriod === true,
            }"
          >
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              :value="value[`${i.field}`]"
              @input="updateBeginEndDateFormData($event, i.field)"
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
          </div>

          <!-- 没有选择开始结束的 日期 -->
          <div v-if="i.type === 'date2'">
            <el-date-picker
              :value="value[`${i.field}`]"
              @input="updateDateFormData($event, i.field)"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
          <!-- 复选框 -->
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
          <!-- 单选框 -->
          <template v-if="i.type === 'radioGroup'">
            <el-radio-group
              :value="value[`${i.field}`]"
              @input="updateFormData($event, i.field)"
            >
              <el-radio
                v-for="c in i.radioGroupList"
                :key="c.label"
                :label="c.value"
                >{{ c.label }}</el-radio
              >
            </el-radio-group>
          </template>
        </el-col>
      </el-row>
    </div>
    <div class="right">
      <div class="btn-container">
        <div
          class="open-btn"
          :class="{ active: checkShowType === 1 }"
          @click="openHandle"
          v-if="isUnfoldBtnShow"
        >
          {{ checkShowType === 1 ? "收起" : "展开" }}
        </div>

        <!-- 预留按钮插槽 -->
        <slot name="handler"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "TrioFasWebVForm",
  props: {
    //与page-search双向绑定
    value: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    //数组中的一个元素为一行表单项
    formItems: {
      type: Array,
      default: () => [],
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
    isUnfoldBtnShow: {
      type: Boolean,
      default: true,
    },
    isSelectAddBtnShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkShowType: 0,
      // 当前点击的第几行
      selectIdx: -1,
      formData: {},
      dateRadio: "",
      //改变overflow-y
      isUnfold: false,
    };
  },

  computed: {
    // 改变高度
    checkLeftHeight() {
      return this.checkShowType === 1 ? this.formItems.length * 64 - 24 : 32;
    },
  },

  methods: {
    // 展开事件
    openHandle() {
      this.checkShowType = this.checkShowType === 1 ? 0 : 1;
      if (this.checkShowType) {
        this.isUnfold = true;
      } else {
        this.isUnfold = false;
      }
      // if (type === 1){}
    },
    // 单选改变
    radioChange(label) {
      const dayMap = {
        1: 7,
        2: 30,
        3: 90,
      };
      const days = dayMap[label];
      const before = moment()
        .subtract(days, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      let now = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
      this.$emit("input", { ...this.value, beginAndEndDate: [before, now] });
    },
    //表单改变后更新vuex中的queryInfo
    updateFormData(val, field) {
      this.$emit("input", { ...this.value, [field]: val });
    },
    //处理有开始结束的日期
    updateBeginEndDateFormData(val, field) {
      let start = moment(Number(val[0])).format("YYYY-MM-DD HH:mm:ss");
      let end = moment(Number(val[1])).format("YYYY-MM-DD HH:mm:ss");
      this.$emit("input", { ...this.value, beginAndEndDate: [start, end] });
    },
    //处理精确选择的日期
    updateDateFormData(val) {
      let time = moment(Number(val)).format("YYYY-MM-DD HH:mm:ss");
      this.$emit("input", { ...this.value, singleDate: time });
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-container {
  position: relative;
  width: 100%;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  margin-bottom: 16px;
  overflow-y: hidden;
  .left {
    flex: 1;
    overflow-x: visible;
    transition: 0.3s;

    .singleRow {
      width: 100% !important;
    }
    .option-container {
      position: relative;
      width: 100%;
      height: 32px;
      margin-bottom: 24px;

      &:last-of-type {
        margin-bottom: 0;
      }

      .option-item {
        height: 32px;
        display: flex;
        align-items: center;

        &.checkbox {
          flex: 0.2;
        }

        &:last-of-type {
          margin-right: 0;
        }

        .option-title {
          flex: 0.1;
          font-size: 14px;
          margin-right: 16px;
          white-space: nowrap;
        }

        /deep/ {
          .el-input {
            .el-input__inner {
              height: 32px;
            }

            .el-input__icon {
              line-height: 32px;
            }
          }

          .el-input__prefix,
          .el-input__icon {
            height: 32px; // 可以通过设置行高改变图标在竖直方向上位置
          }

          .el-date-editor.el-input,
          .el-date-editor.el-input__inner {
            // flex: 1;
            height: 32px;
          }

          .el-checkbox-group {
            flex: 0.9;
            height: 32px;
          }

          .el-checkbox__input {
            &:hover {
              border-color: #2227d1 !important;
              color: #2227d1 !important;
            }

            &.is-checked {
              .el-checkbox__inner {
                background-color: #2227d1;
                border-color: #2227d1;
              }

              + .el-checkbox__label {
                //选中时字体的颜色
                color: #2227d1 !important;
              }
            }
          }

          .el-radio-group {
            display: flex;
            align-items: center;
            line-height: 32px;
            flex: 1;

            // min-width: 320px;
            .el-radio {
              height: 32px;
              display: flex;
              align-items: center;
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
              width: 16px;
              height: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              &.is-checked {
                width: 16px;
                height: 16px;
                border: 1px solid #2227d1;
                border-radius: 50%;

                .el-radio__inner {
                  //选中时小圆圈的的颜色
                  width: 7px;
                  height: 7px;
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
        }
      }

      .beginAndEndDateWithRadio {
        width: 400% !important;
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }

  .right {
    height: 32px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn-container {
      display: flex;
      align-items: center;

      .open-btn {
        width: 50px;
        position: relative;
        color: #2227d1;
        font-weight: 400;
        font-size: 14px;
        cursor: pointer;
        margin-right: 16px;

        &.active {
          &::after {
            transform: rotate(180deg);
          }
        }

        &::after {
          content: "";
          width: 0px;
          height: 0px;
          border-top: 6px solid #2227d1;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          position: absolute;
          top: 6px;
          right: -3px;
          transition: 0.3s;
        }
      }

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

      .search-btn {
        background-color: #2227d1;
        color: #ffffff;
        margin-right: 16px;
      }

      .reset-btn {
        color: #2227d1;
        border: 1px solid #2227d1;
        background-color: #ffffff;
      }
    }
  }
}
.unfold {
  overflow-y: visible !important;
}
</style>
