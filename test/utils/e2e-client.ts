import type {
  FastifyInstance,
  InjectOptions,
  LightMyRequestResponse,
} from 'fastify';
import FormData from 'form-data';
import type { Profile } from '@/@generated/prisma/client';

function assertJson(response: LightMyRequestResponse): void {
  const contentType = response.headers['content-type'];
  if (!contentType?.includes('application/json')) {
    throw new Error('Expected JSON response');
  }
}

export class E2EClient {
  private defaultHeaders: Record<string, string> = {};

  constructor(private readonly fastify: FastifyInstance) {}

  // Sets the user context for all subsequent requests. Use with factory profiles for RBAC testing.
  loginAs(user: Profile) {
    this.defaultHeaders['x-mock-sub'] = user.oidcSub;
    return this;
  }

  logout() {
    delete this.defaultHeaders['x-mock-sub'];
    return this;
  }

  async request(options: InjectOptions) {
    const response = await this.fastify.inject({
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

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
        ...this.defaultHeaders,
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

  // Uploads a file via multipart/form-data, hiding boundary construction from tests.
  async uploadFile(
    url: string,
    filename: string,
    fileBuffer: Buffer,
    mimetype: string,
  ) {
    const form = new FormData();
    form.append('file', fileBuffer, { filename, contentType: mimetype });

    const response = await this.fastify.inject({
      method: 'POST',
      url,
      headers: {
        ...this.defaultHeaders,
        ...form.getHeaders(),
      },
      payload: form.getBuffer(),
    });

    return {
      statusCode: response.statusCode,
      json: () => response.json(),
    };
  }
}
