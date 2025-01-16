import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const FindMembersSwagger = {
  operation: ApiOperation({ summary: 'Find project members' }),
  okResponse: ApiOkResponse({
    description: 'Project members found successfully',
    schema: {
      example: {
        statusCode: 200,
        members: [
          {
            id: 3,
            image: 'https//....',
            isActive: true,
            createdAt: '2022-01-03 10:00:00T',
            email: 'john@gmail.com',
            firstName: 'John',
            lastName: null,
            phone: null,
            hash: 'sdff342f34ferferf...',
          },
          {
            id: 5,
            image: null,
            isActive: false,
            createdAt: '2022-01-03 10:00:00T',
            email: 'doe@gmail.com',
            firstName: 'Doe',
            lastName: 'John',
            phone: '1188912345678',
            hash: 'eyasfsjdf4u4jufufn4uufn...',
          },
        ],
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Error occurred to found members',
    schema: {
      example: {
        statusCode: 400,
        message: 'Could not get the resource due to unknown error',
        error: 'Bad Request',
      },
    },
  }),
  notFound: ApiNotFoundResponse({
    description: 'Project has no members',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project has no members',
        error: 'Not Found',
      },
    },
  }),
};
