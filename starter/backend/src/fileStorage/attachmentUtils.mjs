import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client()

export class AttachmentUtils {
  constructor() {
    this.bucketName = process.env.ATTACHMENT_S3_BUCKET
    this.urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
  }

  getAttachmentUrl(todoId) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }

  async generateUploadUrl(todoId) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: todoId,
      ContentType: 'image/jpeg'
    })

    return await getSignedUrl(s3, command, { expiresIn: this.urlExpiration })
  }
}
