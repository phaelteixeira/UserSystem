<template>
  <div> 
    <h1>Edição de Usuário</h1>
    <hr>
    <div class="columns is-centered">
      <div class="column is-half">
        <p>Nome</p>
        <input class="input" type="text" placeholder="Nome do usuário" v-model="name"/>
        <p>Email</p>
        <input class="input" type="email" placeholder="email@email.com" v-model="email" />
        <div v-if="erro != undefined">
          <hr>
          <div class="notification is-danger">
            <p>{{ erro }}</p>
          </div>
        </div>
        <hr>
        <button type="button" class="button is-dark" @click="update()">Editar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  created(){
    let req = {
        headers: {
            Authorization : 'Bearer ' + localStorage.getItem('token')
        }
    }

    axios.get('http://localhost:8080/user/' + this.$route.params.id,req).then( res => {
      this.name = res.data.name;
      this.id = res.data.id;
      this.email = res.data.email;
    }).catch( err => { 
      console.log(err.response);
      this.$router.push({name: 'users'});
    })
  },
  data() {
    return {
      name: '',
      email: '',
      id: -1,
      erro: undefined
    }
  },
  methods: {
    update() {
      let req = {
          headers: {
              Authorization : 'Bearer ' + localStorage.getItem('token')
          }
      }

      axios.put('http://localhost:8080/user',{
        name: this.name,
        email: this.email,
        id: this.id
      },req).then( res => {
        console.log(res);
        this.$router.push({name: 'users'});
      }).catch( err => {
        let msgError = err.response.data;
        this.erro = msgError;
      })
    }
  }
}
</script>

<style>

</style>