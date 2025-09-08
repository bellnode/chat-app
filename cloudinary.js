import { v2 as cloudinary } from 'cloudinary'
import config from '../config.js';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


const uploadToCloudinary = async(files = [], folder_name) => {
  const uploadPromises = files.map(({buffer}) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: folder_name },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });
  })
  try {
    const result = await Promise.all(uploadPromises)
    const formattedResult = result.map((i)=>({
      public_id : i.public_id,
      url: i.url
    }))
    return formattedResult
  } catch (error) {
    console.log(error.message)
  }
};

export { uploadToCloudinary }