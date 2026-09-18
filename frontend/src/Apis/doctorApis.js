const API_URL = 'http://localhost:5000/api';

export const getDoctors = async () => {
  try {
    const res = await fetch(`${API_URL}/doctors`, {
      method: 'GET',
    });
    const data = await res.json();
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getSlots = async (DoctorData) => {
  const { doctorId, date } = DoctorData;
  try {
    const res = await fetch(
      `${API_URL}/slots?doctorId=${doctorId}&date=${date}`,
      {
        method: 'GET',
      },
    );
    const data = await res.json();
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const bookSlot = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};
