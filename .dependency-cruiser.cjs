/**
 * Architecture boundaries from the Purna site blueprint.
 * `npm run check:boundaries` fails the build when any of these are broken.
 */
module.exports = {
  forbidden: [
    {
      name: 'module-public-interface-only',
      comment: 'A module may use another module only through that module\'s index.ts.',
      severity: 'error',
      from: { path: '^server/src/modules/([^/]+)/' },
      to: {
        path: '^server/src/modules/[^/]+/',
        pathNot: ['^server/src/modules/$1/', '^server/src/modules/[^/]+/index\\.ts$'],
      },
    },
    {
      name: 'controllers-never-touch-repositories',
      comment: 'Controllers validate input and call a service. Only services use repositories.',
      severity: 'error',
      from: { path: '\\.controller\\.ts$' },
      to: { path: '\\.repository\\.ts$' },
    },
    {
      name: 'services-never-touch-http',
      comment: 'Services hold the rules. They never see requests, responses or the web framework\'s HTTP types.',
      severity: 'error',
      from: { path: '\\.service\\.ts$' },
      to: { path: '(\\.controller\\.ts$|node_modules/express)' },
    },
    {
      name: 'common-does-not-know-modules',
      severity: 'error',
      from: { path: '^server/src/common/' },
      to: { path: '^server/src/modules/' },
    },
    {
      name: 'web-never-imports-server',
      comment: 'The View talks to the server only over HTTP through web/lib/api.ts.',
      severity: 'error',
      from: { path: '^web/' },
      to: { path: '^server/' },
    },
    {
      name: 'components-fetch-only-through-api',
      comment: 'Only web/lib/api.ts calls fetch; components and pages use its functions.',
      severity: 'error',
      from: { path: '^web/(app|components)/' },
      to: { path: '^web/lib/(?!api\\.ts$|content\\.ts$)' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    exclude: { path: '(\\.next|/out/|/dist/)' },
  },
};
