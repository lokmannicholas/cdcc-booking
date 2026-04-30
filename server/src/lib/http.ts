import { type HttpRequest, type HttpResponseInit } from '@azure/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export function isOptionsRequest(request: HttpRequest): boolean {
  return request.method.toUpperCase() === 'OPTIONS';
}

export function createOptionsResponse(): HttpResponseInit {
  return {
    status: 204,
    headers: corsHeaders
  };
}

export function jsonResponse(status: number, body: unknown): HttpResponseInit {
  return {
    status,
    jsonBody: body,
    headers: corsHeaders
  };
}
