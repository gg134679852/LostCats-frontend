<template>
  <loading-icon :active="isLoading" style="z-index: 1500;" />
  <div class="button-warp d-flex justify-content-end p-1">
    <button type="button" class="btn btn-secondary mx-3"
      @click.prevent="switcher('none', 'createNewCatData')">新增資料</button>
    <button type="button" class="btn btn-secondary" @click.prevent="filterSwitcher"><i
        class="fas fa-filter"></i>過濾器</button>
  </div>
  <div class="text-end mt-3">
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">編號</th>
          <th width="120">性別</th>
          <th width="120">毛色</th>
          <th width="120">所在地區</th>
          <th width="100">是否有照片</th>
          <th width="100">是否絕育</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" item in catData.data" :key="item.animal_id">
          <td>{{ item.animal_id }}</td>
          <td class="text-right">
            {{ item.animal_sex }}
          </td>
          <td class="text-right">
            {{ item.animal_color }}
          </td>
          <td>
            {{ item.shelter.shelter_city }}
          </td>
          <td>{{ item.album_file !== null ? '有照片' : '沒照片' }}</td>
          <td>{{ item.animal_sterilization }}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
                @click.prevent="switcher(item.animal_id, 'updateCatData')">編輯</button>
              <button class="btn btn-outline-danger btn-sm"
                @click.prevent="switcher(item.animal_id, 'deleteCatData')">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationComponent
    :pagination-links="catData.paginationLinks"
    :screen-size="screenSize"
    @fetch-animal-data="fetchAnimalData"
  />
  <CatInfoModal
    :cat-info-modal-switcher="catInfoModalSwitcher"
    :cat-info-data="catInfoData"
    :modal-type="modalType"
    :shelter-option="shelterOption"
    @form-value-enter="formValueEnter"
    @switcher="switcher"
    @upload-image="uploadImage"
    @upload-new-cat-data="uploadNewCatData"
    @updateCatData="updateCatData"
    @shelter-filter="shelterFilter"
    />
  <DelModal
    :del-modal-switcher="delModalSwitcher"
    :animal-id="deleteTargetId"
    :del-modal-type="delModalType"
    @delete-cat-data="deleteCatData"
    @switcher="switcher"
    />
  <FilterModal
    :filter-modal-switcher="filterModalSwitcher"
    :shelter-data="shelterOption"
    :color="catData.color"
    :screen-size="screenSize"
    @filter-switcher="filterSwitcher"
    @shelter-filter="shelterFilter"
    @fetch-animal-data="fetchAnimalData"
    />
