import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue';
import About from '../views/AboutView.vue';
import Login from '../views/Login.vue';
import Users from '../views/Users.vue';
import Edit from '../views/Edit.vue';
import axios from 'axios';

function AdminAuth(to, from, next) {
  if( localStorage.getItem('token') != undefined ) {
    let req = {
      headers: {
        Authorization : 'Bearer ' + localStorage.getItem('token')
      }
    }
    
    axios.post('http://localhost:8080/validate',{},req).then( res => {
      console.log(res);
      next();
    }).catch( err => {
      console.log(err.response.data.err);
      next('/login');
    })
  } else {
    next('/login');
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin/users',
    name: 'users',
    component: Users,
    beforeEnter: AdminAuth
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/admin/users/edit/:id',
    name: 'UsersEdit',
    component: Edit,
    beforeEnter: AdminAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
