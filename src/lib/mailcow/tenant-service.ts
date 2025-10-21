import { mailcowClient } from './client';
import { db } from '@/lib/db';

function generateSecurePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function hashPassword(pw: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(pw, 10);
}

export class TenantEmailService {
  async createRestaurantEmail(params: { restaurantName: string; slug: string; domain: string; ownerFirstName: string; ownerLastName: string; ownerEmail?: string; }) {
    const { domain, slug, restaurantName, ownerFirstName, ownerLastName } = params;
    // create domain in Mailcow
    await mailcowClient.createDomain({ domain, description: `Domaine pour ${restaurantName}`, mailboxes: 20, maxquota: 20480 });

    // insert tenant (Restaurant) in DB using Prisma
    const created = await db.restaurant.create({
      data: {
        name: restaurantName,
        email: `owner@${domain}`,
        // store slug in description for now as schema doesn't have slug field;
        description: `slug:${slug}`,
      },
    });

    const tenantId = created.id;

    // create owner mailbox
    const ownerPassword = generateSecurePassword(16);
    await mailcowClient.createMailbox({ local_part: 'owner', domain, name: `${ownerFirstName} ${ownerLastName}`, password: ownerPassword, quota: 5120, active: true });

    const hashed = await hashPassword(ownerPassword);
    await db.employee.create({
      data: {
        name: `${ownerFirstName} ${ownerLastName}`,
        email: `owner@${domain}`,
        password: hashed,
        role: 'OWNER',
        hireDate: new Date(),
        restaurantId: tenantId,
      },
    });

    return {
      tenantId,
      domain,
      owner_email: `owner@${domain}`,
      owner_password: ownerPassword,
      webmail_url: process.env.MAILCOW_WEBMAIL_URL,
    };
  }

  async createEmployee(params: { tenantId: string; firstName: string; lastName: string; role: string; username: string; }) {
  const found = await db.restaurant.findUnique({ where: { id: params.tenantId } });
  if (!found) throw new Error('Tenant not found');
  const domain = found.email || '';
    const email = `${params.username}@${domain}`;
    const password = generateSecurePassword(12);
    await mailcowClient.createMailbox({ local_part: params.username, domain, name: `${params.firstName} ${params.lastName}`, password, quota: 2048, active: true });
    const hashed = await hashPassword(password);
    await db.employee.create({
      data: {
        name: `${params.firstName} ${params.lastName}`,
        email,
        password: hashed,
        role: params.role.toUpperCase() as any,
        hireDate: new Date(),
        restaurantId: params.tenantId,
      },
    });
    return { email, temporary_password: password, webmail_url: process.env.MAILCOW_WEBMAIL_URL };
  }
}

export const tenantEmailService = new TenantEmailService();
