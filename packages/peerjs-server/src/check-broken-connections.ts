import Config from "./schemas/config";
import { Client } from "./client";
import { IRealm } from "./realm";

const DEFAULT_CHECK_INTERVAL = 300;

type CustomConfig = Pick<Config, "alive_timeout">;

export class CheckBrokenConnections {
  public readonly checkInterval: number;
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly realm: IRealm;
  private readonly config: CustomConfig;
  private readonly onClose?: (client: Client) => void;

  constructor({
    realm,
    config,
    checkInterval = DEFAULT_CHECK_INTERVAL,
    onClose,
  }: {
    realm: IRealm;
    config: CustomConfig;
    checkInterval?: number;
    onClose?: (client: Client) => void;
  }) {
    this.realm = realm;
    this.config = config;
    this.onClose = onClose;
    this.checkInterval = checkInterval;
  }

  public start(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.checkConnections();

      this.timeoutId = null;

      this.start();
    }, this.checkInterval);
  }

  public stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private checkConnections(): void {
    const clientsIds = this.realm.getClientsIds();

    const now = new Date().getTime();
    const { alive_timeout: aliveTimeout } = this.config;

    for (const clientId of clientsIds) {
      const client = this.realm.getClientById(clientId);

      if (!client) continue;

      const timeSinceLastPing = now - client.getLastPing();

      if (aliveTimeout && timeSinceLastPing < aliveTimeout) continue;

      try {
        client.getSocket()?.close();
      } finally {
        this.realm.clearMessageQueue(clientId);
        this.realm.removeClientById(clientId);

        client.setSocket(null);

        this.onClose?.(client);
      }
    }
  }
}
