import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import Slot from '../models/Slot.js';
dotenv.config({
  path: '../.env',
});

const doctors = [
  {
    name: 'Dr.pankaj kumar',
    specialization: 'eye-specialist',
    consultationFee: 500,
  },
  {
    name: 'Dr.sagar kumar',
    specialization: 'motivation-specialist',
    consultationFee: 1000,
  },
  {
    name: 'Dr.kunal kumar',
    specialization: 'dentist-specialist',
    consultationFee: 700,
  },
  {
    name: 'Dr.aditi ben',
    specialization: 'brain-specialist',
    consultationFee: 2000,
  },
  {
    name: 'Dr.mihir bhai',
    specialization: 'ill-specialist',
    consultationFee: 200,
  },
];

const slots = [
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '8:00 PM',
];

const seedSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Docter-Appointment-system',
    });
    console.log('mongoDB is connected');

    for (const doctorData of doctors) {
      console.log(doctorData.name);

      const doctor = await Doctor.findOneAndUpdate(
        { name: doctorData.name },
        {
          name: doctorData.name,
          specialization: doctorData.specialization,
          consultationFee: doctorData.consultationFee,
        },
        {
          runValidators: true,
          upsert: true,
          new: true,
        },
      );
      doctorData._id = doctor._id;
    }
    console.log(doctors);

    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = currentDate.toISOString().split('T')[0];

      for (const doctorDate of doctors) {
        for (const slotData of slots) {
          await Slot.findOneAndUpdate(
            {
              doctorId: doctorDate._id,
              date: date,
              time: slotData,
            },
            {
              doctorId: doctorDate._id,
              date: date,
              time: slotData,
              capacity: 10,
            },
            {
              new: true,
              runValidators: true,
              upsert: true,
            },
          );
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('date fetched in db');

    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedSlots();
