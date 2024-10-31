const errorMiddleware = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'something went wrong'

    res.status(200).json({
        success:false,
        message: err.message,
        stack: err.stack
    })
}

export default errorMiddleware