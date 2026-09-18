import Doctor from '../models/Doctor.js';
import Slot from '../models/Slot.js';

export const consultationFee = async (doctorId, slotId, age) => {
  const doctor = await Doctor.findById(doctorId);
  const slot = await Slot.findById(slotId);

  let total = doctor.consultationFee;
  let discount = 0;
  let surcharge = 0;

  if (age < 12) {
    discount = total * 0.2;
    total -= discount;
  }

  const day = new Date(slot.date).getDay();

  if (isNaN(day)) {
    throw new Error(`Invalid slot date: ${slot.date}`);
  }

  if (day === 6 || day === 0) {
    surcharge = total * 0.1;
    total += surcharge;
  }

  console.log('Total:', total);
  console.log('Discount:', discount);
  console.log('Surcharge:', surcharge);
  return {
    total,
    discount,
    surcharge,
  };
};
