export function notFound(req, res, next) {
    res.statusCode = 404;
    const error = new Error("Look like you're lost...");

    next(error);
}

export function errorHandler(err, req, res) {
    res.statusCode = res.statusCode || 500;
    res.json({ message: err.message ? `${err}` : 'An unexpected error occurred' });
}
