import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import ContentsImg from '../models/contentsImg.js';
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
    // acl: 'public-read-write',
  }),
});

// S3 이미지 삭제 함수
const deleteImageFromS3 = async (imgKey) => {
  try {
    const params = {
      Bucket: 'imagechange', // S3 버킷 이름
      Key: imgKey, // 삭제할 이미지의 Key (파일 경로)
    };

    // S3 삭제 명령어 실행
    const data = await s3.send(new DeleteObjectCommand(params));
    console.log('이미지 삭제 성공:', data);
    return data;
  } catch (err) {
    console.error('이미지 삭제 실패:', err);
    throw err;
  }
};

// DB에서 contentId로 이미지 URL 조회 후 삭제
const deleteImagesByContentId = async (contentsId) => {
  try {
    // DB에서 contentId로 이미지 URL을 조회
    const images = await ContentsImg.findAll({
      where: { contentsId }, // DB에서 contentId로 조회
    });
    console.log('🚀 ~ deleteImagesByContentId ~ images:', images);

    if (images.length === 0) {
      throw new Error('이미지를 찾을 수 없습니다.');
    }

    // 각각의 이미지에 대해 S3에서 삭제 작업 수행
    for (const image of images) {
      const imageUrl = image.dataValues.imageUrl; // imageUrl 추출
      const imgKey = imageUrl.split('amazonaws.com/')[1]; // S3 URL에서 key 추출
      console.log('S3에서 삭제할 이미지 Key:', imgKey);

      await deleteImageFromS3('imagechange', imgKey); // S3에서 이미지 삭제
    }

    // DB에서 이미지 정보 삭제 (옵션: 필요 시)
    await ContentsImg.destroy({
      where: { contentsId },
    });

    console.log('DB와 S3에서 이미지 삭제 완료');
  } catch (error) {
    console.error('이미지 삭제 중 에러:', error);
    throw error;
  }
};

// 개별적으로 내보내기
export { imageUploader, deleteImagesByContentId };
