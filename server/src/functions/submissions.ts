import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { createSubmission, listSubmissions } from '../lib/database';
import { createOptionsResponse, isOptionsRequest, jsonResponse } from '../lib/http';
import { validateSubmission } from '../lib/validation';

export async function submissionsHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  if (isOptionsRequest(request)) {
    return createOptionsResponse();
  }

  try {
    if (request.method === 'GET') {
      const submissions = await listSubmissions();
      return jsonResponse(200, submissions);
    }

    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      const { errors, value } = validateSubmission(body);

      if (errors.length > 0) {
        return jsonResponse(400, {
          message: 'Validation failed',
          errors
        });
      }

      const record = await createSubmission(value);

      return jsonResponse(201, {
        message: 'Submission received',
        id: record.id,
        referenceNo: record.referenceNo,
        createdAt: record.createdAt
      });
    }

    return jsonResponse(405, {
      message: 'Method not allowed'
    });
  } catch (error) {
    context.error('Submission handler failed', error);

    return jsonResponse(500, {
      message: 'Internal server error'
    });
  }
}

app.http('submissions', {
  route: 'submissions',
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: submissionsHandler
});
