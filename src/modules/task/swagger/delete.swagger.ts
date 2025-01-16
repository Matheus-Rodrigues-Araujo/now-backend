import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const DeleteTaskSwagger = {
  operation: ApiOperation({ summary: 'Delete task' }),
  okResponse: ApiOkResponse({
    description: 'Task deleted successfully',
    schema: {
      example: {
        statusCode: 204,
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Task not deleted',
    schema: {
      example: {
        statusCode: 400,
        message: 'Task not deleted',
        error: 'Bad Request',
      },
    },
  }),
  notFound: ApiNotFoundResponse({
    description: 'Task not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Task not found in this board',
        error: 'Bad Request',
      },
    },
  }),
};
