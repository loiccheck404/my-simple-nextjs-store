export function successResponse(data, message = "Success", status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(error, status = 500) {
  return Response.json(
    {
      success: false,
      error: typeof error === "string" ? error : error.message,
    },
    { status }
  );
}

export function validationError(message, status = 400) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}
