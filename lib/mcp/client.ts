import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export interface StdioMCPConfig {
  type: 'stdio';
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface HTTPMCPConfig {
  type: 'http';
  url: string;
  headers?: Record<string, string>;
}

export type MCPConfig = StdioMCPConfig | HTTPMCPConfig;

export class MCPClientManager {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, StdioClientTransport | StreamableHTTPClientTransport> = new Map();

  async connectToServer(
    serverName: string,
    config: MCPConfig
  ): Promise<Client> {
    if (this.clients.has(serverName)) {
      return this.clients.get(serverName)!;
    }

    let transport: StdioClientTransport | StreamableHTTPClientTransport;

    if (config.type === 'http') {
      // HTTP transport for remote MCP servers
      const url = new URL(config.url);
      transport = new StreamableHTTPClientTransport(url, config.headers ? {
        requestInit: {
          headers: config.headers,
        },
      } : undefined);
    } else {
      // Stdio transport for local MCP servers
      transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: config.env,
      });
    }

    const client = new Client(
      {
        name: `${serverName}-client`,
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);

    this.clients.set(serverName, client);
    this.transports.set(serverName, transport);

    return client;
  }

  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`MCP client for ${serverName} is not connected`);
    }

    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    return result;
  }

  async listTools(serverName: string): Promise<unknown[]> {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`MCP client for ${serverName} is not connected`);
    }

    const tools = await client.listTools();
    return tools.tools;
  }

  async disconnect(serverName: string): Promise<void> {
    const client = this.clients.get(serverName);
    const transport = this.transports.get(serverName);

    if (client) {
      await client.close();
      this.clients.delete(serverName);
    }

    if (transport) {
      await transport.close();
      this.transports.delete(serverName);
    }
  }

  async disconnectAll(): Promise<void> {
    const serverNames = Array.from(this.clients.keys());
    await Promise.all(serverNames.map(name => this.disconnect(name)));
  }

  getClient(serverName: string): Client | undefined {
    return this.clients.get(serverName);
  }

  isConnected(serverName: string): boolean {
    return this.clients.has(serverName);
  }
}

// Singleton instance
let mcpManager: MCPClientManager | null = null;

export function getMCPManager(): MCPClientManager {
  if (!mcpManager) {
    mcpManager = new MCPClientManager();
  }
  return mcpManager;
}
