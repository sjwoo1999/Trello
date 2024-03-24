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
// JwT? Guard? 뭔가 필요할 듯
import { AuthGuard } from '@nestjs/passport';
import { BoardGuard } from 'src/board/guards/board.guard';
import { Roles } from 'src/member/decorators/role.decorator';
import { Role } from 'src/member/types/role.type';
import { ColumnService } from 'src/column/column.service';
import { validate } from 'class-validator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';

// ⭐️⭐️⭐️ 우선 User 관련된 정보는 barer 토큰으로부터 받아오기 때문에, userId를 받아오거나 하는 것들은 req에서 받아오지 않도록 해야 한다. ⭐️⭐️⭐️
//

@UseGuards(JwtAuthGuard, BoardGuard)
@Controller('/board/:boardId/column/:columnId/card')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly columnService: ColumnService
  ) {}

  /*
      Request
      
      {
        "title": "Card-title",
        "content": "Card-content",
        "category": Tech,
        "color": black,
        "startDate": "2024-03-18",
        "endDate": "2024-03-25",
      }
  */

  @Post()
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async create(
    @Param('columnId') columnId: number,
    @Body() createCardDto: CreateCardDto,
    @Req() req: any,
  ) {
    // req에서 userId를 받아주는 형태 : Bearer Token을 사용한다면 req에서 userId에서 userId를 가져올 필요가 없다.
    // 근데 지금은 req로 userId와 columnId를 받아왔다?
    // service에서 create 함수의 매개변수를 수정해줄 필요가 있다.
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

  /*
      Request
      
      {
        
      }
  */

  // addUser
  @Post('/:cardId/members')
  async addMemberToCard(@Param('cardId') cardId: number, @Req() req: any) {
    console.log(cardId);

    // 현재 로그인한 회원이 현재 워크스페이스에 해당하는지 확인해야 하고

    return this.cardService.addMemberToCard(+cardId, req['userId']);
  }

  /*
      Request
      
      {
        
      }
  */

  @Get()
  async findAll(@Param('columnId', ParseIntPipe) columnId: number) {
    try {
      return await this.cardService.findAll(columnId);
    } catch (error) {
      return { meesage: `${error}`}
    }  
  }

  /*
      Request
      
      {
        
      }
  */

  @Get('/:cardId')
  async findOne(@Param('cardId') cardId: number) {
    try {
      return await   this.cardService.findOne(+cardId);
    } catch (error) {
      return { message: `${error}` }
    }
  }

  /*
      Request
      
      {
        
      }
  */

  /*
      Request
      
      {
        
      }
  */

  @Patch('/:cardId')
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async update(
    @Param('cardId') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req: any
  ) {
    try {
      return await this.cardService.update(req.user, +cardId, updateCardDto);
    } catch (error) {
      return { message: `${error}`}
    }
  }

  /*
      Request
      
      {
        "title": "Edit-title",
        "content": "edit-content",
        "category": Tech,
        "color": black,
        "startDate": "2024-03-18",
        "endDate": "2024-03-25",
      }
  */

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

  /*
      Request
      
      {
        "beforeOrderIndex": 0,
        "afterOrderIndex": 1,
      }
  */

  @Put('/:cardId')
  @Roles(Role.ADMIN, Role.SUPER, Role.USER)
  async updateCardOrder(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body('rankId') rankId: string,
  ) {
    return await this.cardService.updateCardOrder(columnId, cardId, rankId);
  }
}
