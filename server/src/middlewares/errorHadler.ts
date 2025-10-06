interface ApiError {
  statusCode: number;
  message: string;
  details?: unknown;
}

export const errorHandler = (error: unknown): ApiError => {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const err = error as {
      statusCode?: number;
      message?: string;
      details?: unknown;
    };
    return {
      statusCode: err.statusCode ?? 500,
      message: err.message ?? 'Internal server error',
      details: err.details,
    };
  }

  if (error instanceof Error && 'details' in error) {
    return {
      statusCode: 400,
      message: 'Validation error',
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return { statusCode: 500, message: error.message };
  }

  return { statusCode: 500, message: 'Unknown error' };
};
