const {v4: uuid} = require('uuid');

const authLinkQuery = require('../../data/queries/auth-link.query');
const {throwInCase} = require('../../helpers/validation.helper');
const securityConfig = require('../../config/security.config');


const createAuthLink = ({userId}) => {
    const exp = Date.now() + securityConfig.authLinkExpiresIn;
    return authLinkQuery.insert({exp, userId, linkId: uuid()});
};

// TODO: make it transactional
const activateLink = async linkId => {
    throwInCase(!linkId, {message: 'Bad Request', status: 400});
    const [link] = await authLinkQuery.findByLinkId(linkId);
    throwInCase(!link, {message: 'Link does not exist', status: 400});
    const {used, exp} = link;
    throwInCase(exp < Date.now(), {message: 'Link is expired', status: 400});
    throwInCase(used, {message: 'Link already activated', status: 400});

    return authLinkQuery.activateLink(linkId);
};

module.exports = {
    createAuthLink,
    activateLink,
};