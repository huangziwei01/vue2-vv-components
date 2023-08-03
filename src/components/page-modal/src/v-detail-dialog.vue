<template>
  <div>
    <el-dialog
      :visible="dialogVisible"
      width="1265px"
      :before-close="handleClose"
      :modal-append-to-body="false"
      @closed="closed"
      :close-on-click-modal="false"
    >
      <div class="detail-container" v-loading="loading">
        <!-- 左内容区 -->
        <div class="left-container">
          <div class="left-header">
            <span class="title">{{ detailOption.statusTitle }}</span>
            <div
              class="status-container"
              v-if="detailOption.statusClass"
              :class="detailOption.statusClass"
            >
              <!-- 状态颜色 key 文字 -->
              <span class="status-title">{{ detailOption.statusTitle }}：</span>
              <!-- value -->
              <span class="status">{{ detailOption.status }}</span>
            </div>
          </div>

          <div class="left-content">
            <div v-for="(item, index) in detailOption.left" :key="index">
              <!-- 循环项头信息 -->
              <span class="content-title">{{ item.title }}</span>
              <el-skeleton animated :loading="loading">
                <!-- 信息 -->
                <template v-if="item.type === 'info'">
                  <div
                    class="essential-information"
                    :class="{ 'information-height': !item.needImage }"
                  >
                    <div
                      class="content"
                      v-for="(d, idx) in item.infoList"
                      :key="idx"
                    >
                      <div class="left">
                        <span class="title">{{ d.label }}：</span>
                      </div>
                      <div class="right">
                        <!-- 判断是否是照片 -->
                        <span v-if="!d.isImg">
                          <span
                            v-if="d.value.constructor === Object"
                            class="text-padding"
                            :class="d.value.stateClass"
                            >{{ d.value.value }}</span
                          >
                          <template v-else>{{ d.value }}</template>
                        </span>
                        <template v-else>
                          <el-image
                            v-for="src in d.value"
                            :key="src"
                            style="
                              width: 60px;
                              height: 60px;
                              margin-right: 20px;
                              margin-bottom: 10px;
                            "
                            :src="src"
                            :preview-src-list="d.value"
                          >
                          </el-image>
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- 表格 -->
                <template v-if="item.type === 'table'">
                  <v-table ref="vTable" v-bind="item.contentConfig"></v-table>
                </template>
                <!-- 操作记录 -->
                <template v-if="item.type === 'record'">
                  <div class="log-container-ovflower">
                    <el-empty
                      :image-size="200"
                      v-if="item.recordList.length == 0"
                    ></el-empty>
                    <div
                      v-else
                      class="log-container"
                      v-for="(d, idx) in item.recordList"
                      :key="idx"
                    >
                      <img src="@/assets/success.png" alt="" class="logImg" />
                      <div class="content">
                        <span class="time">{{ d.time }}</span>
                        <span class="desp"
                          >【{{ d.desp }}】 操作人员：{{
                            `${d.dept}/${d.user}`
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>

        <!-- 右内容区 -->
        <div class="right-container">
          <!-- 右上角的关闭图标 -->
          <div class="right-header">
            <i class="el-icon-close" @click="shutDown"></i>
          </div>
          <div
            class="right-content"
            v-for="(item, indx) in detailOption.right"
            :key="indx"
          >
            <span class="content-title">{{ item.title }}</span>
            <el-skeleton animated :loading="loading" :rows="10">
              <!-- 操作记录 -->
              <template v-if="item.type === 'record'">
                <div class="log-container-ovflower">
                  <el-empty
                    :image-size="200"
                    v-if="item.recordList.length == 0"
                  ></el-empty>
                  <div
                    v-else
                    class="log-container"
                    v-for="(d, idx) in item.recordList"
                    :key="idx"
                  >
                    <img src="@/assets/success.png" alt="" class="logImg" />
                    <div class="content">
                      <span class="time">{{ d.time }}</span>
                      <span class="desp"
                        >【{{ d.desp }}】 操作人员：{{
                          `${d.dept}/${d.user}`
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </template>
              <!-- 表格 -->
              <template v-if="item.type === 'table'">
                <v-table ref="vTable" v-bind="item.contentConfig"></v-table>
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>

      <div class="footer">
        <template v-if="detailOption.footerBtnType === 'cancelAndConfirm'">
          <div class="btn default" @click="cancelBtnClick">取消</div>
          <div class="btn primary" @click="confirmBtnClick">确认</div>
        </template>
        <template v-else-if="detailOption.footerBtnType === 'close'">
          <div class="btn primary" @click="closeBtnClick">关闭</div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import vTable from "@/components/business/page-content/src/v-table.vue";

export default {
  name: "TrioFasWebVDetailDialog",
  props: {
    //标题
    title: {
      type: String,
      default: "",
    },
    // 是否显示加载
    loading: {
      type: Boolean,
      default: false,
    },
    //详情配置项
    detailOption: {
      type: Object,
      required: true,
    },
  },
  components: {
    vTable,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },

  created() {
    // this.dialogVisible = true;
  },
  methods: {
    cancelBtnClick() {
      this.$emit("cancelBtnClick");
    },
    confirmBtnClick() {
      this.$emit("confirmBtnClick");
    },
    closeBtnClick() {
      this.$emit("closeBtnClick");
    },
    handlerClick(method) {
      this.$emit(method);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 关闭窗口
    closed() {
      this.dialogVisible = false;
    },
    // 关闭小图标
    shutDown() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-dialog__body {
    padding: 0;
    border-radius: 9px;
  }

  .el-dialog__header {
    display: none;
  }
}

.table-container {
  padding: 0 !important;
}

.detail-container {
  width: 100%;
  height: 704px;
  display: flex;
  padding: 0 24px;
  padding-top: 24px;
  box-sizing: border-box;

  .text-padding {
    padding: 3px;
    display: inline-block;
    border-radius: 4px;
    font-size: 14px;
  }

  .info {
    color: #909399;
    background-color: #dfdfdf;
  }

  .warning {
    color: #e6a23c;
    background-color: #ffe3ba;
  }

  .danger {
    color: #f56c6c;
    background-color: #ffbbbb;
  }

  .success {
    color: #67c23a;
    background-color: #cbffb1;
  }

  .text {
    color: #000000;
    background-color: #929292;
  }

  .left-container,
  .right-container {
    width: 50%;
    height: 100%;
  }

  .left-container {
    border-right: 1px solid #e7e7e7;
    position: relative;
    .left-header {
      width: 98%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      .title {
        display: inline-block;
        width: 64px;
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
        color: #000;
        opacity: 0.9;
      }

      .status-container {
        width: 200px;
        line-height: 28px;
        font-size: 14px;

        .status-title {
          color: #000;
          margin-left: 64px;
        }
      }
      .success {
        color: #67c23a;
        background: linear-gradient(
          90deg,
          rgba(0, 168, 112, 0) 0%,
          rgba(0, 168, 112, 0.8) 100%
        );
      }
      .warning {
        color: #ffb03b;
        background: linear-gradient(
          90deg,
          rgba(237, 123, 47, 0) 0%,
          rgba(255, 174, 120, 0.2) 100%
        );
      }
      .danger {
        color: #f56c6c;
        background: linear-gradient(
          90deg,
          rgba(249, 220, 222, 0) 0%,
          rgba(249, 220, 222, 0.8) 100%
        );
      }
      .info {
        color: #909399;
        background: linear-gradient(
          90deg,
          rgba(238, 238, 238, 0) 0%,
          rgba(238, 238, 238, 0.8) 100%
        );
      }
      .blue {
        color: #317bed;
        background: linear-gradient(
          90deg,
          rgba(214, 229, 251, 0) 0%,
          rgba(214, 229, 251, 0.8) 100%
        );
      }
    }

    .left-content {
      width: 600px;
      height: calc(100% - 44px);
      display: flex;
      flex-direction: column;
      overflow-y: scroll;

      .content-title {
        margin-bottom: 16px;
        display: inline-block;
        line-height: 20px;
        font-size: 14px;
        color: #000;

        &::before {
          content: "";
          display: inline-block;
          margin-right: 4px;
          width: 4px;
          height: 12px;
          border-radius: 3px;
          background: linear-gradient(
            0deg,
            rgba(34, 39, 209, 1) 0%,
            rgba(107, 114, 255, 1) 100%
          );
        }
      }

      // 基本信息

      .essential-information {
        width: 100%;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 14px;
        overflow-y: auto;
        max-height: calc(100% - 44px);

        .content {
          padding-left: 42px;
          box-sizing: border-box;
          display: flex;
          line-height: 100%;
          min-width: 280px;
          margin-bottom: 16px;

          .left {
            min-width: 70px;
          }

          .right {
            // flex: 0.7;
          }

          .title {
            color: #000000;
            opacity: 0.4;
          }
        }
      }

      .information-height {
        overflow-y: auto;
        height: 141px;
      }

      .log-container-ovflower {
        overflow: auto;
        max-height: 380px;
      }

      // 操作记录
      .log-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 28px;

        .logImg {
          width: 24px;
          height: 24px;
        }

        .content {
          width: 100%;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 16px;
          position: relative;

          &::before {
            content: "";
            position: absolute;
            display: inline-block;
            top: 35px;
            left: -29px;
            width: 2px;
            height: 32px;
            background-color: #2227d1;
          }

          .time {
            display: inline-block;
            width: 156px;
            line-height: 20px;
            color: #000000;
            opacity: 0.4;
            font-size: 14px;
          }

          .desp {
            color: #000000;
            // font-size: 16px;
          }
        }

        &:last-of-type > .content::before {
          display: none;
        }
      }
    }
  }

  .right-container {
    overflow: auto;
    .right-header {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;

      i {
        display: inline-block;
        position: absolute;
      }

      ::v-deep .el-icon-close {
        cursor: pointer;

        &:hover {
          color: blue;
        }
      }
    }

    .right-content {
      width: 100%;
      height: calc(100% - 34px);
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      margin-top: 20px;
      padding: 0 24px;
      padding-right: 0;
      box-sizing: border-box;

      .content-title {
        margin-bottom: 16px;
        display: inline-block;
        line-height: 20px;
        font-size: 14px;
        color: #000;

        &::before {
          content: "";
          display: inline-block;
          margin-right: 4px;
          width: 4px;
          height: 12px;
          border-radius: 3px;
          background: linear-gradient(
            0deg,
            rgba(34, 39, 209, 1) 0%,
            rgba(107, 114, 255, 1) 100%
          );
        }
      }

      .log-container-ovflower {
        overflow: auto;
        max-height: 600px;
      }

      .log-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 28px;

        .logImg {
          width: 24px;
          height: 24px;
        }

        .content {
          width: 100%;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 16px;
          position: relative;

          &::before {
            content: "";
            position: absolute;
            display: inline-block;
            top: 35px;
            left: -29px;
            width: 2px;
            height: 32px;
            background-color: #2227d1;
          }

          .time {
            display: inline-block;
            width: 156px;
            line-height: 20px;
            color: #000000;
            opacity: 0.4;
            font-size: 14px;
          }

          .desp {
            color: #000000;
            // font-size: 16px;
          }
        }

        &:last-of-type > .content::before {
          display: none;
        }
      }
    }
  }
}

.footer {
  width: 100%;
  height: 80px;
  padding: 24px 0;
  background-color: #ebedf1;
  display: flex;
  justify-content: flex-end;
  border-radius: 0 0 9px 9px;

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
