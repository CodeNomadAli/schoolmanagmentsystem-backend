import { S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";


const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION,
  credentials: fromEnv(),
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  forcePathStyle: false, 
});

export default s3;