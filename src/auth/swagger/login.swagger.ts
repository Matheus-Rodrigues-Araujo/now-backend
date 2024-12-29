import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const LoginSwagger = {
  operation: ApiOperation({
    summary: 'Authenticate user and return access token',
  }),
  okResponse: ApiOkResponse({
    description: 'Login successfull',
    schema: {
      example: {
        access_token: 'ey3r7878wefdhwed78fhwehdfwfiamthetoken....',
      },
    },
  }),
  badRequest: ApiBadRequestResponse({
    description: 'Login failed due to invalid data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Could not sign in',
        error: 'Bad Request',
      },
    },
  }),
  unauthorized: ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  }),
};