</template>
<script>
import CatInfoModal from './CatInfoModal.vue'
import PaginationComponent from '../PaginationComponent.vue'
import DelModal from './DelModal.vue'
import FilterModal from '../FilterModal.vue'
export default {
  components: {
    CatInfoModal,
    PaginationComponent,
    DelModal,
    FilterModal
  },
  created () {
    this.fetchAnimalData()
  },
  data () {
    return ({
      catData: {
        data: [],
        color: [],
        paginationLinks: {}
      },
      shelterData: [],
      catInfoData: {
        album_file: '',
        animal_age: '',
        animal_bacterin: '',
        animal_bodytype: '',
        animal_color: '',
        animal_foundplace: '',
        animal_subid: 0,
        animal_remark: '',
        animal_sex: '',
        animal_sterilization: '',
        shelter_id: '0',
        shelter_city: '0'
      },
      shelterOption: [],
      currentCatData: 0,
      screenSize: 'Big',
      catInfoModalSwitcher: 'hide',
      delModalSwitcher: 'hide',
      filterModalSwitcher: 'hide',
      modalType: '',
      delModalType: 'CatList',
      deleteTargetId: 0,
      isLoading: false
    })
  },
  inject: ['Toast'],
  methods: {
    fetchAnimalData (type, value) {
      this.isLoading = true
      switch (type) {
        case 'pageClick': {
          this.$axiosHelper.get(value)
            .then((obj) => {
              const { catData } = obj.data.responseData
              if (Array.isArray(catData)) {
                this.catData.data = catData.data
              } else {
                this.catData.data = Object.values(catData.data)
              }
              this.catData.paginationLinks = {
                links: catData.links,
                currentPage: catData.current_page,
                prevPageUrl: catData.prev_page_url,
                nextPageUrl: catData.next_page_url,
                lastPage: catData.last_page
              }
              this.isLoading = false
            })
            .catch((err) => {
              this.Toast.fire({
                icon: 'error',
                title: '發生錯誤，請查看開發者工具'
              })
              console.log(err)
              this.isLoading = false
            })
          break
        }
        case 'filterData': {
          this.isLoading = true
          this.$axiosHelper.get(`animalData/getFilter?animal_sex=${value.animal_sex}&animal_color=${value.animal_color}&shelter_city=${value.shelter_city}&shelter_name=${value.shelter_name}&haveImage=${value.haveImage}&screenSize=${this.screenSize}`)
            .then((obj) => {
              const { catData } = obj.data.responseData
              if (Array.isArray(catData)) {
                this.catData.data = catData.data
              } else {
                this.catData.data = Object.values(catData.data)
              }
              this.catData.paginationLinks = {
                links: catData.links,
                currentPage: catData.current_page,
                prevPageUrl: catData.prev_page_url,
                nextPageUrl: catData.next_page_url,
                lastPage: catData.last_page
              }
              this.isLoading = false
            })
            .catch((err) => {
              this.Toast.fire({
                icon: 'error',
                title: '發生錯誤，請查看開發者工具'
              })
              console.log(err)
              this.isLoading = false
            })
          break
        }
        default: {
          this.$axiosHelper.get(`animalData?screenSize=${this.screenSize}`)
            .then((obj) => {
              const { catData, selectOption, shelterList } = obj.data.responseData
              this.catData.data = catData.data
              this.shelterData = shelterList
              this.catData.paginationLinks = {
                links: catData.links,
                currentPage: catData.current_page,
                prevPageUrl: catData.prev_page_url,
                nextPageUrl: catData.next_page_url,
                lastPage: catData.last_page
              }
              this.catData.color = selectOption.color
              this.isLoading = false
            })
            .catch((err) => {
              this.Toast.fire({
                icon: 'error',
                title: '發生錯誤，請查看開發者工具'
              })
              console.log(err)
              this.isLoading = false
            })
          break
        }
      }
    },
    formValueEnter (key, value) {
      this.catInfoData[key] = value
    },
    uploadImage (value) {
      if (value) {
        this.isLoading = true
        const responseData = new FormData()
        responseData.append('image', value)
        this.$axiosHelper.post('admin/animalData/uploadImage', responseData, {
          headers: { Accept: 'application/json' }
        })
          .then((obj) => {
            this.Toast.fire({
              icon: obj.data.icon,
              title: obj.data.message
            })
            this.catInfoData.album_file = obj.data.image
            this.isLoading = false
          })
          .catch((err) => {
            this.Toast.fire({
              icon: 'error',
              title: '發生錯誤，請查看開發者工具'
            })
            console.log(err)
            this.isLoading = false
          })
      }
    },
    uploadNewCatData () {
      this.isLoading = true
      this.$axiosHelper.post('admin/animalData/createNewCatData', this.catInfoData)
        .then((obj) => {
          this.Toast.fire({
            icon: obj.data.icon,
            title: obj.data.message
          })
          this.isLoading = false
        })
        .catch((err) => {
          if (err.response.data.errors) {
            const errorMessage = err.response.data.errors
            const objectKey = Object.keys(errorMessage)
            objectKey.forEach((key) => {
              return this.Toast.fire({
                icon: 'warning',
                title: `${errorMessage[key]}`
              })
            })
            this.isLoading = false
          }
        })
    },
    updateCatData () {
      this.isLoading = true
      const objectKey = Object.keys(this.catInfoData)
      const isUpdate = objectKey.map((key) => {
        if (key === 'shelter_id' || key === 'shelter_city') {
          if (key === 'shelter_id') {
            return this.catData.data[this.currentCatData].shelter.id === this.catInfoData[key]
          } else {
            return this.catData.data[this.currentCatData].shelter[key] === this.catInfoData[key]
          }
        } else {
          return this.catData.data[this.currentCatData][key] === this.catInfoData[key]
        }
      })
      if (isUpdate.includes(false)) {
        this.$axiosHelper.put(`admin/animalData/updateCatData?id=${this.catData.data[this.currentCatData].id}`, this.catInfoData)
          .then((obj) => {
            this.fetchAnimalData()
            this.Toast.fire({
              icon: obj.data.icon,
              title: obj.data.message
            })
            this.isLoading = false
          })
          .catch((err) => {
            if (err.response.data.errors) {
              const errorMessage = err.response.data.errors
              const objectKey = Object.keys(errorMessage)
              objectKey.forEach((key) => {
                return this.Toast.fire({
                  icon: 'warning',
                  title: `${errorMessage[key]}`
                })
              })
              this.isLoading = false
            }
          })
      } else {
        this.Toast.fire({
          icon: 'error',
          title: '資料尚未更新'
        })
      }
    },
    deleteCatData (id) {
      this.isLoading = true
      this.$axiosHelper.delete(`admin/animalData/deleteCatData?id=${id}`)
        .then((obj) => {
          this.fetchAnimalData()
          this.Toast.fire({
            icon: obj.data.icon,
            title: obj.data.message
          })
          this.isLoading = false
        })
        .catch((err) => {
          this.Toast.fire({
            icon: 'error',
            title: '發生錯誤，請查看開發者工具'
          })
          console.log(err)
          this.isLoading = false
        })
    },
    switcher (id, type) {
      if (id !== 'none') {
        const catDataIndex = this.catData.data.findIndex((obj) => obj.animal_id === id)
        if (type === 'deleteCatData') {
          this.deleteTargetId = this.catData.data[catDataIndex].animal_id
        } else {
          this.shelterFilter(this.catData.data[catDataIndex].shelter.shelter_city)
          this.catInfoData = {
            album_file: this.catData.data[catDataIndex].album_file,
            animal_age: this.catData.data[catDataIndex].animal_age,
            animal_bacterin: this.catData.data[catDataIndex].animal_bacterin,
            animal_bodytype: this.catData.data[catDataIndex].animal_bodytype,
            animal_color: this.catData.data[catDataIndex].animal_color,
            animal_foundplace: this.catData.data[catDataIndex].animal_foundplace,
            animal_subid: this.catData.data[catDataIndex].animal_subid,
            animal_remark: this.catData.data[catDataIndex].animal_remark,
            animal_sex: this.catData.data[catDataIndex].animal_sex,
            animal_sterilization: this.catData.data[catDataIndex].animal_sterilization,
            shelter_id: this.catData.data[catDataIndex].shelter.id,
            shelter_city: this.catData.data[catDataIndex].shelter.shelter_city
          }
          this.currentCatData = catDataIndex
        }
      }
      switch (type) {
        case 'createNewCatData': {
          this.catInfoModalSwitcher = 'show'
          this.modalType = 'createNewCatData'
          break
        }
        case 'updateCatData': {
          this.catInfoModalSwitcher = 'show'
          this.modalType = 'updateCatData'
          break
        }
        case 'deleteCatData': {
          this.delModalSwitcher = 'show'
          break
        }
        case 'closeModal': {
          this.catInfoModalSwitcher = 'hide'
          this.delModalSwitcher = 'hide'
          this.catInfoData = {
            album_file: '',
            animal_age: '',
            animal_bacterin: '',
            animal_bodytype: '',
            animal_color: '',
            animal_foundplace: '',
            animal_remark: '',
            animal_sex: '',
            animal_sterilization: '',
            shelterData: {
              id: '',
              shelter_address: '',
              shelter_city: '',
              shelter_lat: 0,
              shelter_lng: 0,
              shelter_name: '',
              shelter_tel: ''
            }
          }
          break
        }
      }
    },
    filterSwitcher () {
      this.filterModalSwitcher === 'hide'
        ? this.filterModalSwitcher = 'show'
        : this.filterModalSwitcher = 'hide'
    },
    shelterFilter (city) {
      if (city === '0') {
        this.catInfoData.shelter_city = '0'
        this.shelterOption = this.shelterData
      }
      if (city !== '0') {
        this.catInfoData.shelter_city = city
        this.shelterOption = this.shelterData.filter(item => item.shelter_city === city)
      }
    },
    componentSwitcher (type) {
      this.$emit('componentSwitcher', type)
    }
  },
  watch: {
    shelterData (newValue, oldValue) {
      this.shelterOption = this.shelterData
    }
  }
}
</script>
