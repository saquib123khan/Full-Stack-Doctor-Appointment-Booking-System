import mongoose from "mongoose";

const connectionToDB = async () => {
    try {
        const {connection} = await mongoose.connect(
            `${process.env.MONGO_URI}/prescripto`
        )

        
        if(connection){
            console.log(`Connected to MongoDB: ${connection.host}`);
        }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}

// const connectedToDB = async () => {
//     mongoose.connection.on('connected', () => console.log('Database Connected'))

//     await mongoose.connect( `${process.env.MONGO_URI}/prescripto`)
// } 

export default connectionToDB