const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken');

class User {

    async findAll(){
        try {
            let result = await knex.select(['id','name','email','role']).table('users');
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findByPk(id){
        try {
            let user = await knex.select(['id','name','email','role']).table('users').where({id:id});
            if (user.length > 0) {
                return user[0];
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async findByEmail(email){
        try {
            let user = await knex.select(['id','name','password','email','role']).table('users').where({email:email});
            if (user.length > 0) {
                return user[0];
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async new(email,password,name){
        try {
            let hash = await bcrypt.hash(password,10);
            await knex.insert({email,password : hash,name, role: 0}).into('users');
        } catch (error) {
            console.log(error);
        }
    }

    async findEmail(email) {
        try {
           let result = await knex.select().from('users').where({email: email});
           
           if (result.length > 0) {
                return true;
           } else {
                return false;
           }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async update(id,email,name,role) { 

        let user = await this.findByPk(id);
        
        if (user != undefined) {
            let editUser = {};
            if (email != undefined) {
                if (email != user.email){
                    let result = await this.findEmail(email);
                    if (!result) {
                        editUser.email = email;
                    } else {
                        return {status: false, err: 'E-mail já está cadastrado.'};
                    }
                }
            }

            if (name != undefined) {
                editUser.name = name;
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).table('users').where({id: id});
                return {status: true};
            } catch (error) {
                return {status: false,err: error};
            }
        } else {
            return {status: false, err: 'O usuário não existe.'}
        }

    }

    async delete(id){ 
        let user = await this.findByPk(id);
        if (user != undefined) {
            try {
                await knex.delete().where({id: id}).table('users');
                return {status: true};
            } catch (error) {
                return {status:false, err: error};
            }
        } else {
            return {status: false, err: 'Usuario não encontrado.'};
        }
    }

    async changePassword(newPassword,id,token){
        let hash = await bcrypt.hash(newPassword,10);
        await knex.update({password:hash}).table('users').where({id:id});
        await PasswordToken.setUsed(token);
    }

}

module.exports = new User();