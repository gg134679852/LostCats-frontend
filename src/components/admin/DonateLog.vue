<template>
  <loading-icon :active="isLoading" style="z-index: 1500;" />
  <div class="DonateLog__table__warp">
    <table class="table mt-2">
      <thead>
        <tr>
          <th scope="col">款項編號</th>
          <th scope="col">使用者編號</th>
          <th scope="col">金額</th>
          <th scope="col">收容所名稱</th>
          <th scope="col">捐款時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in donateLog.data" :key="index">
          <td>{{item.order_Id}}</td>
          <td>{{item.user_id}}</td>
          <td>{{item.donate_price}}</td>
          <td>{{item.shelter_name}}</td>
          <td>{{item.updated_at.slice(0,10)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationComponent
    :screen-size="screenSize"
    :paginationLinks="donateLog.paginationLinks"
    @fetch-animal-data ="fetchAnimalData"
  />
</template>
<script>
import PaginationComponent from '../PaginationComponent.vue'
export default {
  components: {
    PaginationComponent
  },
  created () {
    this.fetchAnimalData()
  },
  data () {
    return ({
      donateLog: {
        data: [],
        paginationLinks: []
      },
      isLoading: false,
      screenSize: 'Big'
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
        default: {
          this.$axiosHelper.get('admin/donateLogData')
            .then((obj) => {
              const { donateLog } = obj.data
              this.donateLog.data = donateLog.data
              this.donateLog.paginationLinks = {
                links: donateLog.links,
                currentPage: donateLog.current_page,
                prevPageUrl: donateLog.prev_page_url,
                nextPageUrl: donateLog.next_page_url,
                lastPage: donateLog.last_page
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
      }
    },
    componentSwitcher (type) {
      this.$emit('componentSwitcher', type)
    }
  }
}
</script>
<style lang="scss">
@import '../../scss/DonateLog.scss';
</style>
