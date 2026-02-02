import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({ url: process.env.DATABASE_URL });
    super({ adapter });
  }
}

// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
//   async onModuleInit() {
//     await this.$connect();
//   }
//   async onModuleDestroy() {
//       await this.$disconnect();
//   }
// }
