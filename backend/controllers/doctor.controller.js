import doctorModel from "../models/doctor.model.js"
import AppError from "../utils/error.utils.js"

const changeAvailability = async (req, res, next) => {

    try {
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})

        res.status(200).json({
            success:true,
            message:'Availability changed'
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const doctorList = async (req, res) => {
   try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])

    res.status(200).json({
        success:true,
        doctors
    })
   } catch (error) {
       return next(new AppError(error.message, 500));
   }
}


export {
    
    changeAvailability,
    doctorList

}
