<script setup lang="ts">
import { ref, watch } from 'vue';
import { PLAYER_POSITION } from '@/constants';
import useGameStateStore from '@/stores/gameStateStore';
import {
  loadImages,
  animate,
  move,
  calculateImageDirection,
} from '@/components/commonFunctionality';
import idle1Image from '@/assets/characters/mamaPanda/idle1.png';
import idle2Image from '@/assets/characters/mamaPanda/idle2.png';
import idle3Image from '@/assets/characters/mamaPanda/idle3.png';

const gameStateStore = useGameStateStore();

const emit = defineEmits(['update:modelValuePosition']);

// Get starting coordinates from MainGame Component
const props = defineProps<{
  position: [number, number];
}>();

const currentPosition = ref<[number, number]>(props.position);
const targetPosition: [number, number] = currentPosition.value;

// All pandas share same .png files, however based on their position on screen might need to be flipped horizontally
const imageDirection = calculateImageDirection(
  currentPosition.value,
  PLAYER_POSITION
);

// Images used by Mama Pandas:
const idleImages: Record<string, string> = {
  idle1: idle1Image,
  idle2: idle2Image,
  idle3: idle3Image,
  idle4: idle2Image,
};

// Create an object of Images (needed to show images faster to the user)
const idleAnimation: Record<string, HTMLImageElement> = loadImages(idleImages);

// Default image to show to user
const currentImage = ref<HTMLImageElement>(idleAnimation.idle1);

// Variable to track which frame from idleAnimation to show:
const frameIndex = ref<number>(0);

// Update currentPosition value whenever position in Main Game component changes
watch(
  () => props.position,
  () => {
    currentPosition.value = props.position;
  }
);

// Run the following on each screen refresh:
watch(
  () => gameStateStore.loopSignal,
  () => {
    if (gameStateStore.loopSignal) {
      // Show idle animation
      [currentImage.value, frameIndex.value] = animate(
        idleAnimation,
        frameIndex.value
      );

      // Update currentPosition and send it back to Parent Component, so that
      // Attacking Panda could be added at the same position
      currentPosition.value = move(currentPosition.value, targetPosition);
      emit('update:modelValuePosition', currentPosition.value);
    }
  }
);
</script>

<template>
  <div class="mama-panda">
    <div
      id="image-container"
      :style="[{ backgroundImage: `url(${currentImage.src})` }]"
    ></div>
  </div>
</template>

<style scoped>
.mama-panda {
  position: absolute;
  top: v-bind("currentPosition[1] +'%'");
  left: v-bind("currentPosition[0] + '%'");
  transform: translate(-50%, -50%);
  z-index: v-bind(imageDirection * 100);
  width: 10%;
  height: 10%;
}

#image-container {
  transform: scaleX(v-bind(imageDirection));
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  width: 100%;
  height: 100%;
}
</style>
