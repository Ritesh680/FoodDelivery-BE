import fs from "fs";
import path from "path";
class UploadService {
	async uploadFile() {
		// file upload logic
	}

	async deleteFile(filename: string) {
		// file delete logic
		const filePath = path.join(process.cwd(), "uploads", filename);
		fs.unlink(filePath, (err) => {
			throw new Error(err?.message);
		});
	}
}

const fileService = new UploadService();
export default fileService;
