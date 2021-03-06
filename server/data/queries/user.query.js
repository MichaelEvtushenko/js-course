const knex = require('../db/connection');
const {userMapper} = require('../../helpers/query.helper');

// TODO: find only enabled users
const findByEmail = email => {
    return knex('users')
        .select('*')
        .where({email})
        .then(userMapper);
};

const insert = user => {
    return knex('users')
        .insert({
            'email': user.email,
            'password': user.hash,
            'full_name': user.fullName,
            'created_at': new Date().toISOString()
        })
        .returning('*')
        .then(userMapper);
};

const updateEnabledStatus = async ({userId, enabled}) => {
    await knex('users')
        .where({user_id: userId})
        .update({enabled});
};

const findByUserId = (userId) => {
    return knex('users')
        .where({
            user_id: userId,
            enabled: true
        })
        .select('*')
        .then(userMapper);
};

const updateRole = async ({userId, role}) => {
    await knex('users')
        .where({user_id: userId})
        .update({role});
};

const updateFullname = async ({userId, fullName}) => {
    await knex('users')
        .where({user_id: userId})
        .update({full_name: fullName});
};

module.exports = {
    insert,
    findByEmail,
    findByUserId,
    updateRole,
    updateEnabledStatus,
    updateFullname,
};
