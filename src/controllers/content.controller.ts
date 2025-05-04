import {
  AddContentDto,
  AddContentFileDto,
  UpdateContentDto,
} from "@/decorators";
import { ContentType } from "@/enums";
import {
  sendSuccessResponse,
  throwBadRequestError,
  throwUnsupportedMediaTypeError,
} from "@/helpers";
import { ContentService } from "@/services";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface GenericReq<T> extends Request<any, any, T, any> {}

export class ContentController {
  private static instance: ContentController;
  private readonly contentService: ContentService;

  constructor() {
    this.contentService = ContentService.getInstance();
  }

  static getInstance(): ContentController {
    if (!this.instance) {
      this.instance = new ContentController();
    }
    return this.instance;
  }

  getAlContents = async (req: Request, res: Response) => {
    const data = await this.contentService.getAllWorks(req.query);
    return sendSuccessResponse(res, { data });
  };

  getContentById = async (req: Request, res: Response) => {
    const data = await this.contentService.getWork(req.params.id);
    return sendSuccessResponse(res, { data });
  };

  addNewContent = async (req: GenericReq<AddContentDto>, res: Response) => {
    // if (req.body.type === ContentType.AUDIO && !req.files["coverAt"])
    //   return throwBadRequestError("Missing required file: cover art");

    const reqFiles = {
      mediaFile: req.files["mediaFile"][0]!,
      coverArt: req.files["coverArt"]?.[0],
    };

    if (!reqFiles.mediaFile.mimetype.includes(req.body.type))
      return throwUnsupportedMediaTypeError(
        `Media resource must match content type.`
      );

    const data = await this.contentService.addWork({
      ...req.body,
      ...reqFiles,
    });

    return sendSuccessResponse(res, { data }, StatusCodes.CREATED);
  };

  updateContent = async (
    req: GenericReq<Omit<UpdateContentDto, "mediaFile" | "coverArt">>,
    res: Response
  ) => {
    const reqFiles: Partial<AddContentFileDto> = {
      mediaFile: req.files?.["mediaFile"]?.[0],
      coverArt: req.files?.["coverArt"]?.[0],
    };

    const data = await this.contentService.updateWork(req.params.id, {
      ...req.body,
      ...reqFiles,
    });
    return sendSuccessResponse(res, { data });
  };

  deleteContent = async (req: Request, res: Response) => {
    const data = await this.contentService.deleteWork(req.params.id);
    return sendSuccessResponse(res, { data });
  };
}
