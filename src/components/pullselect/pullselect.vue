<template>
  <div class="pull-select-box">
    <div
      class="pull-select-wrap"
      :class="{ active: isShowSelect }"
      @click="sendHandle"
    >
      <i class="el-icon-arrow-down"></i>
      <i
        class="el-icon-circle-close"
        @click.stop="emitHandle(4)"
        v-if="selectedList.length > 0"
      ></i>
      <template v-if="selectedList.length > 0">
        <div
          class="select-item"
          v-for="(item, index) in selectedList"
          :key="index"
        >
          <span class="item-label">{{ item.label }}</span>
          <span class="close-icon" @click.stop="emitHandle(2, item)">x</span>
        </div>
      </template>
      <div v-else class="place-text">请选择</div>
    </div>
    <div
      class="pull-select-content"
      :style="`height:${checkHeight}px;bottom:${checkBottom}px`"
      :class="{ unshowStatus: !isShowSelect }"
    >
      <div class="pull-select-banner">
        <el-input
          placeholder="请输入内容"
          v-model="searchParams.keyName"
          suffix-icon="el-icon-search"
          @change="searchValueHandle"
        >
        </el-input>
        <div
          class="scroll-box"
          @scroll="scrollHandle"
          id="pullbanner"
          v-if="selectDataList.length > 0"
        >
          <div
            class="check-item"
            v-for="(item, index) in selectDataList"
            :key="index"
          >
            <div
              class="check-btn"
              :class="[{ active: item.checked }]"
              @click="emitHandle(3, item)"
            ></div>
            <div class="check-label" @click="emitHandle(3, item)">
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="empty" v-else>暂无数据</div>
        <div class="loading-box" v-if="checkIsRequest">
          <div class="loading-icon"></div>
          <div class="loading-label">loading...</div>
        </div>
      </div>
      <div class="smark-bg" v-show="isShowSelect" @click="sendHandle"></div>
    </div>
  </div>
</template>

