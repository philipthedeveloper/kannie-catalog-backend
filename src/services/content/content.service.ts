import {
  AddContentDto,
  AddContentFileDto,
  UpdateContentDto,
} from "@/decorators";
import { throwNotFoundError, throwUnsupportedMediaTypeError } from "@/helpers";
import { Content, IContent } from "@/models";
import { PaginationService, StorageService } from "@/utils";
import { Model, Types } from "mongoose";

export class ContentService {
  private static instance: ContentService;
  private readonly storageService: StorageService;
  private readonly contentPagination: PaginationService<IContent>;
  private readonly contentModel: Model<IContent> = Content;

  constructor() {
    this.storageService = StorageService.getInstance();
    this.contentPagination = new PaginationService(Content);
  }

  static getInstance(): ContentService {
    if (!this.instance) {
      this.instance = new ContentService();
    }
    return this.instance;
  }

  async getAllWorks(query: any) {
    const { contentType } = query;

    const queryObject: Record<string, any> = {};

    if (contentType) {
      queryObject.type = contentType;
    }

    return this.contentPagination.paginate(
      {
        ...queryObject,
      },
      ["type", "description", "mediaUrl", "coverArt"]
    );
  }

  async getWork(id: string) {
    const content = await this.contentModel.findById(id);
    if (!content) return throwNotFoundError("Work not found");
    return content;
  }

  async addWork(data: AddContentDto & AddContentFileDto) {
    const { type, description, mediaFile, coverArt } = data;
    const contentId = new Types.ObjectId();
    const contentMediaPrefix = `contents/${contentId}`;
    let { fileUrl: mediaUrl } = await this.storageService.uploadFile(
      mediaFile,
      `${contentMediaPrefix}_${mediaFile.originalname}`
    );
    let coverArtUrl;
    if (coverArt) {
      let { fileUrl } = await this.storageService.uploadFile(
        coverArt,
        `cover_arts/${contentId}_${coverArt.originalname}`
      );
      coverArtUrl = fileUrl;
    }
    const content = await this.contentModel.create({
      _id: contentId,
      type,
      description,
      mediaUrl,
      coverArtUrl,
    });
    return content;
  }

  async updateWork(id: string, data: UpdateContentDto) {
    let content = await this.contentModel.findById(id);
    if (!content)
      return throwNotFoundError(
        "The content you are trying to update does not exist"
      );
    const { mediaFile, coverArt } = data;
    const contentMediaPrefix = `contents/${content._id}`;
    if (mediaFile) {
      if (!mediaFile.mimetype.includes(content.type))
        return throwUnsupportedMediaTypeError(
          "Media resource type must match content type"
        );
      await this.storageService.deleteFile(content.mediaUrl);
      content.mediaUrl = (
        await this.storageService.uploadFile(
          mediaFile,
          `${contentMediaPrefix}_${mediaFile?.originalname}`
        )
      ).fileUrl;
    }
    if (coverArt) {
      await this.storageService.deleteFile(content.coverArtUrl);
      content.coverArtUrl = (
        await this.storageService.uploadFile(
          coverArt,
          `cover_arts/${content._id}_${coverArt.originalname}`
        )
      ).fileUrl;
    }
    if (data.description) content.description = data.description;
    await content.save();
    return content;
  }

  async deleteWork(id: string) {
    const content = await this.contentModel.findByIdAndDelete(id);
    if (!content) return throwNotFoundError("Work not found");
    await this.storageService.deleteFile(content.mediaUrl);
    if (content.coverArtUrl)
      await this.storageService.deleteFile(content.coverArtUrl);
    return content;
  }
}
