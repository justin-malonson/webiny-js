import { mimeTypes } from "~/utils/mimeTypes";
import { PresignedPostPayloadData } from "~/types";

export class FileExtension {
    private data: PresignedPostPayloadData;

    constructor(data: PresignedPostPayloadData) {
        this.data = data;
    }

    getValue() {
        const name = this.data.name.toLowerCase();
        const maybeHasExtension = name.includes(".");

        if (maybeHasExtension) {
            const maybeExt = name.split(".").pop() as string;
            const extensions = mimeTypes[this.data.type];
            if (extensions && !extensions.includes(maybeExt)) {
                return extensions[0];
            }
        }

        return "";
    }
}
