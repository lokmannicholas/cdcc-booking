import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { createOptionsResponse, isOptionsRequest, jsonResponse } from '../lib/http';

export async function healthHandler(
  request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  if (isOptionsRequest(request)) {
    return createOptionsResponse();
  }

  return jsonResponse(200, {
    status: 'ok',
    service: 'quality-healthcare-booking-server',
    platform: 'azure-functions'
  });
}

app.http('health', {
  route: 'health',
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: healthHandler
});
