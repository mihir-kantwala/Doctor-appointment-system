import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'Doctor_Slot',
  },
);

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
