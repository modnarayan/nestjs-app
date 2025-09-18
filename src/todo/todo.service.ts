import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Todo,
  TodoDocument,
  Priority,
  TaskStatus,
} from '../schemas/todo.schema';
import { CreateTodoDto, UpdateTodoDto, TodoQueryDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const todo = new this.todoModel({
      ...createTodoDto,
      userId,
      deadline: new Date(createTodoDto.deadline),
    });
    return todo.save();
  }

  async findAll(userId: string, query: TodoQueryDto): Promise<Todo[]> {
    const filter: any = { userId, isDeleted: false };

    // Apply status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Apply priority filter
    if (query.priority) {
      filter.priority = query.priority;
    }

    // Build sort object
    const sort: any = {};

    // Custom sorting algorithm mixing time, deadline, and priority
    if (query.sortBy === 'priority') {
      // Priority sorting with custom weight
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      // This would require aggregation for complex sorting
      sort[query.sortBy] = query.sortOrder === 'asc' ? 1 : -1;
    } else if (query.sortBy === 'deadline') {
      sort.deadline = query.sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = query.sortOrder === 'asc' ? 1 : -1;
    }

    return this.todoModel
      .find(filter)
      .sort(sort)
      .populate('userId', 'name email')
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoModel
      .findOne({ _id: id, userId, isDeleted: false })
      .populate('userId', 'name email')
      .exec();

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<Todo> {
    const todo = await this.todoModel.findOne({
      _id: id,
      userId,
      isDeleted: false,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    // Handle status change to completed
    if (
      updateTodoDto.status === TaskStatus.COMPLETED &&
      todo.status !== TaskStatus.COMPLETED
    ) {
      updateTodoDto.completedAt = new Date();
    } else if (updateTodoDto.status === TaskStatus.PENDING) {
      updateTodoDto.completedAt = undefined;
    }

    // Convert deadline string to Date if provided
    if (updateTodoDto.deadline) {
      updateTodoDto.deadline = new Date(updateTodoDto.deadline).toISOString();
    }

    const updatedTodo = await this.todoModel
      .findOneAndUpdate({ _id: id, userId }, updateTodoDto, {
        new: true,
        runValidators: true,
      })
      .populate('userId', 'name email')
      .exec();

    if (!updatedTodo) {
      throw new NotFoundException('Todo not found after update');
    }

    return updatedTodo;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const todo = await this.todoModel.findOne({
      _id: id,
      userId,
      isDeleted: false,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    // Soft delete
    await this.todoModel.findOneAndUpdate(
      { _id: id, userId },
      { isDeleted: true },
    );

    return { message: 'Todo deleted successfully' };
  }

  // Advanced sorting with mixed algorithm
  async findAllSorted(userId: string): Promise<Todo[]> {
    const todos = await this.todoModel
      .find({ userId, isDeleted: false })
      .populate('userId', 'name email')
      .exec();

    // Custom sorting algorithm mixing deadline, priority, and creation time
    return todos.sort((a, b) => {
      // Priority weights
      const priorityWeight = { high: 3, medium: 2, low: 1 };

      // Deadline urgency (closer deadline = higher priority)
      const now = new Date();
      const aUrgency =
        (new Date(a.deadline).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24); // days
      const bUrgency =
        (new Date(b.deadline).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24);

      // Combined score (lower is better - more urgent)
      const aScore = aUrgency - priorityWeight[a.priority] * 2;
      const bScore = bUrgency - priorityWeight[b.priority] * 2;

      return aScore - bScore;
    });
  }

  async getStats(userId: string): Promise<any> {
    const stats = await this.todoModel.aggregate([
      { $match: { userId: userId, isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', TaskStatus.COMPLETED] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', TaskStatus.PENDING] }, 1, 0] },
          },
          high: {
            $sum: { $cond: [{ $eq: ['$priority', Priority.HIGH] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$priority', Priority.MEDIUM] }, 1, 0] },
          },
          low: {
            $sum: { $cond: [{ $eq: ['$priority', Priority.LOW] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$deadline', new Date()] },
                    { $eq: ['$status', TaskStatus.PENDING] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return stats.length > 0
      ? stats[0]
      : {
          total: 0,
          completed: 0,
          pending: 0,
          high: 0,
          medium: 0,
          low: 0,
          overdue: 0,
        };
  }
}
