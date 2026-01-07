// Multer is a Node.js middleware that helps you upload and manage files easily.

import multer from "multer";

const storage=multer.memoryStorage();
export const singleUpload=multer({storage}).single("file");