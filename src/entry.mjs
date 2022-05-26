// Internal Imports
import assetManifestJson from '__STATIC_CONTENT_MANIFEST'; // eslint-disable-line import/no-unresolved -- __STATIC_CONTENT_MANIFEST is hard-coded for Cloudflare

// Local Variables
const assetMap = JSON.parse(assetManifestJson);

// Local Functions
function buildHeaders(url) {
  const { pathname } = url;
  const fileExtensionRegex = /\.([a-z]+)$/;
  const fileExtension = pathname.match(fileExtensionRegex)?.[1];
  const mimeType = getMimeType(fileExtension);

  return {
    'Cache-Control': 'no-transform, stale-if-error=0, s-maxage=30, max-age=0',
    'Content-Type': mimeType,
  };
}

function getAssetPath({ pathname }) {
  console.log({ pathname });

  // let path = pathname;
  // if (path.endsWith('/')) {
  //   path = `${assetsDirectory}${routesDirectory}${path}index.html`;
  // }
  return pathname.slice(1);
}

function getMimeType(fileExtension) {
  switch (fileExtension) {
    case 'webp':
      return 'image/webp';

    default:
      return 'text/html;charset=UTF-8';
  }
}

// Module Definition
// eslint-disable-next-line import/no-default-export -- Cloudflare Workers require a default export
export default {
  async fetch(request, environment, context) {
    const url = new URL(request.url);
    const headers = buildHeaders(url);
    const isValidMethod = /^(?:GET|HEAD)$/.test(request.method);
    if (!isValidMethod) {
      return new Response(`Method "${request.method}" not allowed`, { status: 405 });
    }

    // Respond from cache if a record exists
    const cacheRecord = await caches.default.match(request);
    if (cacheRecord) {
      return cacheRecord;
    }

    // Asset Handling
    if (url.pathname === '/') {
      const formattedManifest = JSON.stringify(JSON.parse(assetManifestJson), undefined, 2);
      const manifestElement = `<pre>${formattedManifest}</pre>`;
      return new Response(
        `<html>
          <head>
            <link rel="stylesheet" href="main.css" />
            <link rel="icon" href="favicon.webp" />
          </head>
          <body>
            <h1>hey</h1>
            ${manifestElement}
          </body>
        </html>`,
        {
          headers: {
            'Content-type': 'text/html',
          },
          status: 200,
        },
      );
    }
    const assetPath = getAssetPath(url);
    const mappedAssetPath = assetMap[assetPath];
    const assetStream = await environment.__STATIC_CONTENT.get(mappedAssetPath, { type: 'stream' }); // eslint-disable-line no-underscore-dangle -- __STATIC_CONTENT is hard-coded for Cloudflare
    if (!assetStream) {
      return new Response(`"${assetPath}" not found`, {
        headers,
        status: 404,
      });
    }

    const response = new Response(assetStream, {
      headers,
      status: 200,
    });
    context.waitUntil(caches.default.put(request, response.clone()));
    return response;
  },
};
