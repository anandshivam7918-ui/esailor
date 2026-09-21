import { NextResponse } from 'next/server';
import {
  validateQuoteRequest,
  persistQuoteRequest,
  sendQuoteNotification,
} from '@/lib/quote-request';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validation & Spam Check
    const validation = validateQuoteRequest(body);

    // If bot caught by honeypot, return silent mock success (zero friction, wastes bot resources)
    if (validation.isSpam) {
      return NextResponse.json({
        success: true,
        message: 'Your enquiry has been received.',
        quoteRefId: 'QR-VERIFIED',
      });
    }

    if (!validation.isValid || !validation.sanitizedData) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
          message: 'Please resolve the validation errors before submitting.',
        },
        { status: 400 }
      );
    }

    const data = validation.sanitizedData;

    // 2. Persist to CMS (with resilient storage fallback)
    const persistence = await persistQuoteRequest(data);

    // 3. Dispatch Email Notification to Sales Inbox
    const emailResult = await sendQuoteNotification(data, persistence.id);

    return NextResponse.json({
      success: true,
      quoteRefId: persistence.id,
      persistedTo: persistence.persistedTo,
      emailDispatched: emailResult.success,
      message: 'Thank you! Your quote request has been received. Our sales desk will respond within 24 hours.',
    });
  } catch (error: unknown) {
    console.error('API Error in /api/quote-request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected server error occurred. Your entered data has been preserved. Please retry.',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
