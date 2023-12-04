import files from '../../../assets/icons/files/index';
const acceptedImageTypes = ['png', 'jpg', 'jpeg'];

const acceptedVideoTypes = ['mp4', 'mkv'];

const acceptedAudioTypes = ['mp3'];

const acceptedDocumentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

const acceptedArchiveTypes = ['zip'];

const acceptedFileTypes = [
	...acceptedImageTypes,
	...acceptedVideoTypes,
	...acceptedAudioTypes,
	...acceptedDocumentTypes,
	...acceptedArchiveTypes,
];

export const fileUtil = {
	acceptedImageTypes,
	acceptedVideoTypes,
	acceptedAudioTypes,
	acceptedDocumentTypes,
	acceptedArchiveTypes,
	acceptedFileTypes,

	getFilePreview: (file) => {
		const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/');
		if (isMedia) {
			if (file instanceof File) {
				return URL.createObjectURL(file);
			} else {
				return file.link;
			}
		} else {
			const ext = file.name.split('.').pop();
			let fileIcon = files.def;
			if (ext && Object.keys(files).includes(ext)) {
				fileIcon = files[ext];
			}

			return fileIcon.src ;
		}
	},

	isValidFileType: (name) => {
		const ext = name?.split('.').pop();
		return ext && acceptedFileTypes.includes(ext);
	},

	isValidFileSize: (size) => {
		const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
		return size <= MAX_FILE_SIZE;
	},

	isVideo: (name) => {
		const ext = name?.split('.').pop();
		return ext && acceptedVideoTypes.includes(ext);
	},

	isImage: (name) => {
		const ext = name?.split('.').pop();
		return ext && acceptedImageTypes.includes(ext);
	},

	getFileIcon: (name) => {
		const ext = name.split('.').pop();
		if (ext && Object.keys(files).includes(ext)) {
			return files[ext];
		}
		return files.def;
	},

	formatSize: (size) => {
		if (isNaN(size)) return 'Không xác định';

		const KB = 1024;
		const MB = 1024 * KB;
		const GB = 1024 * MB;
		if (size < KB) {
			return `${size} B`;
		} else if (size < MB) {
			return `${(size / KB).toFixed(2)} KB`;
		} else if (size < GB) {
			return `${(size / MB).toFixed(2)} MB`;
		} else {
			return `${(size / GB).toFixed(2)} GB`;
		}
	},
};
