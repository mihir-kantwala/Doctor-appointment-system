import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Docter-Appointment-system',
    });
    console.log('mongoDB is connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connect;
