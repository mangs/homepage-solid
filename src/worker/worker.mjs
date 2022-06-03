// Module Definition
// eslint-disable-next-line import/no-default-export -- Cloudflare Workers require a default export
export default {
  fetch(request /* , environment, context */) {
    const isValidMethod = /^(?:GET|HEAD)$/.test(request.method);
    if (!isValidMethod) {
      return new Response(`Method "${request.method}" not allowed`, { status: 405 });
    }

    // Asset Handling
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
          <head>
            <link rel="stylesheet" href="main.css" />
            <link rel="icon" href="favicon.webp" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Eric's Home</title>
          </head>
          <body>
            <h1>hey</h1>
            <img src="myhead.webp" alt="Mah head" />
          </body>
        </html>`,
      {
        headers: { 'Content-type': 'text/html;charset=UTF-8' },
        status: 200,
      },
    );
  },
};
