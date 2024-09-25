<template>
  <div> 
    <h1>Login</h1>
    <hr>
    <div class="columns is-centered">
      <div class="column is-half">
        <p>Email</p>
        <input class="input" type="email" placeholder="email@email.com" v-model="email" />
        <p>Senha</p>
        <input class="input" type="password" placeholder="*******" v-model="password"/>
        <div v-if="erro != undefined">
          <hr>
          <div class="notification is-danger">
            <p>{{ erro }}</p>
          </div>
        </div>
        <div v-if="success">
          <hr>
          <div class="notification is-success">
            <p>Logado com sucesso</p>
          </div>
        </div>
        <hr>
        <button type="button" class="button is-dark" @click="login()">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      erro: undefined,
      success: false
    }
  },
  methods: {
    login() {
      axios.post('http://localhost:8080/login',{
        email: this.email,
        password: this.password
      }).then( res => {
        console.log(res);
        localStorage.setItem('token',res.data.token);
        this.success = true;
        this.erro = undefined;
        this.$router.push({name: 'home'});
      }).catch( err => {
        let msgErr = err.response.data.err;
        this.erro = msgErr;
        this.success = false;
      })
    }
  }
}
</script>

<style>

</style>