import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma/browser';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        user: true,
        event: true,
        reservation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMyTickets(user: User) {
    return this.prisma.ticket.findMany({
      where: {
        userId: user.id,
      },
      include: {
        event: true,
        reservation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, user: User, isAdmin = false) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: id },
      include: {
        event: true,
        reservation: true,
        user: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!isAdmin && ticket.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return ticket;
  }

  async getTicketPdfPath(
    id: number,
    user: User,
    isAdmin = false,
  ): Promise<string> {
    const ticket = await this.findOne(id, user, isAdmin);

    // Generate PDF if it doesn't exist
    if (!fs.existsSync(ticket.pdfUrl)) {
      await this.generateTicketPDF(ticket);
    }

    return ticket.pdfUrl;
  }

  private async generateTicketPDF(ticket: any) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .ticket { 
              background: white;
              border-radius: 15px;
              padding: 30px; 
              max-width: 600px; 
              margin: 0 auto;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #667eea; 
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .header h1 {
              color: #667eea;
              margin: 0;
              font-size: 28px;
            }
            .header .event-title {
              color: #333;
              font-size: 24px;
              margin: 10px 0;
            }
            .content { 
              margin: 20px 0;
              line-height: 1.6;
            }
            .content p {
              margin: 12px 0;
              font-size: 16px;
            }
            .content strong {
              color: #667eea;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .ticket-id {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
              border-left: 4px solid #667eea;
            }
        </style>
    </head>
    <body>
        <div class="ticket">
            <div class="header">
                <h1>🎟️ EVENT TICKET</h1>
                <div class="event-title">${ticket.event.title}</div>
            </div>
            <div class="content">
                <p><strong>Participant:</strong> ${ticket.user.name}</p>
                <p><strong>Email:</strong> ${ticket.user.email}</p>
                <p><strong>Event Date:</strong> ${new Date(
                  ticket.event.dateTime,
                ).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</p>
                <p><strong>Location:</strong> ${ticket.event.location}</p>
                <p><strong>Event Description:</strong> ${ticket.event.description}</p>
                
                <div class="ticket-id">
                  <strong>Ticket ID:</strong> #${ticket.id}<br>
                  <strong>Reservation ID:</strong> #${ticket.reservationId}
                </div>
            </div>
            <div class="footer">
                <p>✅ Generated on ${new Date().toLocaleDateString('fr-FR')} at ${new Date().toLocaleTimeString('fr-FR')}</p>
                <p>Please present this ticket at the event entrance</p>
            </div>  
        </div>
    </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Create directory if it doesn't exist
    const ticketsDir = path.dirname(ticket.pdfUrl);
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    await page.pdf({
      path: ticket.pdfUrl,
      format: 'A4',
      margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
      printBackground: true,
    });

    await browser.close();
  }

  async remove(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Delete PDF file if it exists
    if (fs.existsSync(ticket.pdfUrl)) {
      fs.unlinkSync(ticket.pdfUrl);
    }

    // Delete ticket from database
    await this.prisma.ticket.delete({
      where: { id: id },
    });

    return { message: 'Ticket deleted successfully' };
  }
}
