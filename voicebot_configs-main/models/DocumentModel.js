// import { size } from 'lodash';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const DocumentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  metaData: {
    type: Object,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
}, {timestamps: true});

const Document = mongoose.model('Document', DocumentSchema);

export default Document;


// const DocumentSchema = new Schema({
//   object: { type: String, required: true },
//   bucket: { type: String, required: true },
//   id: { type: String, required: true },
//   name: { type: String, required: true },
//   orgId: { type: String, required: true },
//   url: { type: String, required: true },
//   bytes: { type: String, required: true },
//   purpose: { type: String, required: true },
//   mimetype: { type: String, required: true },
//   path: { type: String, required: true },
//   status: { type: String, required: true }
// }, {timestamps: true});

// const Document = mongoose.model('Document', DocumentSchema);

// export default Document;
