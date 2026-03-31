import type {
  FastifyInstance,
  InjectOptions,
  LightMyRequestResponse,
} from 'fastify';

function assertJson(response: LightMyRequestResponse): void {
  const contentType = response.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    throw new Error('Expected JSON response');
  }
}

export class E2EClient {
  constructor(private readonly fastify: FastifyInstance) {}

  async request(options: InjectOptions) {
    const response = await this.fastify.inject(options);

    return {
      statusCode: response.statusCode,
      headers: response.headers,
      payload: response.payload,
      json: () => response.json(),
    };
  }

  async requestGraphQL<T = unknown>(
    query: string,
    variables?: Record<string, unknown>,
    headers?: Record<string, string>,
  ) {
    const response = await this.fastify.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query,
        variables,
      },
      headers: {
        'content-type': 'application/json',
        ...(headers ?? {}),
      },
    });

    assertJson(response);
    const body = response.json();

    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: body.data as T | undefined,
      errors: body.errors,
    };
  }
}
