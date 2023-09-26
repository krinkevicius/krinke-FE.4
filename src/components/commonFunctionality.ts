import { computed } from 'vue';
import useScoreStore from '@/stores/scoreStore';
import { ANIMATION_FRAME_DURATION } from '@/constants';

export function loadImages(
  imagesToLoad: Record<string, string>
): Record<string, HTMLImageElement> {
  const loadedImages: Record<string, HTMLImageElement> = {};

  Object.keys(imagesToLoad).forEach((key) => {
    const img = new Image();
    img.src = imagesToLoad[key];
    loadedImages[key] = img;
  });

  return loadedImages;
}

export function animate(
  frameObject: Record<string, HTMLImageElement>,
  frameIndex: number
): [HTMLImageElement, number] {
  let updatedIndex = frameIndex + ANIMATION_FRAME_DURATION;

  // Reset the index after the last image in the object is shown
  if (updatedIndex >= Object.keys(frameObject).length) {
    updatedIndex = 0;
  }

  const img = frameObject[Object.keys(frameObject)[Math.floor(updatedIndex)]];

  return [img, updatedIndex];
}

export function findDirectionVector(
  startCoordinate: [number, number],
  targetCoordinate: [number, number]
): [number, number] {
  const [startX, startY] = startCoordinate;
  const [targetX, targetY] = targetCoordinate;

  // Calculate vector components
  const dx = targetX - startX;
  const dy = targetY - startY;

  // Character is at target position
  if (dx === 0 && dy === 0) {
    return [0, 0];
  }

  // Calculate the magnitude of the vector
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  // Normalize the vector by dividing each component by the magnitude
  const normalizedX = dx / magnitude;
  const normalizedY = dy / magnitude;

  return [normalizedX, normalizedY];
}

export function move(
  currentPosition: [number, number],
  targetPosition: [number, number]
): [number, number] {
  const [currentX, currentY] = currentPosition;
  const [targetX, targetY] = targetPosition;

  // Return currentPosition if Character is already at targetPosition
  if (currentX === targetX && currentY === targetY) {
    return currentPosition;
  }
  const scoreStore = useScoreStore();

  const [directionX, directionY] = findDirectionVector(
    currentPosition,
    targetPosition
  );

  // If the difference between current X/Y and target X/Y is less than direction X/Y * speed,
  // it means there's no need to increment currentPosition, targetPosition can be returned
  if (
    Math.abs(targetX - currentX) <= Math.abs(directionX * scoreStore.speed) &&
    Math.abs(targetY - currentY) <= Math.abs(directionY * scoreStore.speed)
  ) {
    return targetPosition;
  }

  // Else, increment currentPosition
  return [
    currentX + directionX * scoreStore.speed,
    currentY + directionY * scoreStore.speed,
  ];
}

export function calculateImageDirection(
  currentPosition: [number, number],
  targetPosition: [number, number]
) {
  return computed(() => {
    if (
      findDirectionVector(currentPosition, targetPosition).reduce(
        (sum, num) => sum + num,
        0
      ) < 0
    ) {
      return 1;
    }
    return -1;
  });
}
