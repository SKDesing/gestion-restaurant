// Mailcow stub - safe, no-op client so imports don't break after Mailcow removal.
export const mailcowClient = {
  async testConnection(): Promise<boolean> {
    // Mailcow integration removed: report as unavailable
    return false;
  },

  // Provide common method names used by higher-level code with safe behavior.
  async createDomain(): Promise<null> {
    throw new Error("Mailcow not configured");
  },
  async createMailbox(): Promise<null> {
    throw new Error("Mailcow not configured");
  },
};
