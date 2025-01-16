import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const UpdateTaskSwagger = {
  operation: ApiOperation({ summary: 'Update task' }),
  okResponse: ApiOkResponse({
    description: 'Project updated successfully',
    schema: {
      example: {
        statusCode: 201,
        description: 'Do something updated',
        status: 'pending',
        boardId: '3',
        id: '1',
        title: 'something updated',
        endDate: '2025-11-11',
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Task not updated',
    schema: {
      example: {
        statusCode: 400,
        message: 'Task not updated',
        error: 'Bad Request',
      },
    },
  }),
};
