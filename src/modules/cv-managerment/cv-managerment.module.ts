import { Module } from '@nestjs/common';
import { CandidateService } from './candidate/candidate.service';
import { CandidateController } from './candidate/candidate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidate/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidateController],
  providers: [CandidateService]
})
export class CvManagermentModule {}
