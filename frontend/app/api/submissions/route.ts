import { NextResponse } from 'next/server';

const DEFAULT_API_BASE_URL = 'http://localhost:4000';

export async function POST(request: Request) {
  const apiBaseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
  const subscriptionKey = process.env.SUBSCRIPTION_KEY;

  try {
    const body = await request.text();
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json'
    };

    if (subscriptionKey) {
      headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
    }

    const response = await fetch(`${apiBaseUrl}/api/submissions`, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store'
    });

    const responseText = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': contentType
      }
    });
  } catch (error) {
    console.error('Failed to proxy submission request', error);

    return NextResponse.json(
      {
        message: 'Failed to submit booking request'
      },
      {
        status: 502
      }
    );
  }
}
