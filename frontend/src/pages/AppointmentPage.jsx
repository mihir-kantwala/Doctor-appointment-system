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

  const [error, setError] = useState({});

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
    <section className="">
      <div className="flex justify-center items-center h-screen gap-5 py-15 w-full ">
        <div className="flex flex-col w-1/2 bg-[#303030] h-full p-5 gap-5 shadow-xl">
          <h1 className="text-2xl font-semibold">Book an Appointment</h1>
          <form
            onSubmit={handleSubmit}
            className="flex gap-5 items-end bg-[#414141] p-5 shadow-xl"
          >
            <div className="grow-3 flex flex-col">
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
                    {doctor.name} - {doctor.specialization} -{' '}
                    {doctor.consultationFee}
                  </option>
                ))}
              </select>
            </div>
            <div className="grow-3 flex flex-col">
              <label>Select a Date :</label>
              <input
                type="date"
                name="date"
                value={doctorForm.date}
                onChange={handleChange}
                min={minDate}
                max={maxDate}
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>

            <button
              className="bg-[#0049e7] h-11 px-5  font-semibold rounded-lg cursor-pointer shadow-xl"
              type="submit"
            >
              Get Slots
            </button>
          </form>

          {slots.length > 0 && (
            <div className="flex flex-col  bg-[#414141] p-5 shadow-xl">
              <h1 className="mb-2 text-md font-semibold">Select Time :</h1>
              <div className="flex  gap-5 items-end">
                {slots.map((slot) => {
                  const isSelected = appointmentForm.slotId === slot._id;

                  return (
                    <button
                      className={`p-2 w-full rounded-lg cursor-pointer shadow-xl  disabled:bg-[#5a5a5a] disabled:text-[#afafaf] ${
                        isSelected
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : 'bg-[#202020]'
                      }`}
                      disabled={slot.capacity === 0}
                      key={slot._id}
                      onClick={() => {
                        setDetilsForm(true);
                        setAppointmentForm((prev) => ({
                          ...prev,
                          slotId: slot._id,
                        }));
                      }}
                    >
                      <p className="font-semibold">{slot.time}</p>

                      <span className="text-xs ">
                        Avilabel : {slot.capacity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {detilsForm && (
            <form
              // onSubmit={handleAppointmentSubmit}
              className=" flex flex-col w-full items-end gap-5  bg-[#414141] p-5 shadow-xl"
            >
              <div className=" flex gap-5 w-full">
                <div className="flex flex-col w-1/2 ">
                  <label>Patient Name :</label>
                  <input
                    type="text"
                    name="patientName"
                    value={appointmentForm.patientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label>Patient Email :</label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={appointmentForm.patientEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col w-1/8">
                  <label>Age :</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={appointmentForm.patientAge}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center w-full">
                <p className="bg-[#cacaca] text-[#202020]  font-bold rounded-lg py-2 px-5">
                  error :
                </p>

                <div>
                  <button
                    className="bg-[#cacaca] text-[#202020]  font-semibold rounded-lg py-2 px-5 cursor-pointer shadow-xl"
                    type="button"
                    onClick={hanldeResetForm}
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="flex flex-col w-1/4 bg-[#303030] h-full gap-2 p-5 shadow-xl">
          <h2 className=" p-2 text-xl">Billing Details</h2>
          <hr className="text-[#747474]" />

          <div className="grid grid-cols-2 gap-2 px-2">
            <h1 className="font-semibold">Name:</h1>
            <h1>{appointmentForm?.patientName}</h1>

            <h1 className="font-semibold">Email:</h1>
            <h1>{appointmentForm?.patientEmail}</h1>

            <h1 className="font-semibold">Age:</h1>
            <h1>{appointmentForm?.patientAge}</h1>

            <h1 className="font-semibold">Doctor Name:</h1>
            <h1>{selectedDoctor?.name}</h1>

            <h1 className="font-semibold">Date:</h1>
            <h1>{doctorForm?.date}</h1>

            <h1 className="font-semibold">Time:</h1>
            <h1>{selectedSlot?.time}</h1>
          </div>

          <hr className="text-[#747474]" />

          <div className="px-2">
            <p className="flex justify-between">
              <span>Consultation Fee : </span>
              <span className="text-left">
                ₹ {billingDetails.consultationFee || 0}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Discount : </span>
              <span className="text-left">
                ₹ {billingDetails.discount || 0}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Weeked Charge : </span>
              <span className="text-left">
                ₹ {billingDetails.sucharege || 0}
              </span>
            </p>
          </div>

          <hr className="text-[#747474]" />

          <h3 className="text-lg font-semibold flex justify-between px-2">
            <span>Total : </span>
            <span className="text-left">{billingDetails.total || 0} ₹</span>
          </h3>

          <button
            className="bg-[#0049e7] py-2 px-5  font-semibold rounded-lg w-full cursor-pointer shadow-xl"
            type="submit"
            onClick={handleAppointmentSubmit}
          >
            Book Appoinment
          </button>

          <div className="pl-7 text-sm ">
            <ul>
              <li>20% discount on Age below 12.</li>
              <li>extra charge of 10% on Weekend. </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
