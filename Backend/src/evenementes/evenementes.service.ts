import { Injectable } from '@nestjs/common';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';

@Injectable()
export class EvenementesService {
  create(createEvenementeDto: CreateEvenementeDto) {
    return 'This action adds a new evenemente';
  }

  findAll() {
    return `This action returns all evenementes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evenemente`;
  }

  update(id: number, updateEvenementeDto: UpdateEvenementeDto) {
    return `This action updates a #${id} evenemente`;
  }

  remove(id: number) {
    return `This action removes a #${id} evenemente`;
  }
}
