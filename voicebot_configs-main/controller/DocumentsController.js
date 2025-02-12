// TODO Please check this code
import Document from "../models/DocumentModel.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uploadDocuments = async (req, res) => {
  try {
    const { userId, metaData } = req.body;
    const files = req.files;
    console.log(userId, metaData, files);

    if (!files || files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    const documents = [];

    for (const file of files) {
      const fileName = file.originalname;
      const fileSize = file.size;
      const filePath = file.path;

      const document = new Document({
        userId,
        fileName,
        fileSize,
        fileUrl: filePath,
        metaData,
        filePath
      });

      await document.save();
      documents.push(document);
    }

    res.status(201).send({ message: 'Documents saved successfully', documents });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).send('Server error');
  }
};

export const getDocumentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: 'Invalid user ID format.' });
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    const documents = await Document.find({ userId: objectId });

    if (!documents.length) {
      return res.status(404).send({ message: 'No documents found for this user.' });
    }

    res.status(200).send({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send({ message: 'Server error', error });
  }
};


// Delete a document

const deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDocument = await Document.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ deletedDocument, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all documents

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    res.status(200).json({ documents, message: 'All Documents fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default {
  uploadDocuments,
  deleteDocument,
  getAllDocuments, getDocumentsByUserId
};