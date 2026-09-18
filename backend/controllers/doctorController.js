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

    console.log(doctorId, slotId, patientName, patientEmail, patientAge);

    const totalBill = await consultationFee(doctorId, slotId, patientAge);

    const bookedSlot = await Appointment.create({
      doctorId,
      slotId,
      patientName,
      patientEmail,
      patientAge,
      totalPrice: totalBill.total,
    });

    res.status(200).json({
      success: true,
      message: 'appointment slot booked',
      bookedSlot,
      totalBill,
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

export { getDoctors, getSlots, bookAppointment };
