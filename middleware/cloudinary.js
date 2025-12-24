const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure multer to use memory storage (required for Cloudinary)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  console.log("Filtering file:", file);
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    require("path").extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"));
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Function to upload file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "movie-dashboard") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 1000, height: 1000, crop: "limit" }, // Optional: resize images
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    const stream = require("stream");
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

// Function to delete file from Cloudinary
const deleteFromCloudinary = (imageUrl) => {
  return new Promise((resolve, reject) => {
    // Extract public_id from the URL
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};
