import { Request, Response } from "express";
import fs from "fs";
import path from "path";

class UploadController {
	async uploadFile(req: Request, res: Response) {
		const file = req.file;
		if (!file) {
			return res.status(400).json({
				success: false,
				message: "No file uploaded",
			});
		}
		res.status(200).json({
			success: true,
			message: "File uploaded successfully",
			data: file,
		});
	}

	async getFileByFilename(req: Request, res: Response) {
		const filename = req.params.filename;
		const filePath = path.join(process.cwd(), "uploads", filename);
		res.sendFile(filePath);
	}

	async deleteFile(req: Request, res: Response) {
		const filename = req.params.filename;

		const filePath = path.join(process.cwd(), "uploads", filename);

		fs.unlink(filePath, (err) => {
			if (err) {
				return res.status(500).json({
					success: false,
					message: "Could not delete file",
				});
			}
			res.status(200).json({
				success: true,
				message: "File deleted successfully",
			});
		});
	}
}
const uploadController = new UploadController();
export default uploadController;
