import fs from "fs";
import path from "path";
import CustomError from "../../@types/CustomError";
class UploadService {
	async uploadFile() {
		// file upload logic
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
