import { useEffect } from 'react';
import { useState } from 'react';
import { bookSlot, getDoctors, getSlots } from '../Apis/doctorApis';
import { calculateTotal } from '../utils/calculatetotal';

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState([]);
  const [doctorForm, setDoctorForm] = useState({
    doctorId: '',
    date: '',
  });
  const [slots, setSlots] = useState([]);

  const [detilsForm, setDetilsForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    slotId: '',
    patientName: '',
    patientEmail: '',
    patientAge: '',
  });

  const today = new Date();

  const minDate = today.toISOString().split('T')[0];

  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    const fetchDoctors = async () => {
      const result = await getDoctors();
      setDoctors(result.doctors);
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'doctorId') {
      setDoctorForm({
        doctorId: value,
        date: '',
      });
      setSlots([]);
      setAppointmentForm((prev) => ({
        ...prev,
        doctorId: value,
        slotId: '',
      }));
      setDetilsForm(false);
    }

    if (name === 'date') {
      setDoctorForm((prev) => ({
        ...prev,
        date: value,
      }));
      setSlots([]);
      setAppointmentForm((prev) => ({
        ...prev,
        slotId: '',
      }));
      setDetilsForm(false);
    }

    if (
      name === 'patientName' ||
      name === 'patientEmail' ||
      name === 'patientAge'
    ) {
      setAppointmentForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // if (name === 'doctorId' || name === 'date') {
    //   setDoctorForm((prev) => ({
    //     ...prev,
    //     [name]: value,
    //   }));
    //   if (name === 'doctorId')
    //     setAppointmentForm((prev) => ({
    //       ...prev,
    //       [name]: value,
    //     }));
    // }

    // if (
    //   name === 'patientName' ||
    //   name === 'patientEmail' ||
    //   name === 'patientAge'
    // ) {
    //   setAppointmentForm((prev) => ({
    //     ...prev,
    //     [name]: value,
    //   }));
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await getSlots(doctorForm);
      setSlots(res.slots);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    console.log(appointmentForm);

    try {
      const res = await bookSlot(appointmentForm);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedDoctor = doctors.find(
    (doctor) => doctor._id === appointmentForm.doctorId,
  );

  const selectedSlot = slots.find(
    (slot) => slot._id === appointmentForm.slotId,
  );

  let billingDetails = {};
  if (selectedDoctor && selectedSlot && appointmentForm.patientAge) {
    billingDetails = calculateTotal(
      selectedDoctor,
      selectedSlot,
      Number(appointmentForm.patientAge),
    );
  }

  const hanldeResetForm = () => {
    setDoctorForm({
      doctorId: '',
      date: '',
    });
    setSlots([]);
    setDetilsForm(false);
    setAppointmentForm({
      doctorId: '',
      slotId: '',
      patientName: '',
      patientEmail: '',
      patientAge: '',
    });
  };

  return (
    <section>
      <h1>Appointment Page</h1>
      <form onSubmit={handleSubmit}>
        <label>Select A Doctor : </label>
        <select
          name="doctorId"
          value={doctorForm.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">Select a Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} - {doctor.specialization} - {doctor.consultationFee}
            </option>
          ))}
        </select>

        <label>Select a Date :</label>
        <input
          type="date"
          name="date"
          value={doctorForm.date}
          onChange={handleChange}
          min={minDate}
          max={maxDate}
          required
        />

        <button type="submit">Get Slots</button>
      </form>

      <div>
        {slots &&
          slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => {
                setDetilsForm(true);
                setAppointmentForm((prev) => ({
                  ...prev,
                  slotId: slot._id,
                }));
              }}
            >
              <p>
                {slot.time} / {slot.capacity}
              </p>
            </button>
          ))}
      </div>

      <div>
        {detilsForm && (
          <form onSubmit={handleAppointmentSubmit}>
            <h3>Booking form : </h3>
            <label>Patient Name :</label>

            <input
              type="text"
              name="patientName"
              value={appointmentForm.patientName}
              onChange={handleChange}
              required
            />

            <label>Patient Email :</label>

            <input
              type="email"
              name="patientEmail"
              value={appointmentForm.patientEmail}
              onChange={handleChange}
              required
            />

            <label>Age :</label>
            <input
              type="number"
              name="patientAge"
              value={appointmentForm.patientAge}
              onChange={handleChange}
              required
            />

            <div>
              <h2>Billing Details</h2>
              <p>Consultation Fee: ₹{billingDetails.consultationFee || 0}</p>
              <p>Discount : ₹{billingDetails.discount || 0}</p>
              <p>Weeked Charge: ₹{billingDetails.sucharege || 0}</p>

              <hr />
              <h3>Total: ₹{billingDetails.total || 0}</h3>
            </div>

            <button type="button" onClick={hanldeResetForm}>
              Reset Form
            </button>
            <button type="submit">Book Appoinment</button>
          </form>
        )}
      </div>
    </section>
  );
}
