
const defaultError = (err , req , res , next) =>{
    err.message = err.message || 'Internal Server Error'
    err.status = err.status || 500

    return res.status(err.status).json({
        success : false,
        message : err.message
    })
}

const TryCatch = (passedFunc) => async (req,res,next)=>{
    try {
        passedFunc(req,res,next)
    }catch (error) {
        next(error)   
    }
}

export {defaultError, TryCatch}