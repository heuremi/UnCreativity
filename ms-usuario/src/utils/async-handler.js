export const asyncHandler = (fn) => (request, response, next) => {
    return Promise.resolve(fn(request, response, next)).catch((error) => {
      console.log(error);
      response.status(500).send("ERROR-DEL SERVIDOR")
    });
  };

  