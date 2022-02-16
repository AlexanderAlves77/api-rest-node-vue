const knex = require("../database/connection")
const bcrypt = require("bcrypt")
const { where } = require("../database/connection")
const PasswordToken = require("./PasswordToken")

class User {

    async findAll() {
        try {
            const result = await knex.select(["id","name", "email", "role"]).table("users")
            return result 
        } catch (erro) {
            console.log(erro)
            return []
        }
    }

    async findById(id) {
        try {
            const result = await knex.select(["id","name", "email", "role"]).where({ id: id }).table("users")
            
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (erro) {
            console.log(erro)
            return undefined
        }
    }

    async findByEmail(email) {
        try {
            const result = await knex.select(["id","name","password", "email", "role"]).where({ email: email }).table("users")
            
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (erro) {
            console.log(erro)
            return undefined
        }
    }

    async new(name, email, password) {
        try {
            const salt = 10
            const hash = await bcrypt.hash(password, salt)
            await knex.insert({ name, email, password: hash, role: 0 }).table("users")
        } catch(erro) {
            console.log(erro)
        }        
    }

    async findEmail(email) {
        try {
            const result = await knex.select("*").from("users").where({ email: email })
            
            if(result.length > 0) {
                return true
            } else {
                return false
            }

        } catch(erro) {
            console.log(erro)
            return false
        }
        
    }

    async update(id, name, email, role) {
        const user = await this.findById(id)

        if (user !== undefined) {
            let editUser = {}            

            if (email !== undefined && email !== user.email) {
                const result = await this.findEmail(email)

                if (result === false) {
                    editUser.email = email 
                } else {
                    return { status: false, err: "O usuário já está cadastrado."}
                }
            } 

            if (name !== undefined) {
                editUser.name = name 
            }

            if (role !== undefined) {
                editUser.role = role 
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users")
                return { status: true }
            } catch (erro) {
                return { status: false, err: erro }
            }
            

        } else {
            return { status: false, err: "O usuário não existe."}
        }
        
    }

    async delete(id) {
        const user = await this.findById(id)
        
        if (user !== undefined) {
            try {
                await knex.delete().where({ id: id }).table("users")
                return { status: true }
            } catch (error) {
                return { status: false, err: error }
            }            

        } else {
            return { status: false, err: "O usuário não existe, portanto não pode ser deletado." }
        }
    }

    async changePassword(newPassword, id, token) {
        const salt = 10
        const hash = await bcrypt.hash(newPassword, salt)
        await knex.update({ password: hash }).where({ id: id }).table("users")
        await PasswordToken.setUsed(token)
    }

}

module.exports = new User()