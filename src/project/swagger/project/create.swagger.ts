import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const CreateProjectSwagger = {
  operation: ApiOperation({ summary: 'Create new project' }),
  okResponse: ApiOkResponse({
    description: 'Project created successfully',
    schema: {
      example: {
        statusCode: 201,
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
    description: 'Creation of new project failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Could not create new project',
        error: 'Bad Request',
      },
    },
  }),
};
