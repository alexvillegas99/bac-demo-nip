import { Controller, Get, Param } from '@nestjs/common';
import { AmazonS3Service } from './amazon-s3.service';

@Controller('amazon-s3')
export class AmazonS3Controller {
  constructor(private readonly amazonS3Service: AmazonS3Service) {}

  @Get(':data')
  async getImage(@Param() data: any) {
    return await this.amazonS3Service.getImageBase64(data.data);
  }
}
