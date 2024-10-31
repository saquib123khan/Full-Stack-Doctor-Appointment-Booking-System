import jwt from 'jsonwebtoken'
import AppError from '../utils/error.utils.js'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
   try {
    const {atoken} = req.headers
    if(!atoken){
        return res.status(401).json({
            success:false,
            message:'Not authorized login again'
        })
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

    if(token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
        return res.status(401).json({
            success:false,
            message:'Not authorized login again'
        }) 
    }

    next()
    
   } catch (error) {
    return next(new AppError(error.message, 500))
   }
    
}

export default authAdmin