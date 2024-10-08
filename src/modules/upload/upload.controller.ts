import { Request, Response } from "express";
import imageService from "../images/image.service";
import fileService from "./upload.service";
import config from "../../config/config";

class UploadController {
	async uploadFile(req: Request, res: Response) {
		const file = req.file;
		if (!file) {
			return res.status(400).json({
				success: false,
				message: "No file uploaded",
			});
		}
		imageService
			.addFile(file)
			.then((result) => {
				if (config().isDev) {
					fileService.deleteFile(file.filename);
				}
				res
					.status(200)
					.json({ success: true, message: "File Uploaded", data: result });
			})
			.catch((err) => res.status(500).json({ message: err.message }));
	}

	async getFileByFilename(req: Request, res: Response) {
		const filename = req.params.filename;
		await imageService
			.getFileById(filename)
			.then((result) => {
				if (result) {
					res.sendFile(result);
				} else {
					res.status(404).json({ message: "File not found" });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	async deleteFile(req: Request, res: Response) {
		const filename = req.params.filename;

		await imageService
			.deleteFile(filename)
			.then((result) => {
				res
					.status(200)
					.json({ success: true, message: "File deleted", result });
			})
			.catch((err) => res.status(500).json({ message: err.message }));
	}
}
const uploadController = new UploadController();
export default uploadController;
