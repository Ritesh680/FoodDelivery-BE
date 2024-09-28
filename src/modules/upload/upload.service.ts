import fs from "fs";
import path from "path";
import CustomError from "../../@types/CustomError";
import cloudinary from "../../config/cloudinary.config";
import config from "../../config/config";
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
		try {
			if (config().isDev) {
				// file get logic
				return cloudinary.api.resource(id, (err, result) => {
					if (err) {
						throw new CustomError({ status: 500, message: err?.message });
					}
					if (!result) {
						throw new CustomError({ status: 404, message: "File not found" });
					}
					return result;
				});
			} else {
				// file get logic
				const filePath = path.join(process.cwd(), "uploads", id);
				return filePath;
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			throw new CustomError({ status: 500, message: error.message });
		}
	}

	async deleteFileById(id: string) {
		// file delete logic

		if (config().isDev) {
			return cloudinary.uploader.destroy(id, (err, result) => {
				if (err) {
					throw new CustomError({ status: 500, message: err?.message });
				}
				return result;
			});
		} else {
			return await this.deleteFile(id);
		}
	}

	async deleteFile(filename: string) {
		// file delete logic
		const filePath = path.join(process.cwd(), "uploads", filename);
		fs.unlink(filePath, (err) => {
			if (err) {
				throw new CustomError({ status: 500, message: err?.message });
			}
			return { success: true, message: "File deleted" };
		});
	}
}

const fileService = new UploadService();
export default fileService;
