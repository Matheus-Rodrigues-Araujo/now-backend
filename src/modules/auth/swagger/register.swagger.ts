import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const RegisterSwagger = {
  operation: ApiOperation({ summary: 'Register new user' }),
  okResponse: ApiOkResponse({
    description: 'User created successfully',
    schema: {
      examples: [
        {
          statusCode: 201,
          user: {
            id: 2,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@gmail.com',
            hash: 'fduidasf23f43f34...',
            phone: '+12 (34) 56789-1011',
            createdAt: '2023-06-14T10:24:35',
          },
        },
      ],
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Registration failed due to invalid data',
    schema: {
      example: {
        statusCode: 400,
        message: 'User not registered',
        error: 'Bad Request',
      },
    },
  }),
  unauthorized: ApiUnauthorizedResponse({
    description: 'A user account with the provided email already exists',
    schema: {
      example: {
        statusCode: 401,
        message:
          'A user account with the provided email or username already exists.',
        error: 'Unauthorized',
      },
    },
  }),
};
