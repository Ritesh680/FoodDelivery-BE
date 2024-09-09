import CustomError from "../../@types/CustomError";
import fileService from "../upload/upload.service";
import Image from "./image.model";

class ImageService {
	file = Image;
	async addFile(file: Express.Multer.File) {
		// Add file to the database
		const { originalname, mimetype, size } = file;
		const fileData = await fileService.uploadFile(file.path);
		const newFile = new this.file({
			fileId: fileData.public_id,
			name: originalname,
			url: fileData.secure_url,
			size,
			type: mimetype,
		});

		return newFile
			.save()
			.then((file) => {
				return file;
			})
			.catch((err) => {
				throw new CustomError(err);
			});
	}

	async getFileById(id: string) {
		// Get file from the database
		return this.file
			.findOne({ fileId: id })
			.exec()
			.then(async (file) => {
				if (!file) {
					throw new CustomError({ status: 404, message: "File not found" });
				}
				return fileService
					.getFileById(file.fileId)
					.then((result) => {
						return result;
					})
					.catch((err) => {
						throw new CustomError(err);
					});
			})
			.catch((err) => {
				throw new CustomError(err);
			});
	}

	async deleteFile(id: string) {
		// Delete file from the database
		return this.file
			.findOneAndDelete({ fileId: id })
			.exec()
			.then(async (file) => {
				if (!file) {
					throw new CustomError({ status: 404, message: "File not found" });
				}
				return fileService
					.deleteFileById(id)
					.then((result) => {
						return result;
					})
					.catch((err) => {
						throw new CustomError(err);
					});
			})
			.catch((err) => {
				throw new CustomError(err);
			});
	}
}

const imageService = new ImageService();
export default imageService;