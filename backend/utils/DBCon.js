import mongoose from "mongoose";

function DBConn(){
    if (!process.env.DBURI) {
        console.error('❌ DBURI is not defined in environment variables');
        return;
    }
    
    console.log('Attempting to connect to MongoDB...');
    mongoose.connect(process.env.DBURI).then(()=>{
        console.log(`✅ Database connected successfully`)
    }).catch((error)=>{
        console.error(`❌ Error in connection of Database:`, error.message)
    })
}

export default DBConn;