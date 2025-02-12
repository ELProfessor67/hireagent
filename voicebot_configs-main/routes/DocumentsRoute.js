// TODO Please check this code
import express from 'express';
import multer from 'multer';
import documentController from '../controller/DocumentsController.js'
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // You can configure storage settings as needed

// Upload Document
router.post('/uploadDocs', upload.array('files'), documentController.uploadDocuments);


// Delete Document
router.delete('/deleteDoc/:id', documentController.deleteDocument);

// Get All Documents
router.get('/getAllDocList', documentController.getAllDocuments );
// Get All Documents
router.get('/getDocByUserId/:userId', documentController.getDocumentsByUserId );



export default router;
