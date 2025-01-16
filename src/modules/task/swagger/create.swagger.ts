import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const CreateTaskSwagger = {
  operation: ApiOperation({ summary: 'Create new task' }),
  okResponse: ApiOkResponse({
    description: 'Project created successfully',
    schema: {
      example: {
        statusCode: 201,
        description: 'Do something',
        status: 'pending',
        boardId: '3',
        id: '1',
        title: 'somenthing',
        endDate: '2025-11-11',
        order: 0,
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Creation of new task failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Could not create new task',
        error: 'Bad Request',
      },
    },
  }),
};
