// Utilitaire pour appliquer crop, rotation et texte sur une image (canvas)
// Utilisé par Community.tsx

export async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  rotation: number = 0,
  text: string = ''
): Promise<{ blob: Blob; previewUrl: string }> {
  const image = (await createImage(imageSrc)) as HTMLImageElement;
  const MAX_SIZE = 2048; // Limite la taille max du crop (largeur ou hauteur)
  // Ajuste le crop si trop grand
  let cropWidth = crop.width;
  let cropHeight = crop.height;
  let scale = 1;
  if (crop.width > MAX_SIZE || crop.height > MAX_SIZE) {
    scale = Math.min(MAX_SIZE / crop.width, MAX_SIZE / crop.height);
    cropWidth = Math.round(crop.width * scale);
    cropHeight = Math.round(crop.height * scale);
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de créer le contexte canvas');

  // Calculer la taille du crop sécurisé
  const safeArea = Math.max(image.width, image.height) * 2;
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Déplacer au centre, appliquer la rotation
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Dessiner l'image
  ctx.drawImage(
    image,
    (safeArea - image.width) / 2,
    (safeArea - image.height) / 2
  );

  // Extraire le crop (en évitant de dépasser les bords)
  const cropX = Math.max(0, Math.min(crop.x + (safeArea - image.width) / 2, safeArea - crop.width));
  const cropY = Math.max(0, Math.min(crop.y + (safeArea - image.height) / 2, safeArea - crop.height));
  let data;
  try {
    data = ctx.getImageData(cropX, cropY, crop.width, crop.height);
  } catch (e) {
    throw new Error('Erreur lors du crop de l’image. Essayez une zone plus petite ou une autre image.');
  }

  // Redimensionner le canvas au crop (et réduire si besoin)
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx2 = canvas.getContext('2d');
  if (!ctx2) throw new Error('Impossible de créer le contexte canvas');
  // Mettre l'image croppée à la bonne taille
  ctx2.putImageData(data, 0, 0);
  if (scale !== 1) {
    // Redessiner à la bonne taille
    const tmp = document.createElement('canvas');
    tmp.width = crop.width;
    tmp.height = crop.height;
    const tmpCtx = tmp.getContext('2d');
    if (tmpCtx) tmpCtx.putImageData(data, 0, 0);
    ctx2.drawImage(tmp, 0, 0, crop.width, crop.height, 0, 0, cropWidth, cropHeight);
  }

  // Ajouter le texte centré si demandé
  if (text) {
    ctx2.font = 'bold 32px Arial';
    ctx2.fillStyle = 'white';
    ctx2.strokeStyle = 'black';
    ctx2.textAlign = 'center';
    ctx2.lineWidth = 2;
    ctx2.strokeText(text, cropWidth / 2, cropHeight / 2);
    ctx2.fillText(text, cropWidth / 2, cropHeight / 2);
  }

  // Générer l'URL
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) return reject(new Error('Erreur lors de la génération du fichier.'));
      resolve({
        blob: blob as Blob,
        previewUrl: URL.createObjectURL(blob as Blob)
      });
    }, 'image/png');
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', error => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}
