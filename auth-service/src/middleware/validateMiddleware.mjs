export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated; // Re-assign to use the validated/transformed data
    next();
  } catch (err) {
    next(err); // Pass to global error handler
  }
};
