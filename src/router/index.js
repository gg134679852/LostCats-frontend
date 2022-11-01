import { createRouter, createWebHashHistory } from 'vue-router'
import DashBoard from '../views/admin/DashBoard.vue'
import DataList from '../views/admin/DataList.vue'
import store from '../store/index'
import UserPage from '../views/UserPage.vue'
import CatList from '../components/CatList.vue'
import CatInfo from '../components/CatInfo.vue'
import CatListPage from '../views/CatListPage.vue'
import LandingPage from '../views/LandingPage.vue'
import AboutUsPage from '../views/AboutUsPage.vue'
import LoginPage from '../views/LoginPage.vue'
const routes = [
  {
    path: '/',
    component: LandingPage
  },
  {
    path: '/aboutUs',
    component: AboutUsPage
  },
  {
    path: '/login',
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      if (store.state.isAuthenticated) {
        if (store.state.currentUser.isAdmin) {
          next({ path: '/admin/dashboard/datalist' })
        } else {
          next({ path: '/' })
        }
      } else {
        next()
      }
    }
  },
  {
    path: '/catList',
    component: CatListPage,
    children: [
      {
        path: '/catList/listPage',
        component: CatList
      },
      {
        path: '/catList/infoPage/:id',
        component: CatInfo
      }
    ]
  },
  {
    path: '/userPage',
    component: UserPage,
    beforeEnter: (to, from, next) => {
      if (store.state.isAuthenticated) {
        if (store.state.currentUser.isAdmin) {
          next({ path: '/admin/dashboard' })
        } else {
          next()
        }
      } else {
        next({ path: '/login' })
      }
    }
  },
  {
    path: '/admin/dashboard',
    component: DashBoard,
    children:
      [
        {
          path: 'datalist',
          component: DataList
        }
      ],
    beforeEnter: (to, from, next) => {
      if (store.state.isAuthenticated) {
        if (store.state.currentUser.isAdmin) {
          next()
        } else {
          next({ path: '/' })
        }
      } else {
        next({ path: '/login' })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (store.state.isAuthenticated) {
    store.dispatch('fetchCurrentUser')
    next()
  } else {
    next()
  }
})

export default router
