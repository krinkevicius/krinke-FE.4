import { describe, expect, it, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { PLAYER_POSITION, MAMA_PANDAS_POSITION } from '@/constants';
import {
  loadImages,
  animate,
  findDirectionVector,
  move,
  calculateImageDirection,
} from './commonFunctionality';

describe('Testing function loadimages', () => {
  const walkImages: Record<string, string> = {
    walk1: 'src/assets/characters/attackingPanda/walk1.png',
    walk2: 'src/assets/characters/attackingPanda/walk2.png',
  };

  const result = loadImages(walkImages);

  it('should return the same amount of keys as in the passed in Object', () => {
    expect(Object.keys(result).length).toBe(Object.keys(walkImages).length);
  });

  it('should return object with HTMLImageElements as values', () => {
    expect(result).toMatchObject({
      walk1: expect.any(HTMLImageElement),
      walk2: expect.any(HTMLImageElement),
    });
  });
});

describe('Testing function animate', () => {
  const walkImages: Record<string, string> = {
    walk1: 'src/assets/characters/attackingPanda/walk1.png',
    walk2: 'src/assets/characters/attackingPanda/walk2.png',
  };

  const loadedImages = loadImages(walkImages);

  it('should return the second image when passing index 1.2', () => {
    const result = animate(loadedImages, 1.2);

    expect(result[0]).toBe(loadedImages[Object.keys(loadedImages)[1]]);
  });

  it('should return the first image when passed index is equal to length of keys', () => {
    const result = animate(loadedImages, Object.keys(loadedImages).length);

    expect(result[0]).toBe(loadedImages[Object.keys(loadedImages)[0]]);
  });

  it('should return the first image when passed index is higher than length of keys', () => {
    const result = animate(loadedImages, Object.keys(loadedImages).length + 1);

    expect(result[0]).toBe(loadedImages[Object.keys(loadedImages)[0]]);
  });
});

describe('Testing function findDirectionVector', () => {
  it('should return [0,1] for the top panda', () => {
    expect(
      findDirectionVector(MAMA_PANDAS_POSITION.top, PLAYER_POSITION)
    ).toStrictEqual([0, 1]);
  });

  it('should return [1,0] for the left panda', () => {
    expect(
      findDirectionVector(MAMA_PANDAS_POSITION.left, PLAYER_POSITION)
    ).toStrictEqual([1, 0]);
  });

  it('should return [-1,0] for the right panda', () => {
    expect(
      findDirectionVector(MAMA_PANDAS_POSITION.right, PLAYER_POSITION)
    ).toStrictEqual([-1, 0]);
  });

  it('should return [0,-1] for the bottom panda', () => {
    expect(
      findDirectionVector(MAMA_PANDAS_POSITION.bottom, PLAYER_POSITION)
    ).toStrictEqual([0, -1]);
  });
});

describe('Testing function move', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should return incremented currentPosition by default', () => {
    expect(move([10, 50], PLAYER_POSITION)).toStrictEqual([10.2, 50]);
  });

  it('should return currentPosition if targetPosition = currentPosition', () => {
    expect(move([10, 50], [10, 50])).toStrictEqual([10, 50]);
  });

  it('should return targetPosition, if currentPosition is closer than speed*increment', () => {
    expect(move([49.99, 50], PLAYER_POSITION)).toStrictEqual(PLAYER_POSITION);
  });
});

describe('Testing function calculateImageDirection', () => {
  it('should return -1 for top panda', () => {
    expect(
      calculateImageDirection(MAMA_PANDAS_POSITION.top, PLAYER_POSITION).value
    ).toBe(-1);
  });

  it('should return -1 for left panda', () => {
    expect(
      calculateImageDirection(MAMA_PANDAS_POSITION.left, PLAYER_POSITION).value
    ).toBe(-1);
  });

  it('should return 1 for right panda', () => {
    expect(
      calculateImageDirection(MAMA_PANDAS_POSITION.right, PLAYER_POSITION).value
    ).toBe(1);
  });

  it('should return 1 for bottom panda', () => {
    expect(
      calculateImageDirection(MAMA_PANDAS_POSITION.bottom, PLAYER_POSITION)
        .value
    ).toBe(1);
  });
});
