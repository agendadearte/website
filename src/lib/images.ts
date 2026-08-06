const MAX_SIZE = 800;
const QUALITY = 0.85;
const CONTENT_TYPE = "image/webp";

const getResizedDimensions = (img: HTMLImageElement): [number, number] => {
  const { naturalWidth: width, naturalHeight: height } = img;

  if (width <= MAX_SIZE && height <= MAX_SIZE) {
    return [width, height];
  }

  if (width > height) {
    return [MAX_SIZE, Math.round((height * MAX_SIZE) / width)];
  }

  return [Math.round((width * MAX_SIZE) / height), MAX_SIZE];
};

export const resizeImage = async (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Unable to read image file"));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("Unable to load image"));

      img.onload = () => {
        const [width, height] = getResizedDimensions(img);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        context.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Unable to create resized image"));
              return;
            }

            const filename = file.name.replace(/\.[^.]+$/, ".webp");

            resolve(
              new File([blob], filename, {
                type: CONTENT_TYPE,
                lastModified: Date.now(),
              }),
            );
          },
          CONTENT_TYPE,
          QUALITY,
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
