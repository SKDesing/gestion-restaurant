import axios, { AxiosInstance } from 'axios';

interface MailcowConfig {
  apiUrl?: string;
  apiKey?: string;
}

interface CreateDomainParams {
  domain: string;
  description?: string;
  aliases?: number;
  mailboxes?: number;
  maxquota?: number;
}

interface CreateMailboxParams {
  local_part: string;
  domain: string;
  name: string;
  password: string;
  quota: number;
  active: boolean;
}

export class MailcowClient {
  private client: AxiosInstance;
  private disabled = false;

  constructor(config?: MailcowConfig) {
    const apiUrl = config?.apiUrl || process.env.MAILCOW_API_URL;
    const apiKey = config?.apiKey || process.env.MAILCOW_API_KEY;
    if (!apiUrl || !apiKey) {
      // Do not throw at import/build time. Mark client as disabled and provide a
      // harmless axios instance so module import is safe during Next.js build.
      console.warn('Mailcow client disabled: MAILCOW_API_URL or MAILCOW_API_KEY not set');
      this.disabled = true;
      this.client = axios.create({ baseURL: 'http://localhost', timeout: 1000 });
      return;
    }

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async createDomain(params: CreateDomainParams) {
    if (this.disabled) throw new Error('Mailcow client not configured');
    const response = await this.client.post('/domain', {
      domain: params.domain,
      description: params.description || `Domaine pour ${params.domain}`,
      aliases: params.aliases || 400,
      mailboxes: params.mailboxes || 10,
      maxquota: params.maxquota || 10240,
      quota: 3072,
      active: 1,
      relay_all_recipients: 0,
      backupmx: 0,
    });
    return response.data;
  }

  async createMailbox(params: CreateMailboxParams) {
    if (this.disabled) throw new Error('Mailcow client not configured');
    const response = await this.client.post('/mailbox', {
      local_part: params.local_part,
      domain: params.domain,
      name: params.name,
      password: params.password,
      password2: params.password,
      quota: params.quota,
      active: params.active ? 1 : 0,
      force_pw_update: 0,
      sogo_access: 1,
    });

    const email = `${params.local_part}@${params.domain}`;
    return { email, data: response.data };
  }

  async checkDomain(domain: string): Promise<boolean> {
    if (this.disabled) return false;
    try {
      const response = await this.client.get(`/domain/${domain}`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async listMailboxes(domain: string) {
    if (this.disabled) throw new Error('Mailcow client not configured');
    const response = await this.client.get(`/mailbox/all/${domain}`);
    return response.data;
  }

  async deleteMailbox(email: string) {
    if (this.disabled) throw new Error('Mailcow client not configured');
    await this.client.post('/mailbox', {
      items: [email],
      action: 'delete',
    });
  }

  async changePassword(email: string, newPassword: string) {
    if (this.disabled) throw new Error('Mailcow client not configured');
    await this.client.post('/mailbox', {
      items: [email],
      attr: {
        password: newPassword,
        password2: newPassword,
      },
    });
  }

  async testConnection() {
    if (this.disabled) return false;
    try {
      await this.client.get('/status/version');
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const mailcowClient = new MailcowClient();
