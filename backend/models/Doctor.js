import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: 'Doctor_Name',
  },
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
