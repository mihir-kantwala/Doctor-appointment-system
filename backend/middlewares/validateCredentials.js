import Doctor from '../models/Doctor.js';
import Slot from '../models/Slot.js';

export const validateCredentionls = async (req, res, next) => {
  const { doctorId, slotId, patientName, patientEmail, patientAge } = req.body;

  if (
    !doctorId ||
    !slotId ||
    !patientName ||
    !patientEmail ||
    patientAge === undefined ||
    patientAge === null ||
    patientAge === ''
  ) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const doctorExist = await Doctor.findById(doctorId);

  if (!doctorExist) {
    return res.status(400).json({
      success: false,
      message: 'Doctor not exist',
    });
  }

  const slotExist = await Slot.findById(slotId);

  if (!slotExist) {
    return res.status(400).json({
      success: false,
      message: 'slot not exist',
    });
  }

  if (slotExist.capacity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Slot is fully booked',
    });
  }

  const nameRegex = /^[a-zA-Z ]{2,30}$/;

  if (!nameRegex.test(patientName)) {
    return res.status(400).json({
      success: false,
      message: 'Patient Name is not valid',
    });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(patientEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Patient Email is not valid',
    });
  }

  // if (
  //   patientAge === '' ||
  //   !isNaN(Number(patientAge)) ||
  //   patientAge < 0 ||
  //   patientAge > 120
  // ) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Patient Age is not valid',
  //   });
  // }
  next();
};
