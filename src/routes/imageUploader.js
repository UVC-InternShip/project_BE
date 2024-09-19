import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

// AWS S3 클라이언트 설정 (AWS SDK v3)
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'imagechange', // 생성한 버킷 이름을 적어주세요.
    key: (req, file, callback) => {
      const uploadDirectory = req.query.directory ?? ''; // 업로드할 디렉토리를 설정
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        return callback(new Error('wrong extension'));
      }
      callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
    },
    // ACL 사용하지 않음
    // acl: 'public-read-write', // 이 줄을 제거하여 ACL 사용을 중지합니다.
  }),
});

export default imageUploader;
