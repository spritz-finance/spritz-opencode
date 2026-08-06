# Spritz — OpenCode Plugin

Spritz fiat-rail tools for OpenCode, backed by the Spritz MCP server and an
individual Spritz **End User account**.

## Install

Install the [`spritz` CLI](https://spritz.finance/install), then configure
OpenCode:

```bash
bunx @spritz-finance/opencode install
```

The installer:

- adds the plugin and a fail-closed Spritz MCP entry to OpenCode;
- invokes `spritz auth mcp --access user`, which deliberately refuses to
  broker a credential in the current release;
- injects the reviewed Spritz safety workflow when a relevant request is detected; and
- writes only non-secret keyword settings.

It never asks for a key, puts a key on argv, or writes a key to OpenCode JSON or
a plaintext file.

## Human-approved End User access

The owner of the affected Spritz account must approve access. An AI agent must
not create the account, perform identity verification, approve its own device
grant, or obtain a credential outside this flow.

```bash
spritz auth device start --access user
# The account owner opens the returned URL and approves the requested scopes.
spritz auth device complete
```

The MCP entry invokes `spritz auth mcp --access user`, but that command is
intentionally fail-closed. The CLI does not pass a keychain credential to a
package launched through an ambient Node/npm runtime because that is not a
credential-security boundary against same-user local code. Completing device
authorization or restarting OpenCode does not enable the MCP tools in the
current release.

Do not work around the block by putting a key in argv, OpenCode JSON, `.env`, or
a plaintext file. Wait for Spritz to ship an integrity-verifiable packaged
broker. The standalone MCP server documents a disposable Sandbox/test operator
path, but it must not be used with a Production End User account.

Developer workspace access is a different principal and credential model. A
Developer may be an individual or organization. The individual, or a person
authorized for the organization, creates one workspace and obtains Developer
HMAC credentials through the
[Developer Access flow](https://docs.spritz.finance/guides/developer-access).
Do not substitute one credential type for the other.

## Usage

After a compatible packaged broker ships, ask the agent to list approved
destinations or inspect existing off-ramp and quote status. The plugin detects
relevant requests and injects the read-only workflow and safety gates.

The reviewed MCP 0.3.2 surface contains only `list_bank_accounts`,
`list_off_ramps`, and `get_off_ramp_quote`. Destination changes, quote
creation, transaction preparation, signing, and submission are deliberately
absent until Spritz can verify a short-lived approval grant bound to the exact
action. Tool metadata or chat confirmation is not an authorization control.

## Configuration

Optional non-secret settings live at `~/.config/opencode/spritz.json`:

```json
{
  "keywords": {
    "enabled": true,
    "patterns": ["custom regex pattern"]
  }
}
```

Do not add `apiKey` to this file. The plugin does not provide a direct-key
fallback. Use only a future compatible packaged broker for local usage.

## Uninstall

```bash
bunx @spritz-finance/opencode uninstall
```

Uninstall removes only OpenCode's Spritz plugin, MCP, instruction, and
non-secret settings entries. It does not delete credentials managed by the
Spritz CLI.

## Development

```bash
bun test
bun run typecheck
bun run build
```

## License

MIT
