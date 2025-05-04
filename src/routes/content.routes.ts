import { IMAGE_MIMETYPES, VIDEO_AUDIO_MIMETYPES } from "@/constants";
import { ContentController } from "@/controllers";
import { AddContentDto, UpdateContentDto } from "@/decorators";
import { ContentType } from "@/enums";
import { createRouter } from "@/helpers";
import { uploadFiles, validateDTO, validateToken } from "@/middlewares";

export const contentRouter = createRouter();
export const contentController = ContentController.getInstance();

contentRouter.get("/all", contentController.getAlContents);

contentRouter.get("/:id", contentController.getContentById);

contentRouter.post(
  "/create",
  validateToken,
  uploadFiles([
    {
      name: "mediaFile",
      required: true,
      mimeTypes: VIDEO_AUDIO_MIMETYPES,
    },
    {
      name: "coverArt",
      required: function (req) {
        return req.body.type === ContentType.AUDIO;
      },
      mimeTypes: IMAGE_MIMETYPES,
    },
  ]),
  validateDTO(AddContentDto),
  contentController.addNewContent
);

contentRouter.patch(
  "/:id",
  validateToken,
  uploadFiles([
    { name: "mediaFile", required: false, mimeTypes: VIDEO_AUDIO_MIMETYPES },
    { name: "coverAt", required: false, mimeTypes: IMAGE_MIMETYPES },
  ]),
  validateDTO(UpdateContentDto),
  contentController.updateContent
);

contentRouter.delete("/:id", validateToken, contentController.deleteContent);
