"# Doctor-appointment-system"

Question 2 — Doctor Appointment System

Difficulty: Easy–Medium
Time: 2–3 Hours

Objective

Build a doctor appointment booking system.

Flow
Select Doctor
↓
Select Date
↓
View Available Time Slots
↓
Enter Patient Details
↓
Book Appointment
Backend

Doctors

id
name
specialization
consultationFee

Slots

id
doctorId
date
time
capacity

Appointments

id
doctorId
slotId
patientName
patientEmail
patientAge
totalPrice
APIs
GET /api/doctors
GET /api/slots?doctorId=&date=
POST /api/appointments
Validation
Doctor must exist
Slot must exist
Slot must belong to doctor
Slot cannot be full
Valid patient name
Valid email
Patient age must be between 1–120
Same email cannot book the same slot twice
Pricing
consultationFee

Rules:

Age below 12 → 20% discount
Weekend → 10% surcharge
Round final amount
Frontend

Show:

Doctor dropdown
Specialization
Date
Available slots
Patient form
Price calculation
Booking confirmation
