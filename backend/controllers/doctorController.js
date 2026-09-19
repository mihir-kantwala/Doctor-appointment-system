import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Slot from '../models/Slot.js';
import { consultationFee } from '../utils/calculateTotal.js';

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    if (!doctors) {
      res.status(404).json({
        success: false,
        message: 'no doctor avilable',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fetched all docters',
      doctors,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

const getSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const slots = await Slot.find({ doctorId: doctorId, date: date });

    if (!slots) {
      res.status(204).json({
        success: true,
        message: 'slots not avilabel on that date',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fetched all slots for the date',
      slots,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, patientName, patientEmail, patientAge } =
      req.body;

    const totalBill = await consultationFee(doctorId, slotId, patientAge);

    const bookedSlot = await Appointment.create({
      doctorId,
      slotId,
      patientName,
      patientEmail,
      patientAge,
      totalPrice: totalBill.total,
    });

    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: slotId, capacity: { $gt: 0 } },
      {
        $inc: { capacity: -1 },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSlot) {
      return res.status(400).json({
        success: false,
        message: 'Slot is fully booked',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: bookedSlot,
      capacityLeft: updatedSlot.capacity,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'server error',
      error: error.message,
    });
  }
};

// production level but need mongoDb atlas or shell re6 configuration
const booking = async (req, res) => {
  const { doctorId, slotId, patientName, patientEmail, patientAge } = req.body;

  if (!doctorId || !slotId || !patientName || !patientEmail || !patientAge) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const totalBill = await consultationFee(doctorId, slotId, patientAge);

    const slot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        doctorId: doctorId,
        capacity: { $gt: 0 },
      },
      {
        $inc: { capacity: -1 },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!slot) {
      const error = new Error('Slot is no longer available');
      error.statusCode = 409;
      throw error;
    }

    const [appointment] = await Appointment.create(
      [
        {
          doctorId,
          slotId,
          patientName,
          patientEmail,
          patientAge,
          totalPrice: totalBill.total,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
      remainingSeats: slot.capacity,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error('Booking error:', error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : 'Something went wrong while booking the appointment',
    });
  } finally {
    await session.endSession();
  }
};

export { getDoctors, getSlots, bookAppointment };
