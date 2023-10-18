const { S3 } = require("aws-sdk")
const { v4: uuidv4 } = require(uuidv4)
const multerS3 = require('multer-s3');



exports.s3Uploadv2 = async (file) => {
    console.log(file, 'file')
    const s3 = new multerS3()

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${file.originalname}`,
        Body: file.buffer
    }
    return await s3.upload(param).promise()
}