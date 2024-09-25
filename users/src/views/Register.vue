<template>
  <div> 
    <h1>Registro de usuário</h1>
    <hr>
    <div class="columns is-centered">
      <div class="column is-half">
        <p>Nome</p>
        <input class="input" type="text" placeholder="Nome do usuário" v-model="name"/>
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
        <hr>
        <button type="button" class="button is-dark" @click="register()">Cadastrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      erro: undefined
    }
  },
  methods: {
    register() {
      axios.post('http://localhost:8080/user',{
        name: this.name,
        email: this.email,
        password: this.password
      }).then( res => {
        console.log(res);
        this.$router.push({name: 'home'});
      }).catch( err => {
        let msgErr = err.response.data.err;
        this.erro = msgErr;
      })
    }
  }
}
</script>

<style>

</style>