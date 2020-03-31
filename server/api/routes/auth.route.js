const Router = require('koa-router');

const registerMiddleware = require('../middlewares/validation/register.middleware');
const signInMiddleware = require('../middlewares/validation/sign-in.middleware');
const protectedRoute = require('../middlewares/protected.middleware');
const authService = require('../services/auth.service');
const router = new Router({prefix: '/auth'});

router.get('/activate/:linkId', async ctx => {
    const linkId = ctx.params.linkId;
    await authService.activateLink(linkId);
    ctx.status = 200;
});

router.post('/login', signInMiddleware, async ctx => {
    const {email, password} = ctx.state.credentials;
    const userAgent = ctx.userAgent._agent.source;
    ctx.body = await authService.authenticate({email, password, userAgent});
});

router.post('/register', registerMiddleware, async ctx => {
    ctx.body = await authService.register(ctx.state.user);
    ctx.status = 204;
});

router.get('/logout/:refreshToken', protectedRoute(), async ctx => {
    const refreshToken = ctx.params.refreshToken;
    await authService.logout(refreshToken);
    ctx.status = 204;
});

router.get('/recover-password', async ctx => {

});

router.get('/refresh/:token', async ctx => {
    const refreshToken = ctx.params.token;
    const userAgent = ctx.userAgent._agent.source;
    ctx.body = await authService.refreshToken({refreshToken, userAgent});
});

module.exports = router;