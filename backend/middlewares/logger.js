export const logger = (req, res, next) => {
  const date = new Date();
  console.log(
    `${req.method} - ${req.originalUrl} - ${req.statusCode} - ${date.toLocaleDateString()} - ${date.toLocaleTimeString()} `,
  );
  next();
};
