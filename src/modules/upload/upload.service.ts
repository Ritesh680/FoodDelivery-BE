import fs from "fs";
import path from "path";
import CustomError from "../../@types/CustomError";
import cloudinary from "../../config/cloudinary.config";
class UploadService {
	async uploadFile(path: string) {
		// file upload logic
		return cloudinary.uploader.upload(path, (err, result) => {
			if (err) {
				throw new CustomError({ status: 500, message: err?.message });
			}
			return result;
		});
	}

	async getFileById(id: string) {
		// file get logic
		return cloudinary.api.resource(id, (err, result) => {
			if (err) {
				throw new CustomError({ status: 500, message: err?.message });
			}
			return result;
		});
	}

	async deleteFileById(id: string) {
		// file delete logic
		return cloudinary.uploader.destroy(id, (err, result) => {
			if (err) {
				throw new CustomError({ status: 500, message: err?.message });
			}
			return result;
		});
	}

	async deleteFile(filename: string) {
		// file delete logic
		const filePath = path.join(process.cwd(), "uploads", filename);
		fs.unlink(filePath, (err) => {
			if (err) {
				throw new CustomError({ status: 500, message: err?.message });
			}
		});
	}
}

const fileService = new UploadService();
export default fileService;