<script>
import { getBatchNoList } from "@/api/problems/problem";
export default {
  props: {
    // 选择类型 1单选 2多选
    selectType: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    checkHeight() {
      return this.isShowSelect ? 368 : 0;
    },
    checkBottom() {
      return this.isShowSelect ? -372 : -4;
    },
  },
  data: () => ({
    isShowSelect: false,
    selectedList: [],
    selectDataList: [],
    searchParams: {
      current: 1,
      size: 10,
      keyName: "",
    },
    checkIsAll: false,
    checkIsRequest: false,
  }),
  methods: {
    resetListHandle() {
      this.selectedList = [];
    },
    getBatchNoList(params) {
      if (this.checkIsRequest) return;
      this.checkIsRequest = true;
      getBatchNoList(params)
        .then((res) => {
          if (res.data.code != 200) this.$message.error("请求错误！");
          let arr = res.data.data.records.map((item) => ({
            id: JSON.stringify(item),
            value: item.rollingBatchNum,
            label: item.rollingBatchNum,
            checked: false,
          }));
          arr.forEach((item) => {
            this.selectedList.forEach((sItem) => {
              if (item.value == sItem.value) {
                item.checked = true;
              }
            });
          });
          this.selectDataList.push(...arr);
          this.checkIsAll =
            this.selectDataList.length >= res.data.data.total ? true : false;
        })
        .finally(() => {
          setTimeout(() => {
            this.checkIsRequest = false;
          }, 500);
        });
    },
    sendHandle() {
      this.isShowSelect = !this.isShowSelect;
    },
    scrollHandle() {
      if (this.checkIsAll) return;
      this.scrollToBotom(".scroll-box", () => {
        this.searchParams.current++;
        this.getBatchNoList(this.searchParams);
      });
    },
    removeHanlde(val) {
      const sIndex = this.selectedList.findIndex(
        (item) => item.value == val.value
      );
      this.selectedList.splice(sIndex, 1);
    },
    emitHandle(type, val) {
      switch (type) {
        case 1:
          this.isShowSelect = !this.isShowSelect;
          break;
        case 2:
          this.removeHanlde(val);
          this.selectDataList.forEach((item) => {
            if (item.value == val.value) item.checked = false;
          });
          this.$emit("sendBackHandle", this.selectedList);
          break;
        case 3:
          let item = JSON.parse(JSON.stringify(val));
          item.checked = !item.checked;
          if (item.checked) {
            if (this.selectedList.length >= 8 && this.selectType == 2)
              return this.$message.warning("至多选择8条！");
            if (this.selectedList.length >= 1 && this.selectType == 1)
              return this.$message.warning("至多选择1条！");
          }
          this.selectDataList.forEach((item) => {
            if (item.value == val.value) {
              item.checked = !item.checked;
              if (item.checked) this.selectedList.push(val);
              if (!item.checked) this.removeHanlde(val);
            }
          });
          break;
        case 4:
          this.selectDataList.forEach((item) => {
            item.checked = false;
          });
          this.selectedList = [];
          this.$emit("clearAllHandle");
          break;
      }
    },
    scrollToBotom(el, callback) {
      var wrap = document.querySelector(el);
      var nScrollHight = 0;
      var nScrollTop = 0;
      var t = null;
      var nDivHight = wrap.clientHeight;
      nScrollHight = wrap.scrollHeight;
      nScrollTop = wrap.scrollTop;
      if (nScrollTop + nDivHight >= nScrollHight) {
        if (callback && typeof callback === "function") {
          clearTimeout(t);
          t = setTimeout(function () {
            callback();
          }, 500);
        }
      }
    },
    searchValueHandle() {
      this.selectDataList = [];
      this.searchParams.current = 1;
      this.getBatchNoList(this.searchParams);
    },
    resetHandle() {
      this.searchParams.current = 1;
      this.searchParams.size = 10;
      this.searchParams.keyName = "";
      this.selectDataList = [];
      this.checkIsRequest = false;
      this.checkIsAll = false;
    },
  },
  watch: {
    isShowSelect(newValue, oldValue) {
      if (newValue) {
        this.getBatchNoList(this.searchParams);
      }
      if (!newValue) {
        this.$emit("sendBackHandle", this.selectedList);
        console.log(this.selectedList, "发送出去的值");
        document.getElementById("pullbanner").scrollTop = 0;
        setTimeout(() => {
          this.resetHandle();
        }, 200);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.pull-select-box {
  position: relative;
  z-index: 9999;
  width: 100%;
  .pull-select-wrap {
    position: relative;
    z-index: 9999;
    cursor: pointer;
    height: 32px;
    padding: 4px 76px 4px 8px;
    border-radius: 3px;
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    transition: all 0.3s;
    display: flex;
    .place-text {
      color: rgba(#000, 0.4);
      font-weight: 400;
      font-size: 14px;
    }
    .select-item {
      margin-right: 4px;
      padding: 2px 8px;
      // display: flex;
      // align-items: center;
      border-radius: 3px;
      background-color: #e7e7e7;
      .item-label {
        color: rgba(#000, 0.9);
        font-weight: 400;
        font-size: 12px;
        margin-right: 8px;
        text-align: center;
      }
      .close-icon {
        // width: 14px;
        // height: 14px;
        font-size: 14px;
        // line-height: 14px;
        color: rgba(#000, 0.4);
        transform: scaleX(1.2);
      }
    }
    .select-item:last-child {
      margin-right: 0;
    }
    .el-icon-arrow-down {
      top: 8px;
      right: 8px;
      position: absolute;
      width: 16px;
      height: 16px;
      transition: all 0.3s;
      color: #dcdcdc;
    }
    .el-icon-circle-close {
      top: 8px;
      right: 32px;
      position: absolute;
      width: 16px;
      height: 16px;
      color: #dcdcdc;
      transition: all 0.3s;
    }
    .el-icon-circle-close:hover {
      color: rgba(#000, 0.9);
    }
  }
  .pull-select-wrap.active {
    border-color: #2227d1;
    .el-icon-arrow-down {
      transform: rotate(-180deg);
      color: #2227d1;
    }
  }
  .pull-select-content {
    overflow: hidden;
    position: absolute;
    // bottom: -372px;
    padding: 8px;
    left: 0;
    width: 100%;
    // height: 368px;
    z-index: 999;
    transition: all 0.3s;
    // min-height: 220px;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    .pull-select-banner {
      height: 100%;
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .scroll-box {
      position: relative;
      margin-top: 4px;
      height: calc(100% - 52px);
      overflow-y: scroll;
      .check-item {
        display: flex;
        align-items: center;
        height: 28px;
        margin-bottom: 4px;
        padding-left: 10px;
        .check-btn {
          width: 14px;
          height: 14px;
          border: 1px solid #dcdcdc;
          border-radius: 3px;
          margin-right: 8px;
          cursor: pointer;
        }
        .check-btn.active {
          border: none;
          background-image: url("~@/assets/check-active-icon.png");
          background-size: contain;
          background-repeat: no-repeat;
        }

        .check-label {
          cursor: pointer;
          color: rgba(#000, 0.9);
          font-weight: 400;
          font-size: 14px;
        }
      }
    }
    .empty {
      position: absolute;
      height: 24px;
      line-height: 24px;
      width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 14px;
      font-weight: 400px;
      color: rgba(#000, 0.4);
    }
  }
  .unshowStatus {
    padding: 0;
  }
  .smark-bg {
    position: fixed;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0);
  }
  .loading-box {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .loading-icon {
      animation: turn 1.5s linear infinite;
      width: 16px;
      height: 16px;
      background-image: url("~@/assets/loading-blue.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    .loading-label {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 400;
      color: #2227d1;
    }
  }
}
</style>