import { PartialType } from '@nestjs/mapped-types';
import { CreateEvenementeDto } from './create-evenemente.dto';

export class UpdateEvenementeDto extends PartialType(CreateEvenementeDto) {}
