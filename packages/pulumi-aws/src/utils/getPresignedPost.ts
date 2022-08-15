import S3Client from "aws-sdk/clients/s3";

interface GetPresignedPostParams {
    bucket: string;
    key: string;
    checksum: string;
    contentType: string | null;
    cacheControl: string | undefined;
}

export const getPresignedPost = async ({
    bucket,
    key,
    checksum,
    cacheControl,
    contentType
}: GetPresignedPostParams) => {
    const fields: Record<string, string> = { key, "X-Amz-Meta-Checksum": checksum };

    if (contentType) {
        fields["Content-Type"] = contentType;
    }

    if (cacheControl) {
        fields["Cache-Control"] = cacheControl;
    }

    const s3Params = {
        Expires: 20,
        Bucket: bucket,
        Conditions: [["content-length-range", 0, 26214400]],
        Fields: fields
    };

    const s3 = new S3Client();

    return s3.createPresignedPost(s3Params);
};