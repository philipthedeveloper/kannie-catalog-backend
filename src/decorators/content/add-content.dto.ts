import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from "class-validator";
import { ContentType } from "@/enums";

export class AddContentDto {
  @IsEnum(ContentType, { message: "Unsupported content type" })
  @IsNotEmpty({ message: "Please provide content type" })
  type!: ContentType;

  @IsString()
  @IsNotEmpty({ message: "Please describe what this is about" })
  description!: string;
}

export class AddContentFileDto {
  @IsDefined({ message: "Please upload your audio or video material" })
  mediaFile!: Express.Multer.File;

  @IsOptional()
  coverArt?: Express.Multer.File;
}
