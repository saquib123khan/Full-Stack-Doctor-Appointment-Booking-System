import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    docId:{
        type: String,
        required:true
    },
    slotDate:{
        type: String,
        required:true
    },
    slotTime:{
        type: String,
        required:true
    },
    UserData:{
        type: Object,
        // required:true
    },
    docData:{
        type: Object,
        required:true
    },
    amount:{
        type: String,
        required:true
    },
    date:{
        type: String,
        required:true
    },
    cancelled:{
        type: Boolean,
        default: false
    },
    payment:{
        type: Boolean,
        default: false
    },
    isCompleted:{
        type: String,
        default: false
    }
})

const appointmentModel = mongoose.model('Appointment', appointmentSchema)

export default appointmentModel