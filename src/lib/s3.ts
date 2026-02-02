import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: "us-east-1", // Placeholder region
    endpoint: `http://${process.env.S3_ENDPOINT}:${process.env.S3_PORT}`,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
    forcePathStyle: true, // Required for Minio
});

export { s3Client };
