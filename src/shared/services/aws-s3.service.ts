// import { Injectable } from '@nestjs/common';
// import AWS from 'aws-sdk';
// import mime from 'mime-types';
// import path from 'path';

// import type { IFile } from '../../interfaces';
// import { ApiConfigService } from './api-config.service';
// import { AwsS3Exception } from './exceptions/aws-s3.exception';
// import { GeneratorService } from './generator.service';

// @Injectable()
// export class AwsS3Service {
//   private readonly s3: AWS.S3;

//   constructor(
//     public configService: ApiConfigService,
//     public generatorService: GeneratorService,
//   ) {
//     const awsS3Config = configService.awsS3Config;

//     const options: AWS.S3.Types.ClientConfiguration = {
//       apiVersion: awsS3Config.bucketApiVersion,
//       region: awsS3Config.bucketRegion,
//     };

//     this.s3 = new AWS.S3(options);
//   }

//   async uploadImage(file: IFile): Promise<string> {
//     const fileName = this.generatorService.fileName(
//       <string>mime.extension(file.mimetype),
//     );
//     const key = 'images/' + fileName;
//     await this.s3
//       .putObject({
//         Bucket: this.configService.awsS3Config.bucketName,
//         Body: file.buffer,
//         ACL: 'public-read',
//         Key: key,
//       })
//       .promise();

//     return key;
//   }

//   async moveImage(fromKey: string): Promise<string> {
//     const fileName = path.basename(fromKey);
//     const key = `images/${fileName}`;
//     const bucketName = this.configService.awsS3Config.bucketName;

//     try {
//       await this.s3
//         .copyObject({
//           Bucket: bucketName,
//           CopySource: `${bucketName}/${fromKey}`,
//           Key: key,
//           ACL: 'public-read',
//         })
//         .promise();

//       void this.s3
//         .deleteObject({
//           Bucket: bucketName,
//           Key: fromKey,
//         })
//         .promise();
//     } catch (error) {
//       throw new AwsS3Exception(error);
//     }

//     return key;
//   }
// }
