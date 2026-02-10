import { Test, TestingModule } from '@nestjs/testing';
import { EvenementesService } from './evenementes.service';
import { PrismaService } from 'src/prisma.service';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { Role } from 'generated/prisma/client';

describe('EvenementesService', () => {
  let service: EvenementesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: 1,
    email: 'admin@test.com',
    name: 'Admin Test',
    password: 'hashedPassword',
    role: Role.ADMIN,
    createdAt: new Date(),
  };

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    dateTime: new Date('2026-03-15T10:00:00Z'),
    location: 'Test Location',
    capacity: 100,
    status: 'DRAFT',
    adminId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvenementesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EvenementesService>(EvenementesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new event successfully', async () => {
      const createDto: CreateEvenementeDto = {
        title: 'Test Event',
        description: 'Test Description',
        dateTime: new Date('2026-03-15T10:00:00Z'),
        location: 'Test Location',
        capacity: 100,
      };

      mockPrismaService.event.create.mockResolvedValue(mockEvent);

      const result = await service.create(createDto, mockUser);

      expect(prismaService.event.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          description: createDto.description,
          dateTime: createDto.dateTime,
          location: createDto.location,
          capacity: createDto.capacity,
          adminId: mockUser.id,
        },
      });
      expect(result).toBeDefined();
      expect(result.title).toBe(mockEvent.title);
    });

    it('should throw error if event creation fails', async () => {
      const createDto: CreateEvenementeDto = {
        title: 'Test Event',
        description: 'Test Description',
        dateTime: new Date('2026-03-15T10:00:00Z'),
        location: 'Test Location',
        capacity: 100,
      };

      mockPrismaService.event.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const mockEvents = [mockEvent, { ...mockEvent, id: 2 }];
      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

      const result = await service.findAll();

      expect(prismaService.event.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(mockEvents);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no events exist', async () => {
      mockPrismaService.event.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findPublished', () => {
    it('should return only published events ordered by date', async () => {
      const publishedEvent = { ...mockEvent, status: 'PUBLISHED' };
      const mockPublishedEvents = [publishedEvent];

      mockPrismaService.event.findMany.mockResolvedValue(mockPublishedEvents);

      const result = await service.findPublished();

      expect(prismaService.event.findMany).toHaveBeenCalledWith({
        where: { status: 'PUBLISHED' },
        orderBy: { dateTime: 'asc' },
      });
      expect(result).toEqual(mockPublishedEvents);
      expect(result[0].status).toBe('PUBLISHED');
    });

    it('should return empty array when no published events exist', async () => {
      mockPrismaService.event.findMany.mockResolvedValue([]);

      const result = await service.findPublished();

      expect(result).toEqual([]);
    });
  });

  describe('changeStatus', () => {
    it('should change event status successfully', async () => {
      const changeStatusDto: ChangeStatusDto = { status: 'PUBLISHED' };
      const updatedEvent = { ...mockEvent, status: 'PUBLISHED' };

      mockPrismaService.event.update.mockResolvedValue(updatedEvent);

      const result = await service.changeStatus(1, changeStatusDto);

      expect(prismaService.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'PUBLISHED' },
      });
      expect(result).toBeDefined();
    });

    it('should throw error if event not found', async () => {
      const changeStatusDto: ChangeStatusDto = { status: 'PUBLISHED' };

      mockPrismaService.event.update.mockRejectedValue(
        new Error('Event not found'),
      );

      await expect(service.changeStatus(999, changeStatusDto)).rejects.toThrow(
        'Event not found',
      );
    });
  });

  describe('findOne', () => {
    it('should return event by id', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);

      const result = await service.findOne(1);

      expect(prismaService.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockEvent);
    });

    it('should return null if event not found', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });

    it('should throw error for invalid id', async () => {
      await expect(service.findOne(NaN)).rejects.toThrow('Invalid event ID');
      await expect(service.findOne(null as any)).rejects.toThrow(
        'Invalid event ID',
      );
    });
  });

  describe('update', () => {
    it('should update event successfully', async () => {
      const updateDto: UpdateEvenementeDto = {
        title: 'Updated Title',
        capacity: 150,
      };
      const updatedEvent = { ...mockEvent, ...updateDto };

      mockPrismaService.event.update.mockResolvedValue(updatedEvent);

      const result = await service.update(1, updateDto);

      expect(prismaService.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
      expect(result.title).toBe('Updated Title');
      expect(result.capacity).toBe(150);
    });

    it('should throw error if event not found', async () => {
      const updateDto: UpdateEvenementeDto = { title: 'Updated Title' };

      mockPrismaService.event.update.mockRejectedValue(
        new Error('Event not found'),
      );

      await expect(service.update(999, updateDto)).rejects.toThrow(
        'Event not found',
      );
    });
  });

  describe('remove', () => {
    it('should delete event successfully', async () => {
      mockPrismaService.event.delete.mockResolvedValue(mockEvent);

      const result = await service.remove(1);

      expect(prismaService.event.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeDefined();
    });

    it('should throw error if event not found', async () => {
      mockPrismaService.event.delete.mockRejectedValue(
        new Error('Event not found'),
      );

      await expect(service.remove(999)).rejects.toThrow('Event not found');
    });
  });
});
