<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import useGameStateStore from '@/stores/gameStateStore';
import useAttackStore from '@/stores/attackStore';
import idle1Image from '@/assets/characters/player/idle1.png';
import idle2Image from '@/assets/characters/player/idle2.png';
import upImage from '@/assets/characters/player/up.png';
import leftImage from '@/assets/characters/player/left.png';
import rightImage from '@/assets/characters/player/right.png';
import downImage from '@/assets/characters/player/down.png';
import { loadImages, animate } from '../commonFunctionality';

const gameStatestore = useGameStateStore();
const attackStore = useAttackStore();

// Images used by Player character:
const idleImages: Record<string, string> = {
  idle1: idle1Image,
  idle2: idle2Image,
};

const attackImages: Record<string, string> = {
  up: upImage,
  left: leftImage,
  right: rightImage,
  down: downImage,
};

// Player character will have two animations, thus create two
// separate objects of Images (needed to show images faster to the user)
const attackAnimation: Record<string, HTMLImageElement> =
  loadImages(attackImages);

const idleAnimation: Record<string, HTMLImageElement> = loadImages(idleImages);

// Default image to show to user
const currentImage = ref<HTMLImageElement>(idleAnimation.idle1);

// Variables to track which frame from animation objects to show:
const frameIndex = ref<number>(0);
const attackFrame = ref<string | null>(null);

// Update attackDirection value based on user's input
function handleUserInput(event: KeyboardEvent) {
  if (attackStore.attackDirection === null) {
    switch (event.key) {
      case 'ArrowUp':
        attackStore.attackDirection = 'up';
        break;
      case 'ArrowLeft':
        attackStore.attackDirection = 'left';
        break;
      case 'ArrowRight':
        attackStore.attackDirection = 'right';
        break;
      case 'ArrowDown':
        attackStore.attackDirection = 'down';
        break;
      default:
        break;
    }
  }
}

// Update the image shown to user based on attackDirection variable
watch(
  () => attackStore.attackDirection,
  () => {
    if (attackStore.attackDirection !== null) {
      attackFrame.value = attackAnimation[attackStore.attackDirection].src;
    } else {
      attackFrame.value = null;
    }
  }
);

// Run the following on each screen refresh:
watch(
  () => gameStatestore.loopSignal,
  () => {
    if (gameStatestore.loopSignal) {
      // Show walking animation
      [currentImage.value, frameIndex.value] = animate(
        idleAnimation,
        frameIndex.value
      );
    }
  }
);

onMounted(() => {
  document.addEventListener('keyup', handleUserInput);
});

// Once the game is over event listener needs to be removed, otherwise it would double if user chose to play again:
onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleUserInput);
});
</script>

<template>
  <div
    class="player"
    :style="[
      attackFrame
        ? { backgroundImage: `url(${attackFrame})` }
        : {
            backgroundImage: `url(${currentImage.src})`,
          },
    ]"
  ></div>
</template>

<style scoped>
.player {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: background-image 0.5ms step-start;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  width: 10%;
  height: 10%;
}
</style>
