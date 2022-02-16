<template>
    <div>
        <h2>Edição de Usuário!</h2>
        <hr>
        <div class="columns is-centered">            
            <div class="column is-half">  
                <div v-if="error !== undefined">                    
                    <div class="notification is-danger">
                        <p>{{error}}</p>
                    </div>
                </div>
                <p>Nome</p>              
                <input type="text" placeholder="Nome do usuário" 
                    class="input" v-model="name">
                <p>E-mail</p>              
                <input type="email" placeholder="email@email.com" 
                    class="input" v-model="email">                
                <hr>
                <button class="button is-success" @click="update">Editar</button>
            </div>        
        </div>
    </div>
    
</template>

<script>
import axios from 'axios'

export default {
    created()  {
        const req = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }

        axios.get("http://localhost:8686/user/" + this.$route.params.id, req)
        .then(res => {
            console.log(res)
            this.id = res.data.id
            this.name = res.data.name
            this.email = res.data.email
        }).catch(err => {
            console.log(err.response)
            this.$router.push({ name: 'Users' })
        }) 
    },
    data() {
        return {
            id: -1,
            name: '',
            email: '',
            error: undefined
        }
    },
    methods: {
        update() {
            const req = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
                }
            }

            axios.put("http://localhost:8686/user", {
                id: this.id,
                name: this.name,
                email: this.email                
            }, req).then(res => {
                console.log(res)
                this.$router.push({ name: 'Users' })
            }).catch(err => {
                const msgErro = err.response.data.err
                this.error = msgErro
            })            
        }
    }
    
}
</script>

<style scoped>

</style>