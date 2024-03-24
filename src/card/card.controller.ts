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
  UseGuards,
  Put,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoardGuard } from 'src/board/guards/board.guard';
import { Roles } from 'src/member/decorators/role.decorator';
import { Role } from 'src/member/types/role.type';
import { ColumnService } from 'src/column/column.service';
import { validate } from 'class-validator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';

@UseGuards(JwtAuthGuard, BoardGuard)
@Controller('/board/:boardId/column/:columnId/card')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly columnService: ColumnService
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async create(
    @Param('columnId') columnId: number,
    @Body() createCardDto: CreateCardDto,
    @Req() req: any,
  ) {
    try {
      await validate(createCardDto);

      await this.columnService.findColumnById(columnId);
      createCardDto.columnId = columnId;
  
      const userId = req.user
      createCardDto.userId = userId
      return await this.cardService.create(createCardDto);
    } catch (error) {
      return { message: `${error}`}
    }
  }

  @Get()
  async findAll(@Param('columnId', ParseIntPipe) columnId: number) {
    try {
      return await this.cardService.findAll(columnId);
    } catch (error) {
      return { meesage: `${error}`}
    }  
  }

  @Get('/:cardId')
  async findOne(@Param('cardId') cardId: number) {
    try {
      return await   this.cardService.findOne(+cardId);
    } catch (error) {
      return { message: `${error}` }
    }
  }

  @Patch('/:cardId')
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async update(
    @Param('cardId') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req: any
  ) {
    try {
      return await this.cardService.update(req.user.id, +cardId, updateCardDto);
    } catch (error) {
      return { message: `${error}`}
    }
  }

  @Delete('/:cardId')
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async remove(
    @Param('cardId') cardId: number,
    @Req() req: any
  ) {
    try {
      return await this.cardService.remove(+cardId, req.user);
    } catch (error) {
      return { message: `${error}` }
    }
  }

  @Put('/:cardId')
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async updateCardOrder(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body('order') order: number,
  ) {
    console.log(cardId);
    return await this.cardService.updateCardOrder(columnId, cardId, order);
  }
}
