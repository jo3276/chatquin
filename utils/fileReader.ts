export const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        return reject(new Error('File is not an image.'));
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (!base64String) {
        return reject(new Error('Could not convert image to base64.'));
      }
      resolve({ data: base64String, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'text/plain' && file.type !== 'text/markdown') {
        return reject(new Error('Unsupported file type. Please upload a .txt or .md file.'));
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
}