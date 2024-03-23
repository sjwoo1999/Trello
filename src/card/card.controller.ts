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
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
// JwT? Guard? 뭔가 필요할 듯
import { AuthGuard } from '@nestjs/passport';

// ⭐️⭐️⭐️ 우선 User 관련된 정보는 barer 토큰으로부터 받아오기 때문에, userId를 받아오거나 하는 것들은 req에서 받아오지 않도록 해야 한다. ⭐️⭐️⭐️
//

@UseGuards(AuthGuard('jwt'))
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

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

  @Post('/:columnId')
  async create(
    @Body() createCardDto: CreateCardDto,
    @Req() req: Request,
    // @Param('userId', ParseIntPipe) userId: number,
    // @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    // req에서 userId를 받아주는 형태 : Bearer Token을 사용한다면 req에서 userId에서 userId를 가져올 필요가 없다.
    const userId = req['userId'];
    const columnId = req['columnId'];

    // service에서 create 함수의 매개변수를 수정해줄 필요가 있다.
    return this.cardService.create(createCardDto, userId, columnId);
  }

  /*
      Request
      
      {
        
      }
  */

  // addUser
  @Post('/:cardId/members')
  async addMemberToCard(@Param('cardId') cardId: number, @Req() req: Request) {
    console.log(cardId);

    // 현재 로그인한 회원이 현재 워크스페이스에 해당하는지 확인해야 하고

    return this.cardService.addMemberToCard(+cardId, req['userId']);
  }

  /*
      Request
      
      {
        
      }
  */

  @Get('/:columnId')
  async findAll(@Param('columnId', ParseIntPipe) columnId: number) {
    return this.cardService.findAll(columnId);
  }

  /*
      Request
      
      {
        
      }
  */

  @Get('/:columnId/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.findOne(+id);
  }

  /*
      Request
      
      {
        
      }
  */

  @Patch('/:columnId/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.update(+id, updateCardDto);
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

  @Delete('/:columnId/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.cardService.remove(+id);
  }

  /*
      Request
      
      {
        "beforeOrderIndex": 0,
        "afterOrderIndex": 1,
      }
  */

  @Patch('/:columnId/cards/:cardId')
  async updateCardOrder(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body('rankId') rankId: string,
  ) {
    return await this.cardService.updateCardOrder(columnId, cardId, rankId);
  }
}
