export const calculateTotal = (doctor, date, patientAge) => {
  if (!doctor) {
    return {
      consultationFee: 0,
      discount: 0,
      sucharege: 0,
      total: 0,
    };
  }

  const consultationFee = doctor.consultationFee;
  let discount = 0;
  let sucharege = 0;

  if (patientAge < 12) {
    discount = consultationFee * 0.2;
  }

  const day = new Date(date.date).getDay();

  if (day === 6 || day === 0) {
    sucharege = calculateTotal * 0.1;
  }

  const total = consultationFee - discount + sucharege;

  return {
    consultationFee,
    discount,
    sucharege,
    total,
  };
};
