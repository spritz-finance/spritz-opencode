# Spritz — OpenCode Plugin

Off-ramp crypto to fiat bank accounts using Spritz Finance MCP tools in [OpenCode](https://opencode.ai).

## Quick Start

### 1. Get your API key

Sign up at [app.spritz.finance/api-keys](https://app.spritz.finance/api-keys).

### 2. Install

```bash
bunx @spritz-finance/opencode install
```

The installer will prompt for your API key, then configure everything automatically:
- Stores your key at `~/.config/spritz/api_key`
- Adds the Spritz MCP server to your OpenCode config
- Registers the plugin for keyword detection
- Adds agent instructions

Non-interactive mode:

```bash
bunx @spritz-finance/opencode install --api-key sk_live_... --no-tui
```

### 3. Restart OpenCode

The MCP server starts automatically. You're ready to go.

## Usage

Ask your agent to manage bank accounts, create off-ramp quotes, or execute payments. The plugin provides 7 MCP tools:

| Tool | Description |
|------|-------------|
| `list_bank_accounts` | List saved bank account destinations |
| `create_bank_account` | Add a new bank account (US, CA, UK, IBAN) |
| `delete_bank_account` | Delete a bank account by ID |
| `create_off_ramp_quote` | Create a crypto-to-fiat quote |
| `get_off_ramp_quote` | Check quote status |
| `get_off_ramp_transaction` | Get on-chain transaction params |
| `list_off_ramps` | List off-ramp transactions |

### Keyword Detection

The plugin hooks into `chat.message` and detects payment-related keywords (off-ramp, bank transfer, routing number, IBAN, etc.). When detected, it injects the Spritz workflow and security rules into context so the agent knows how to use the tools correctly.

## Supported Networks

Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, BSC, Solana, Bitcoin, and more.

## Uninstall

```bash
bunx @spritz-finance/opencode uninstall
```

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

## Prerequisites

- **Spritz API key** — [app.spritz.finance/api-keys](https://app.spritz.finance/api-keys)
- **Node.js >= 18** — for the MCP server
- **OpenCode** — [opencode.ai](https://opencode.ai)

## License

MIT
