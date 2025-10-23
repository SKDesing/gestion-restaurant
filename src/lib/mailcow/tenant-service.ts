import { mailcowClient } from "./client";

export const tenantEmailService = {
  async createRestaurantEmail(_opts: any) {
    // Mailcow removed — provide a stable error response so callers can handle it.
    throw new Error("Mailcow integration is not configured");
  },
};
