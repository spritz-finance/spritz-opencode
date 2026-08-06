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

- adds the plugin and Spritz MCP server to OpenCode;
- launches the MCP server through `spritz auth mcp --access user`;
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

After approval, restart OpenCode. Its MCP entry launches `spritz auth mcp
--access user` as a long-lived stdio server. Do not run that broker as a
one-time setup command; without an MCP client attached it waits for protocol
messages. The End User Bearer credential stays in the system keychain and is
injected only into the fixed MCP child process.

Developer workspace access is a different principal and credential model. A
person acting for the responsible business creates one workspace and obtains
organization-level HMAC credentials through the
[Developer Access flow](https://docs.spritz.finance/guides/developer-access).
Do not substitute one credential type for the other.

## Usage

Ask the agent to list approved destinations, create a quote, or inspect an
off-ramp. The plugin detects relevant requests and injects the workflow and
safety gates.

These tools act on the approving human's End User account. Creating or deleting
a destination, creating a fundable quote, and signing or submitting a
transaction each require fresh human confirmation. A live account carries
real-money risk.

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

Do not add `apiKey` to this file. Secret-managed CI may explicitly inject an
End User `SPRITZ_API_KEY` into the MCP process, but local usage should use the
CLI broker.

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
