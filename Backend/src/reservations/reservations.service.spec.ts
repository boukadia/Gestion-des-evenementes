import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from 'src/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'generated/prisma/client';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    event: {
      findUnique: jest.fn(),
    },
    reservation: {
      count: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    ticket: {
      create: jest.fn(),
    },
  };

  const mockAdminUser = {
    id: 1,
    email: 'admin@test.com',
    name: 'Admin Test',
    password: 'hashedPassword',
    role: Role.ADMIN,
    createdAt: new Date(),
  };

  const mockParticipantUser = {
    id: 2,
    email: 'user@test.com',
    name: 'User Test',
    password: 'hashedPassword',
    role: Role.PARTICIPANT,
    createdAt: new Date(),
  };

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    dateTime: new Date('2026-03-15T10:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    status: 'PUBLISHED',
    adminId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReservation = {
    id: 1,
    eventId: 1,
    userId: 2,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateReservationDto = { eventId: 1 };

    it('should create a reservation successfully', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.reservation.count.mockResolvedValue(50);
      mockPrismaService.reservation.findFirst.mockResolvedValueOnce(null);
      mockPrismaService.reservation.findFirst.mockResolvedValueOnce(null);
      mockPrismaService.reservation.create.mockResolvedValue(mockReservation);

      const result = await service.create(createDto, mockParticipantUser);

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.reservation.count).toHaveBeenCalledWith({
        where: { eventId: 1, status: 'CONFIRMED' },
      });
      expect(result).toEqual(mockReservation);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow('Event not found');
    });

    it('should throw ForbiddenException if event not published', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue({
        ...mockEvent,
        status: 'DRAFT',
      });

      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow('Event not available');
    });

    it('should throw BadRequestException if event is full', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.reservation.count.mockResolvedValue(100);

      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow('Event is full');
    });

    it('should throw BadRequestException if user already has active reservation', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.reservation.count.mockResolvedValue(50);
      mockPrismaService.reservation.findFirst
        .mockResolvedValueOnce({
          ...mockReservation,
          status: 'CONFIRMED',
        })
        .mockResolvedValueOnce(null);

      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow('You have already reserved a spot for this event');
    });

    it('should throw BadRequestException if user has canceled reservation', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.reservation.count.mockResolvedValue(50);
      mockPrismaService.reservation.findFirst
        .mockResolvedValueOnce(null) // First call: no active reservation
        .mockResolvedValueOnce({
          // Second call: has canceled reservation
          ...mockReservation,
          status: 'CANCELED',
        });

      await expect(
        service.create(createDto, mockParticipantUser),
      ).rejects.toThrow(
        'You have already reserved and canceled this event. Cannot reserve again.',
      );
    });
  });

  describe('findAll', () => {
    it('should return all reservations for admin', async () => {
      const mockReservations = [
        { ...mockReservation, event: mockEvent, user: mockParticipantUser },
      ];
      mockPrismaService.reservation.findMany.mockResolvedValue(
        mockReservations,
      );

      const result = await service.findAll(mockAdminUser);

      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        include: { event: true, user: true, ticket: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockReservations);
    });

    it('should throw ForbiddenException for non-admin users', async () => {
      await expect(service.findAll(mockParticipantUser)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.findAll(mockParticipantUser)).rejects.toThrow(
        'Only admin can update status',
      );
    });
  });

  describe('findMyReservations', () => {
    it('should return user reservations', async () => {
      const mockReservations = [
        { ...mockReservation, event: mockEvent, user: mockParticipantUser },
      ];
      mockPrismaService.reservation.findMany.mockResolvedValue(
        mockReservations,
      );

      const result = await service.findMyReservations(2);

      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: 2 },
        include: { event: true, user: true, ticket: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockReservations);
    });
  });

  describe('findOne', () => {
    it('should return reservation by id', async () => {
      const mockFullReservation = {
        ...mockReservation,
        event: mockEvent,
        user: mockParticipantUser,
      };
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockFullReservation,
      );

      const result = await service.findOne(1);

      expect(prismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { event: true, user: true, ticket: true },
      });
      expect(result).toEqual(mockFullReservation);
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Reservation not found',
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateReservationStatusDto = { status: 'CONFIRMED' };

    it('should update reservation status to CONFIRMED for admin', async () => {
      const mockFullReservation = {
        ...mockReservation,
        event: mockEvent,
        user: mockParticipantUser,
      };
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockFullReservation,
      );
      mockPrismaService.reservation.count.mockResolvedValue(50);
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.ticket.create.mockResolvedValue({
        id: 1,
        pdfUrl: 'tickets/ticket-1-123.pdf',
      });
      mockPrismaService.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: 'CONFIRMED',
      });

      const result = await service.update(1, updateDto, mockAdminUser);

      expect(prismaService.ticket.create).toHaveBeenCalled();
      expect(prismaService.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'CONFIRMED' },
      });
      expect(result.status).toBe('CONFIRMED');
    });

    it('should throw ForbiddenException for non-admin users', async () => {
      await expect(
        service.update(1, updateDto, mockParticipantUser),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update(1, updateDto, mockParticipantUser),
      ).rejects.toThrow('Only admin can update status');
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, updateDto, mockAdminUser),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(999, updateDto, mockAdminUser),
      ).rejects.toThrow('Reservation not found');
    });

    it('should throw BadRequestException if status already same', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: 'CONFIRMED',
      });

      await expect(service.update(1, updateDto, mockAdminUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, updateDto, mockAdminUser)).rejects.toThrow(
        'Reservation is already CONFIRMED',
      );
    });

    it('should throw BadRequestException if confirming canceled reservation', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: 'CANCELED',
      });

      await expect(service.update(1, updateDto, mockAdminUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, updateDto, mockAdminUser)).rejects.toThrow(
        'Cannot confirm a canceled reservation',
      );
    });

    it('should throw BadRequestException if canceling confirmed reservation', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: 'CONFIRMED',
      });

      await expect(
        service.update(1, { status: 'CANCELED' }, mockAdminUser),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update(1, { status: 'CANCELED' }, mockAdminUser),
      ).rejects.toThrow('Cannot cancel a confirmed reservation');
    });

    it('should throw BadRequestException if event is full when confirming', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        event: mockEvent,
      });
      mockPrismaService.reservation.count.mockResolvedValue(100);
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);

      await expect(service.update(1, updateDto, mockAdminUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, updateDto, mockAdminUser)).rejects.toThrow(
        'Event is full',
      );
    });
  });

  describe('annule', () => {
    it('should cancel user own reservation', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );
      mockPrismaService.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: 'CANCELED',
      });

      const result = await service.annule(1, mockParticipantUser);

      expect(prismaService.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'CANCELED' },
      });
      expect(result.status).toBe('CANCELED');
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.annule(999, mockParticipantUser)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.annule(999, mockParticipantUser)).rejects.toThrow(
        'Reservation not found',
      );
    });

    it('should throw ForbiddenException if user tries to cancel others reservation', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        userId: 999,
      });

      await expect(service.annule(1, mockParticipantUser)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.annule(1, mockParticipantUser)).rejects.toThrow(
        'You can only cancel your own reservations',
      );
    });

    it('should throw BadRequestException if reservation already canceled', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: 'CANCELED',
      });

      await expect(service.annule(1, mockParticipantUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.annule(1, mockParticipantUser)).rejects.toThrow(
        'Reservation already canceled',
      );
    });

    it('should throw BadRequestException if trying to cancel confirmed reservation', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        ...mockReservation,
        status: 'CONFIRMED',
      });

      await expect(service.annule(1, mockParticipantUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.annule(1, mockParticipantUser)).rejects.toThrow(
        'Cannot cancel a confirmed reservation',
      );
    });
  });
});
