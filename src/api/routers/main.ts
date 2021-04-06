import Router from 'koa-router';

const router = new Router();

router.get('/', (ctx) => {
  ctx.redirect('https://hapex.com.pl');
});

export default router;
