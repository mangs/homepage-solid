// Module Definition
// eslint-disable-next-line import/no-default-export -- Cloudflare Workers require a default export
export default {
  fetch(request /* , environment, context */) {
    const requestUrl = new URL(request.url);

    // Block Invalid HTTP Methods
    const isValidMethod = /^(?:GET|HEAD)$/.test(request.method);
    if (!isValidMethod) {
      return new Response(`Method "${request.method}" not allowed`, { status: 405 });
    }

    // Handle Unmatched Assets
    if (requestUrl.pathname !== '/') {
      return new Response(`"${requestUrl.pathname}" not found`, { status: 404 });
    }

    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
          <head>
            <link rel="stylesheet" href="main.css" />
            <link rel="icon" href="favicon.webp" />
            <meta name="description" content="Eric's homepage" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>hey</title>
          </head>
          <body>
            <h1>hey</h1>
            <img alt="Mah head" src="myhead.webp" height="844" width="496" />
          </body>
        </html>`,
      {
        headers: { 'Content-type': 'text/html;charset=UTF-8' },
        status: 200,
      },
    );
  },
};
