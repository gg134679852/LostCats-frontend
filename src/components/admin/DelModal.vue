<template>
  <div class="modal fade" id="delModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" ref="delModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <span v-if="delModalType === 'CatList'">刪除 編號 {{ animalId }}</span>
            <span v-else>刪除 {{ shelterInfoData.shelter_name }} 的資料</span>
          </h5>
        </div>
        <div class="modal-body" v-if="delModalType === 'CatList'">
          是否刪除 <strong class="text-danger">編號 {{ animalId }}</strong> (刪除後將無法恢復)。
        </div>
        <div class="modal-body" v-else>
          是否刪除 <strong class="text-danger">{{ shelterInfoData.shelter_name }}的資料</strong> (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
            @click="closeModal('none','closeModal')">取消
          </button>
          <button type="button" class="btn btn-danger"
            @click=" delModalType === 'CatList' ? deleteCatData(animalId):deleteShelterData(shelterInfoData.id)">確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from '../../../node_modules/bootstrap/js/dist/modal'
export default {
  props: {
    delModalSwitcher: {
      type: String,
      required: true
    },
    animalId: {
      type: Number
    },
    shelterInfoData: {
      type: Object
    },
    delModalType: {
      type: String,
      require: true
    }
  },
  data () {
    return ({
      modal: {}
    })
  },
  methods: {
    deleteCatData (id) {
      this.$emit('deleteCatData', id)
      this.$emit('switcher', 'none', 'closeModal')
    },
    deleteShelterData (id) {
      this.$emit('deleteShelterData', id)
      this.$emit('switcher', 'none', 'closeModal')
    },
    closeModal (id, type) {
      this.$emit('switcher', id, type)
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.delModal)
  },
  watch: {
    delModalSwitcher (newValue, oldValue) {
      return newValue === 'show' ? this.modal.show() : this.modal.hide()
    }
  }
}
</script>
