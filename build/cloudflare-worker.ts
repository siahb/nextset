import handler from 'vinext/server/fetch-handler';

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set('X-NextSet-Hosting', 'Cloudflare Workers');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
  },
};
