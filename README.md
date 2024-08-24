# KARLSEN EXPLORER

This is a fork of Kaspa explorer used for the Karlsen network project
[https://explorer.karlsennetwork.com](https://explorer.karlsennetwork.com)
written in JS with React.JS library.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deployment

For deploying the block explorer make sure that nodejs build
environment is set up by running `npm --version`. The build requires
to configure the following mandatory environment variables:

- `REACT_APP_API_ADDRESS` which is the public address of the
  REST API endpoint.
- `REACT_APP_KGI_ADDRESS` which is the public address of the
  graph inspector to inspect a specific block.

The API endpoint and Graph Inspector must operate on a web server
secured with SSL.

Optionally you can specify the explorer version to show in the
footer:

- `REACT_APP_VERCEL_GIT_COMMIT_SHA` which is the version of
  the running explorer instance (default: xxxxxx).

Build the block explorer:

```
git clone https://github.com/karlsen-network/karlsen-explorer
cd karlsen-explorer
export REACT_APP_VERCEL_GIT_COMMIT_SHA="$(git log -1 --date=short --format="%h" | tr -d '-')"
export REACT_APP_API_ADDRESS=api.karlsennetwork.com
export REACT_APP_KGI_ADDRESS=kgi.karlsennetwork.com
npm install
```

Start the block explorer:

```
node server.js
```

## Any ideas?

Do you have any new ideas, wishes or bugs for Kaspa explorer?
Contact @lAmeR^#7173 at Kaspa Discord.

Do you have any new ideas, wishes or bugs for Karlsen explorer?
Contact @Lemois#8277 at Karlsen Discord.

## DONATION ♥

Please consider a donation for Kaspa explorer team: [kaspa:qqkqkzjvr7zwxxmjxjkmxxdwju9kjs6e9u82uh59z07vgaks6gg62v8707g73](https://explorer.kaspa.org/addresses/kaspa:qqkqkzjvr7zwxxmjxjkmxxdwju9kjs6e9u82uh59z07vgaks6gg62v8707g73)

Please consider a donation for Karlsen explorer team: [karlsen:qqe3p64wpjf5y27kxppxrgks298ge6lhu6ws7ndx4tswzj7c84qkjlrspcuxw](https://explorer.karlsennetwork.com/addresses/karlsen:qqe3p64wpjf5y27kxppxrgks298ge6lhu6ws7ndx4tswzj7c84qkjlrspcuxw)
