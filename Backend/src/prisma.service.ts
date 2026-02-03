import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const pool = new Pool({
      host: process.env.DB_HOST ,
      port: (process.env.DB_PORT),
      database: process.env.DB_NAME ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD ,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
}
