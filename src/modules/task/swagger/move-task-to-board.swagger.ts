import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const MoveTaskToBoardSwagger = {
  operation: ApiOperation({ summary: 'Move task' }),
  okResponse: ApiOkResponse({
    description: 'Task with new order in the board',
    schema: {
      example: {
        statusCode: 200,
        description: 'Task with new order in the board',
        boardId: '4',
        id: '1',
        title: 'somenthing',
        endDate: '2025-11-11',
        order: 4,
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Operation failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Operation failed',
        error: 'Bad Request',
      },
    },
  }),
};
