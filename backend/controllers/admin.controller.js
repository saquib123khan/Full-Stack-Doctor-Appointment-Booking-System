import validator from 'validator';
import AppError from "../utils/error.utils.js";
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctor.model.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointment.model.js'
import userModel from '../models/user.model.js';

// API for adding doctor
const addDoctor = async (req, res, next) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file; // Assuming multer is handling the file upload

        // Check for all required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return next(new AppError('All fields are required', 400));
            
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return next(new AppError('Please enter a valid email', 400));
        }

        // Hash the doctor password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Ensure an image file is provided
        if (!imageFile) {
            return next(new AppError('Please upload an image', 400));
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: typeof address === "string" ? JSON.parse(address) : address,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(200).json({
            success: true,
            message: 'Doctor added successfully',
            newDoctor // Optional, to return the created doctor object
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


// API for admin login
const loginAdmin = async (req, res, next) => {
    try {
         
        const {email, password} = req.body
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)

            res.status(200).json({
                success:true,
                token
            })
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API to get all doctors list from admin panel
const allDoctors = async (req, res) => {
    
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.status(200).json({
            success: true,
            message: 'Doctors fetched successfully',
            doctors
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

}

// API to get all appointments
const appointmentsAdmin = async(req, res, next) => {
    try {

      const appointments = await appointmentModel.find({})
      res.status(200).json({
        success:true,
        appointments
      })
        
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async(req, res, next) => {
    try {

        const doctors = await doctorModel.find({})
        const appointments = await appointmentModel.find({})
        const users = await userModel.find({})

        const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        users: users.length,
        latestAppointments: appointments.reverse().slice(0,5)
        }

        res.status(200).json({
            success:true,
            dashData
        })
        
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API for appointment cancelation
const appointmentCancel = async (req, res, next) => {
    try {
      const {appointmentId} = req.body
  
      const appointmentData = await appointmentModel.findById(appointmentId)
  
  
      await appointmentModel.findByIdAndUpdate(appointmentData, {cancelled: true})
  
      // releasing doctor slot
      const {docId, slotDate, slotTime} = appointmentData
  
      const doctorData = await doctorModel.findById(docId)
  
      let slots_booked = doctorData.slots_booked
  
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
  
      await doctorModel.findByIdAndUpdate(docId, {slots_booked})
  
      res.status(200).json({
          success:true,
          message:'Appointment Cancelled'
      })
  
  
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }
  


export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    adminDashboard,
    appointmentCancel
}