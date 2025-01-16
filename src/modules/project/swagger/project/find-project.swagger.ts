import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const FindProjectSwagger = {
  operation: ApiOperation({ summary: 'Find project by id or title' }),
  okResponse: ApiOkResponse({
    description: 'Project found successfully',
    schema: {
      example: {
        statusCode: 200,
        project: {
          id: 1,
          title: 'Project',
          image: 'https://image.com/...',
          startDate: '2025-01-02',
          endDate: '2025-03-03',
          isActive: false,
          adminId: 2,
          workspaceId: null,
          createdAt: '2025-01-01',
        },
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Error occurred to found project',
    schema: {
      example: {
        statusCode: 400,
        message: 'Could not get the resource due to unknown error',
        error: 'Bad Request',
      },
    },
  }),
  notFound: ApiNotFoundResponse({
    description: 'Project not found by either id or title',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project not found',
        error: 'Not Found',
      },
    },
  }),
};
