<template>
    <div>
        <h1>Usuários</h1>
        <hr>
        <div class="columns is-centered">
            <div class="column is-half">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Cargo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td v-if="user.role == 0"> Usuário Normal </td>
                            <td v-else> Admin </td>
                            <td style="display: inline-table">
                                <router-link :to="{name: 'UsersEdit', params:{id: user.id}}"><button class="button is-warning">Editar</button></router-link> 
                                <button class="button is-danger" style="margin-left:1px;" @click="showModal(user.id)">Deletar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div :class="{modal:true, 'is-active': statusModal}">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="card">
            <header class="card-header">
                <p class="card-header-title">Deseja realmente deletar este usuário?</p>
                <button class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
                </button>
            </header>
            <div class="card-content">
                <div class="content">
                    Deseja realmente deletar o usuario EXEMPLO 1.
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item" @click="hideModal">Cancelar</a>
                <a href="#" class="card-footer-item" @click="deleteUser">Deletar</a>
            </footer>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
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

        axios.get('http://localhost:8080/user',req).then( res => {
            this.users = res.data;
            console.log(this.users);
        }).catch( err => {
            console.log(err);
        })
    },
    data(){
        return {
            users: [],
            statusModal: false,
            deleteUserId: -1
        }
    },
    methods:{
        hideModal(){
            this.statusModal = false;
        },
        showModal(id){
            this.statusModal = true;
            this.deleteUserId = id;
        },
        deleteUser(){
            let req = {
                headers: {
                    Authorization : 'Bearer ' + localStorage.getItem('token')
                }
            }

            axios.delete('http://localhost:8080/user/'+this.deleteUserId,req).then( res => {
                this.statusModal = false;
                console.log(res);
                axios.get('http://localhost:8080/user',req).then( res => {
                    this.users = res.data;
                    console.log(this.users);
                }).catch( err => {
                    console.log(err);
                })
            }).catch( err => {
                console.log(err);
                this.statusModal = false;
            })
        }
    }
}
</script>

<style scoped>

</style>