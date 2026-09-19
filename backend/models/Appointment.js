import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Docter',
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    patientAge: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: 'Doctor_appointment',
  },
);

appointmentSchema.index(
  {
    slotId: 1,
    patientEmail: 1,
  },
  {
    unique: true,
  },
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
