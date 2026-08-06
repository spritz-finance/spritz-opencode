# Spritz — OpenCode Plugin

Spritz fiat-rail tools for OpenCode, backed by the Spritz MCP server.

## Install

Install the [`spritz` CLI](https://spritz.finance/install), then configure
OpenCode:

```bash
bunx @spritz-finance/opencode install
```

The installer:

- adds the plugin and Spritz MCP server to OpenCode;
- launches the MCP server through `spritz auth mcp`;
- adds the reviewed Spritz agent instructions; and
- writes only non-secret keyword settings.

It never asks for a key, puts a key on argv, or writes a key to OpenCode JSON or
a plaintext file.

## Human-approved access

An AI agent must not accept Developer Terms, complete business verification, or
own a Production credential. A human administrator enrolls the legal entity in
[Developer Access](https://console.spritz.finance) for **Sandbox** or requests
**Live Test**, then approves a scoped device grant. **Production** is a separate
commercial service with its own verification, agreements, and credentials:

```bash
spritz auth device start --access developer
# Human opens the returned URL and approves the requested scopes.
spritz auth device complete
spritz auth mcp
```

The currently deployed device endpoint authorizes a Spritz **user account**. It
is not yet a Developer Access workspace grant. Developer mode therefore fails
closed until platform support exists, and OpenCode's local MCP process cannot
start. Never bypass that result by giving OpenCode a raw user or Production key.

After human approval, restart OpenCode. Its MCP entry runs:

```bash
spritz auth mcp
```

The credential stays in the system keychain and is injected only into the fixed
MCP child process. The broker cannot run an arbitrary command that prints it.

## Usage

Ask the agent to list approved destinations, create a quote, or inspect an
off-ramp. The plugin detects relevant requests and injects the workflow and
safety gates.

Creating or deleting a destination, creating a fundable quote, and signing or
submitting a transaction each require fresh human confirmation. Sandbox uses
simulated funds; Live Test and Production carry real-money risk.

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

Do not add `apiKey` to this file. Secret-managed CI may explicitly inject
`SPRITZ_API_KEY` into the MCP process, but local usage should use the CLI broker.

## Uninstall

```bash
bunx @spritz-finance/opencode uninstall
```

Uninstall removes only OpenCode's Spritz plugin, MCP, instruction, and non-secret
settings entries. It does not delete credentials managed by the Spritz CLI.

## Development

```bash
bun test
bun run typecheck
bun run build
```

## License

MIT
