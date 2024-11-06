import jwt from 'jsonwebtoken'
import AppError from '../utils/error.utils.js'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
   try {
    const {dtoken} = req.headers
    if(!dtoken){
        return res.status(401).json({
            success:false,
            message:'Not authorized login again'
        })
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)

    req.body.docId = token_decode.id

    next()
    
   } catch (error) {
    return next(new AppError(error.message, 500))
   }
    
}

export default authDoctor