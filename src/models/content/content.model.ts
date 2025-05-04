import { ContentType, VideoType } from "@/enums";
import { Document, model, Model, Schema, Types } from "mongoose";

export interface IContent extends Document<Types.ObjectId> {
  type: ContentType;
  description: string;
  mediaUrl: string;
  coverArtUrl: string;
}

const ContentSchema: Schema<IContent> = new Schema<IContent>(
  {
    type: {
      type: String,
      enum: {
        values: Object.values(ContentType),
        message: "Unsupported content type",
      },
      required: [true, "Please provide content type"],
    },
    description: {
      type: String,
      required: [true, "Please description what this is about"],
    },
    mediaUrl: {
      type: String,
      required: [true, "Please provide a url to this content"],
    },
    coverArtUrl: {
      type: String,
      required: [
        function () {
          return this.type === ContentType.AUDIO;
        },
        "Please provide cover art for audio content",
      ],
    },
  },
  { timestamps: true, autoIndex: true, toJSON: { versionKey: false } }
);

export const Content: Model<IContent> = model<IContent>(
  "contents",
  ContentSchema
);
