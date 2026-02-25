# Spritz OpenCode Plugin

Off-ramp crypto to fiat bank accounts using Spritz Finance MCP tools in [OpenCode](https://opencode.ai).

## Installation

```bash
bunx @spritz-finance/opencode install
```

Or non-interactively:

```bash
bunx @spritz-finance/opencode install --api-key sk_live_... --no-tui
```

### What it does

1. Stores your API key at `~/.config/spritz/api_key`
2. Adds the Spritz MCP server to OpenCode config (`npx @spritz-finance/mcp-server`)
3. Registers the plugin for keyword detection
4. Adds remote agent instructions

## Uninstall

```bash
bunx @spritz-finance/opencode uninstall
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `list_bank_accounts` | List saved bank account destinations |
| `create_bank_account` | Add a new bank account (US, CA, UK, IBAN) |
| `delete_bank_account` | Delete a bank account by ID |
| `create_off_ramp_quote` | Create a crypto-to-fiat quote |
| `get_off_ramp_quote` | Check quote status |
| `get_off_ramp_transaction` | Get on-chain transaction params |
| `list_off_ramps` | List off-ramp transactions |

## Keyword Detection

The plugin hooks into `chat.message` and detects payment-related keywords:

- **Payment intent**: off-ramp, send money to bank, convert crypto to fiat, cash out, withdraw to bank
- **Bank accounts**: add bank account, routing number, sort code, IBAN
- **Spritz-specific**: spritz, fiat rails, off-ramp quote

When detected, a nudge is injected telling the agent to use Spritz MCP tools with the correct workflow and security rules.

## Configuration

Optional config at `~/.config/opencode/spritz.json`:

```json
{
  "apiKey": "sk_live_...",
  "keywords": {
    "enabled": true,
    "patterns": ["custom regex pattern"]
  }
}
```

## License

MIT
