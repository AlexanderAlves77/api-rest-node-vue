const { userParams } = require("../database/connection")
const User = require("../models/User")
const PasswordToken = require("../models/PasswordToken")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const secret = "AF52NAKN654GQWA77JTYLJ3214MRV"

class UserController {

    async index(req, res) {
        const users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res) {
        const id = req.params.id 
        const user = await User.findById(id) 

        if(user === undefined) {
            res.status(404)
            res.json({})
        } else {
            res.status(200)
            res.json(user)
        }
    }

    async create(req, res) {
        const {name, email, password} = req.body

        if (email === undefined || email === "" || email === " ") {
            res.status(400)
            res.json({ err: "O e-mail é inválido!" })
            return            
        } 

        let emailExists = await User.findEmail(email)

        if (emailExists) {
            res.status(406)
            res.json({ err: "O e-mail já está cadastrado!" })
            return
        }

        await User.new(name, email, password)

        res.status(200)
        res.send("Cadastrado com sucesso.")
    }

    async edit(req, res) {
        const { id, name, email, roles } = req.body 
        const result = await User.update(id,name,email,roles)

        if (result !== undefined) {
            if (result.status) {
                res.status(200)
                res.send("Tudo OK!")
            } else {
                res.status(406)
                res.send(result.err)
            }
            
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }
    }

    async remove(req, res) {
        const id = req.params.id 
        const result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Tudo OK!")
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res) {
        const email = req.body.email 
        const result = await PasswordToken.create(email)
        
        if (result.status) {
            res.status(200)
            res.send("" + result.token)            
            //NodeMailer.Send()

        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req, res) {
        const token = req.body.token 
        const password = req.body.password 
        const isTokenValid = await PasswordToken.validate(token)

        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada")
        } else {
            res.status(406)
            res.send("Token inválido!")
        }
    }

    async login(req, res) {
        const {email, password} = req.body 

        const user = await User.findByEmail(email)

        if (user !== undefined) {
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                const token = jwt.sign({ email: user.email, roles: user.roles }, secret)
                res.status(200)
                res.json({token: token})
                
            } else {
                res.status(406)
                res.json({ err: "Senha incorreta" })
            }

        } else {
            res.status(406)
            res.json({status: false, err: "O usuário não existe."})
        }
    }
}

module.exports = new UserController()