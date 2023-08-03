// import {
//   propertyTypeSelectDataRequest,
//   propertyNameSelectDataRequest,
//   manufactorSelectDataRequest,
//   modelSelectDataRequest,
//   supplierSelectDataRequest,
//   warehouseSelectDataRequest,
//   repairSelectDataRequest,
//   unitSelectDataRequest,
//   fittingsTypeSelectDataRequest,
//   fittingsNameSelectDataRequest,
//   supplierTypeDataRequest,
// } from "@/api/selectData/selectData";

const SET_PROPERTY_TYPE_SELECT_DATA = "SET_PROPERTY_TYPE_SELECT_DATA";
const SET_PROPERTY_NAME_SELECT_DATA = "SET_PROPERTY_NAME_SELECT_DATA";
const SET_MANUFACTOR_SELECT_DATA = "SET_MANUFACTOR_SELECT_DATA";
const SET_MODEL_SELECT_DATA = "SET_MODEL_SELECT_DATA";
const SET_SUPPLIER_SELECT_DATA = "SET_SUPPLIER_SELECT_DATA";
const SET_WAREHOUSE_SELECT_DATA = "SET_WAREHOUSE_SELECT_DATA";
const SET_REPAIR_SELECT_DATA = "SET_REPAIR_SELECT_DATA";
const SET_UNIT_SELECT_DATA = "SET_UNIT_SELECT_DATA";
const SET_FITTINGS_TYPE_SELECT_DATA = "SET_FITTINGS_TYPE_SELECT_DATA";
const SET_FITTINGS_NAME_SELECT_DATA = "SET_FITTINGS_NAME_SELECT_DATA";
const SET_SUPPLIER_TYPE_SELECT_DATA = "SET_SUPPLIER_TYPE_SELECT_DATA";

export const selectData = {
  namespaced: true,
  state: {
    //资产类型
    propertyTypeSelectData: [],
    //资产名称
    propertyNameSelectData: [],
    //设备厂商
    manufactorSelectData: [],
    //规格型号
    modelSelectData: [],
    //供应商家
    supplierSelectData: [],
    //库房库位
    warehouseSelectData: [],
    // 送修商家
    repairSelectData: [],
    //计量单位
    unitSelectData: [],
    //配件类别
    fittingsTypeSelectData: [],
    //配件名称
    fittingsNameSelectData: [],
    //商家类型
    supplierSelectData: [],
  },
  mutations: {
    SET_PROPERTY_TYPE_SELECT_DATA(state, payload) {
      state.propertyTypeSelectData = payload;
    },
    SET_PROPERTY_NAME_SELECT_DATA(state, payload) {
      state.propertyNameSelectData = payload;
    },
    SET_MANUFACTOR_SELECT_DATA(state, payload) {
      state.manufactorSelectData = payload;
    },
    SET_MODEL_SELECT_DATA(state, payload) {
      state.modelSelectData = payload;
    },
    SET_SUPPLIER_SELECT_DATA(state, payload) {
      state.supplierSelectData = payload;
    },
    SET_WAREHOUSE_SELECT_DATA(state, payload) {
      state.warehouseSelectData = payload;
    },
    SET_REPAIR_SELECT_DATA(state, payload) {
      state.repairSelectData = payload;
    },
    SET_UNIT_SELECT_DATA(state, payload) {
      state.unitSelectData = payload;
    },
    SET_FITTINGS_TYPE_SELECT_DATA(state, payload) {
      state.fittingsTypeSelectData = payload;
    },
    SET_FITTINGS_NAME_SELECT_DATA(state, payload) {
      state.fittingsNameSelectData = payload;
    },
    SET_SUPPLIER_TYPE_SELECT_DATA(state, payload) {
      state.supplierSelectData = payload;
    },
  },
  actions: {
    //资产类别
    async getPropertyTypeSelectData({ commit }) {
      const res = await propertyTypeSelectDataRequest();
      commit(SET_PROPERTY_TYPE_SELECT_DATA, res.data.data);
    },
    //资产名称
    async getPropertyNameSelectData({ commit }) {
      const res = await propertyNameSelectDataRequest();
      commit(SET_PROPERTY_NAME_SELECT_DATA, res.data.data);
    },
    //设备厂家
    async getManufactorSelectData({ commit }) {
      const res = await manufactorSelectDataRequest();
      commit(SET_MANUFACTOR_SELECT_DATA, res.data.data);
    },
    //规格型号
    async getModelSelectData({ commit }) {
      const res = await modelSelectDataRequest();
      commit(SET_MODEL_SELECT_DATA, res.data.data);
    },
    //供应商家
    async getSupplierSelectData({ commit }) {
      const res = await supplierSelectDataRequest();
      commit(SET_SUPPLIER_SELECT_DATA, res.data.data);
    },
    //库房库位
    async getWarehouseSelectData({ commit }) {
      const res = await warehouseSelectDataRequest();
      commit(SET_WAREHOUSE_SELECT_DATA, res.data.data);
    },
    // 送修商家
    async getRepairSelectDataRequest({ commit }) {
      const res = await repairSelectDataRequest();
      commit(SET_REPAIR_SELECT_DATA, res.data.data);
    },
    //计量单位
    async getUnitSelectData({ commit }) {
      const res = await unitSelectDataRequest();
      commit(SET_UNIT_SELECT_DATA, res.data.data);
    },
    //配件类别
    async getFittingsTypeSelectData({ commit }) {
      const res = await fittingsTypeSelectDataRequest();
      commit(SET_FITTINGS_TYPE_SELECT_DATA, res.data.data);
    },
    //配件名称
    async getFittingsNameSelectData({ commit }) {
      const res = await fittingsNameSelectDataRequest();
      commit(SET_FITTINGS_NAME_SELECT_DATA, res.data.data);
    },
    //商家类别
    async getSupplierSelectData({ commit }) {
      const res = await supplierTypeDataRequest();
      commit(SET_SUPPLIER_TYPE_SELECT_DATA, res.data.data);
    },
  },
};
