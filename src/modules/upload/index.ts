import express from "express";
import multer from "multer";

import fs from "fs";
import path from "path";
import uploadController from "./upload.controller";

const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadRouter = express.Router();

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (_req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
export const fileUpload = multer({ storage: storage, dest: uploadsDir });

uploadRouter.post(
	"/upload",
	fileUpload.single("file"),
	uploadController.uploadFile
);
uploadRouter.delete("/:filename", uploadController.deleteFile);

uploadRouter.get("/:filename", uploadController.getFileByFilename);

export default uploadRouter;
