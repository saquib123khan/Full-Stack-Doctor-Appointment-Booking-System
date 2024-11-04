import express from 'express'
import { addDoctor, adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.middleware.js'
import authAdmin from '../middlewares/authAdmin.middleware.js'
import { changeAvailability } from '../controllers/doctor.controller.js'


const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)


export default adminRouter