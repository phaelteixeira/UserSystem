const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWTSecret = 'ASdkaokad1223zc1f';

class UserController {
    async index(req,res){
        let users = await User.findAll();
        res.json(users);
    }

    async findUser(req,res){
        let id = req.params.id;

        let user = await User.findByPk(id);
        if (user != undefined){
            res.json(user);
        } else {
            res.status(404);
            res.json({ err : 'Usuário não encotrado.'});
        }
    }

    async create(req,res){
        let {name, email, password} = req.body;

        if (email == undefined || email == '' || email == ' ' || email.length < 10) { 
            res.status(400);
            res.json({err: 'O e-mail é inválido.'});
            return;
        }

        if ( name == undefined || name == '' || name == ' ' || name.length < 2) {
            res.status(400);
            res.json({err: 'O nome é inválido.'});
            return;
        }

        if (password == undefined || password == '' || password == ' ' || (password.length < 8 && password.length > 32)) {
            res.status(400);
            res.json({err: 'Senha inválida.'});
            return;
        }

        let emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(400);
            res.json({err: 'E-mail já se encontra cadastrado no banco de dados.'});
            return;
        } else {
            await User.new(email,password,name);
    
            res.status(200);
            res.json({Ok: 'Tudo ok!'});
        }

    }

    async edit(req,res){
        var {id,name,email,role} = req.body;
        let result = await User.update(id,email,name,role);
        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.json({Ok: 'Tudo ok!'});
            } else {
                res.status(404);
                res.json(result.err);
            }
        } else {
            res.status(406);
            res.json({err: 'Ocorreu um erro no servidor.'});
        }
    }

    async remove(req,res) {
        let id = req.params.id;

        let result = await User.delete(id);
        
        if (result.status) {
            let users = await User.findAll();
            res.status(200);
            res.json({Ok: 'Usuário deletado com sucesso.', Current_Users: users});
        } else {
            res.status(406);
            res.json(result.err);
        }

    }

    async recoveryPassword(req,res) {
        let email = req.body.email;

        let result = await PasswordToken.create(email);

        if (result.status) {
            res.status(200);
            res.json(result.token);
        } else {
            res.status(406);
            res.json(result.err);
        }
    }

    async changePassword(req,res){ 
        let token = req.body.token;
        let password = req.body.password;
        let isValidToken = await PasswordToken.validate(token);

        if (isValidToken.status) { 
            await User.changePassword(password,isValidToken.token.user_id,isValidToken.token.token);
            res.status(200);
            res.json({Ok: 'Senha alterada.'});
        } else {
            res.status(406);
            res.json({err: 'Token inválido.'});
        }
    }

    async login(req,res) {
        let {email, password} = req.body;

        let user = await User.findByEmail(email);

        if (user != undefined) {
            let result = await bcrypt.compare(password, user.password);

            if (result) {
                let token = jwt.sign({email: user.email, role: user.role}, JWTSecret);
                res.status(200);
                res.json({token:token});
            } else {
                res.status(400);
                res.json({err: 'Senha Incorreta.'});
            }
        } else {
            res.status(400);
            res.json({status: false, err: 'Usuário inválido.'});
        }

    }

}

module.exports = new UserController();