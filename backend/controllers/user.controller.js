import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import AppError from '../utils/error.utils.js';
import doctorModel from '../models/doctor.model.js'
import userModel from '../models/user.model.js'
import appointmentModel from '../models/appointment.model.js'
import {v2 as cloudinary} from 'cloudinary'
import Razorpay from 'razorpay'
const registerUser = async(req, res, next) => {

    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return next(new AppError('All fields are required', 400));
        }

        // validate email format
        if(!validator.isEmail(email)){
            return next(new AppError('Enter a valid email', 400));
        }
        
        // validating strong password
        if(password.length < 8){
            return next(new AppError('Enter a strong password', 400));
        }

         // Hash the doctor password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name,
            email,
            password : hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET)

        res.status(200).json({
            success:true,
            message: 'User registered successfully', 
            token
        })

    } catch (error) {
         return next(new AppError(error.message, 500));
    }
}

// API for login user
const loginUser = async (req, res, next) => {
   
    try {
        const {email, password} = req.body

        if(!email || !password){
            return next(new AppError('All fields are required', 400));
        }

        const user = await userModel.findOne({email})

        if(!user){
            return next(new AppError('User does not exists', 400));
        }

        const isMatched = await bcrypt.compare(password,user.password)

        if(isMatched){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({
                success:true,
                token
            })
        }else{
            return next(new AppError('Password does not match', 400));
        }

} catch (error) {
         return next(new AppError(error.message, 500));
    }
}

// API to get user profile data
const getProfile = async (req, res, next) => {
    try {

        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.status(200).json({
            success:true,
            userData
        })
        
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API to update profile
const updateProfile = async (req, res, next) => {
   try {

    const {userId, name, phone, address, dob, gender} = req.body
    const imageFile = req.file

    if(!name || !phone || !address || !gender){
        return next(new AppError('All fileds are required', 400));
    }
    
    await userModel.findByIdAndUpdate(userId, {name,phone,address:JSON.parse(address), dob, gender})

    if(imageFile){
        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
        const imageUrl = imageUpload.secure_url

        await userModel.findByIdAndUpdate(userId, {image:imageUrl})
    }

    res.status(200).json({
        success:true,
        message:'Update profile successfully'
    })

   } catch (error) {
    return next(new AppError(error.message, 500));
   }
}

const bookAppointment = async (req, res, next) => {
   try {

    const {userId, docId, slotDate, slotTime} = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if(!docData.available){
        return next(new AppError('Doctor not available', 406))
    }

    let slots_booked = docData.slots_booked

    // checking for slot availability
    if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
            return next(new AppError('slot not available', 406))
        }else{
            slots_booked[slotDate].push(slotTime)
        }
    }else{
        slots_booked[slotDate] = []
        slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        slotDate,
        slotTime,
        amount: docData.fees,
        date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.status(200).json({
        success:true,
        message:'Appointment booked successfully'
    })

   } catch (error) {
    return next(new AppError(error.message, 500));
   }
}

// API to get user appointment for frontend my-appointments page
const listAppointment = async (req, res, next) => {
    try {
        
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.status(200).json({
            success:true,
            appointments
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const {userId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointment user
    if(appointmentData.userId !== userId){
        return next(new AppError('Unauthorized action', 500));
    }

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


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
// console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
// console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);


// API to make payment of appointment using razorpay
const paymentRazorpay = async(req, res, next) => {
    try {

       const {appointmentId} = req.body
       const appointmentData = await appointmentModel.findById(appointmentId)
       
       if(!appointmentData || appointmentData.cancelled){
        return next(new AppError('Appointment camcelled or not found', 400));
       }

       // Creating options for razorpay payment
       const options = {
        amount: appointmentData.amount * 100,
        currency: process.env.CURRENCY,
        receipt:appointmentId
       } 
        
       // Creation of an order
       const order = await razorpayInstance.orders.create(options);

       res.status(200).json({
        success:true,
        order
       })


    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const verifyRazorpay = async (req, res, next) => {
    try {

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
            res.status(200).json({success:true, message: 'Payment Successful'})
        }else{
            res.status(400).json({success:false, message: 'Payment failed'})
        }
        
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay
}