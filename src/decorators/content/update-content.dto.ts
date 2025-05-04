import { IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";
import { ContentType } from "@/enums";

export class UpdateContentDto {
  @IsEnum(ContentType, { message: "Unsupported content type" })
  @IsOptional()
  type?: ContentType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateIf((_, value) => value instanceof Object) // Ensures it's a file
  mediaFile?: Express.Multer.File;

  @IsOptional()
  @ValidateIf((_, value) => value instanceof Object) // Ensures it's a file
  coverArt?: Express.Multer.File;
}
