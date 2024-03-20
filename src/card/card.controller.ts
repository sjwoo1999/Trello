import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
/////
// import

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/:columnId')
  async create(
    @Body() createCardDto: CreateCardDto,
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    // req에서 userId를 받아주는 형태 : Bearer Token을 사용한다면 req에서 userId에서 userId를 가져올 필요가 없다.

    // service에서 create 함수의 매개변수를 수정해줄 필요가 있다.
    return this.cardService.create(createCardDto, userId, columnId);
  }

  @Get('/:columnId')
  async findAll(@Param('columnId', ParseIntPipe) columnId: number) {
    // service에서 findAll 함수의 매개변수를 수정해줄 필요가 있다.
    return this.cardService.findAll(columnId);
  }

  @Get('/:columnId/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.findOne(+id);
  }

  @Patch('/:columnId/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete('/:columnId/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.remove(+id);
  }

  @Patch('/:columnId/cards/:cardId')
  async updateCardOrder(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body('rankId') rankId: string,
  ) {
    // service에서 updateCardOrder 함수를 생성해주고 처리해주어야 한다.
    return await this.cardService.updateCardOrder(columnId, cardId, rankId);
  }
}
