const knex = require('../database/connection');
const User = require('./User');

class PasswordToken{

    async create(email){
        let user = await User.findByEmail(email)
        if (user != undefined) {
            try { 

                let token = Date.now();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table('passwordtokens');

                return {status: true, token: token};
            } catch (error) {
                return {status: false, err: error};
            }
        } else { 
            return {status: false, err: 'O e-mail não foi encontrado.'};
        }
    }

    async validate(token) { 
        let result = await knex.select().table('passwordtokens').where({token:token});
        try {
            if (result.length > 0) {
                let tk = result[0];

                if (tk.used) {
                    return {status: false};
                } else {
                    return {status: true, token: tk};
                }

            } else {
                return {status: false};
            }
        } catch (error) {
            return {status:false, err: error};
        }
    }

    async setUsed(token) {
        await knex.update({used: 1}).table('passwordtokens').where({token:token});
    }

}

module.exports = new PasswordToken();