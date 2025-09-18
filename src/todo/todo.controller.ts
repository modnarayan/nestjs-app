import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto, TodoQueryDto } from './dto/todo.dto';

@Controller('todos')
@UseGuards(AuthGuard('jwt'))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    return this.todoService.create(createTodoDto, req.user._id);
  }

  @Get()
  findAll(@Request() req, @Query() query: TodoQueryDto) {
    return this.todoService.findAll(req.user._id, query);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.todoService.getStats(req.user._id);
  }

  @Get('sorted')
  findAllSorted(@Request() req) {
    return this.todoService.findAllSorted(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.todoService.findOne(id, req.user._id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    return this.todoService.update(id, updateTodoDto, req.user._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.todoService.remove(id, req.user._id);
  }
}
