<template>
  <div class="container">
    <div class="tabs-container">
      <div
        v-for="(tab, index) in tabList"
        :key="index"
        class="tab-item"
        @click="tabItemClick(index)"
        :class="{ active: currentTabIndex === index }"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrioQmsWebVTabs",
  props: {
    tabList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentTabIndex: 0,
    };
  },

  mounted() {},

  methods: {
    tabItemClick(index) {
      this.currentTabIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .tabs-container {
    cursor: pointer;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(243, 243, 243);
    padding: 5px 10px;
    border-radius: 3px;
    .tab-item {
      text-align: center;
      line-height: 24px;
      height: 24px;
      width: 45px;
      font-size: 14px;
      border-radius: 3px;
      margin-left: 8px;

      &:nth-child(1) {
        margin-left: 0;
      }
    }

    .active {
      color: #2227d1;
      background-color: rgb(255, 255, 255);
    }
  }
}
</style>
