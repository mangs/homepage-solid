// eslint-disable-next-line import/no-default-export -- Cloudflare Workers require a default export
export default {
  fetch() {
    return new Response('hello world');
  },
};
