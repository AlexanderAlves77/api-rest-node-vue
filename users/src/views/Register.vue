<template>
    <div>
        <h2>Registro de Usuário!</h2>
        <hr>
        <div class="columns is-centered">            
            <div class="column is-half">  
                <p>Nome</p>              
                <input type="text" placeholder="Nome do usuário" 
                    class="input" v-model="name">
                <p>E-mail</p>              
                <input type="email" placeholder="email@email.com" 
                    class="input" v-model="email">
                <p>Password</p>              
                <input type="password" placeholder="**********" 
                    class="input" v-model="password">
                <hr>
                <button class="button is-success" @click="register">Cadastrar</button>
            </div>        
        </div>
    </div>
    
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            name: '',
            email: '',
            password: ''
        }
    },
    methods: {
        register() {
            axios.post("http://localhost:8686/user", {
                name: this.name,
                email: this.email,
                password: this.password
            }).then(res => {
                console.log(res)
            }).catch(err => {
                const msgErro = err.response.data.err
                console.log(msgErro)
            })            
        }
    }
    
}
</script>

<style scoped>

</style>