// Module Definition
// eslint-disable-next-line import/no-default-export -- Cloudflare Workers require a default export
export default {
  fetch(request /* , environment, context */) {
    const requestUrl = new URL(request.url);
    const isValidMethod = /^(?:GET|HEAD)$/.test(request.method);
    if (!isValidMethod) {
      return new Response(`Method "${request.method}" not allowed`, { status: 405 });
    }

    // Asset Handling
    if (requestUrl.pathname === '/') {
      return new Response(
        `<html>
          <head>
            <link rel="stylesheet" href="main.css" />
            <link rel="icon" href="favicon.webp" />
          </head>
          <body>
            <h1>hey</h1>
            <input type="text" placeholder="hey y'all" value="" />
            <button>hey y'all</button>
          </body>
        </html>`,
        {
          headers: { 'Content-type': 'text/html;charset=UTF-8' },
          status: 200,
        },
      );
    }
    return fetch(request);
  },
};
