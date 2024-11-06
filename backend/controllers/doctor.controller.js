import appointmentModel from "../models/appointment.model.js";
import doctorModel from "../models/doctor.model.js"
import AppError from "../utils/error.utils.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

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

//
const loginDoctor = async(req, res, next) => {
    try {
     
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return next(new AppError('Doctor does not exists', 404));
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
            res.status(200).json({
                success:true,
                token
            })
        }else{
            return next(new AppError('Password does not match', 404))
        }
        
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async(req, res, next) => {
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})

        return res.json({
            success:true,
            appointments
        })

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API to mark appointment complete for doctor panel
const appointmentComplete = async (req, res, next) => {
    try {
        const {docId, appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})
            res.status(200).json({
                success:true,
                message:'Appointment Completed'
            })
        }else{
            return res.json({success: false, message:'Mark Failed'})
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// APi to cancel appointment for doctor panel.
const appointmentCancel = async (req, res, next) => {
    try {
        const {docId, appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
            res.status(200).json({
                success:true,
                message:'Appointment Cancelled'
            })
        }else{
            return res.json({success: false, message:'Cancelation Failed'})
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel
}
