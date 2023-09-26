<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { PLAYER_POSITION, ATTACK_RANGE } from '@/constants';
import useGameStateStore from '@/stores/gameStateStore';
import useAttackStore from '@/stores/attackStore';
import useScoreStore from '@/stores/scoreStore';
import walk1Image from '@/assets/characters/attackingPanda/walk1.png';
import walk2Image from '@/assets/characters/attackingPanda/walk2.png';
import {
  findDirectionVector,
  loadImages,
  animate,
  move,
  calculateImageDirection,
} from '../commonFunctionality';

const gameStateStore = useGameStateStore();
const attackStore = useAttackStore();
const scoreStore = useScoreStore();

const emit = defineEmits(['remove-panda']);

// Get data from MainGame Component
const props = defineProps<{
  position: [number, number];
  id?: number;
  arrindex: number;
}>();

const currentPosition = ref<[number, number]>(props.position);
const arrIndex = ref<number>(props.arrindex);

// All Pandas share same .png files, however based on their position on screen might need to be flipped horizontally
const imageDirection = calculateImageDirection(
  currentPosition.value,
  PLAYER_POSITION
);

// Use CSS propperty z-index to properly place Pandas on screen (behind each other / Player)
const zIndex = computed(() => {
  return imageDirection.value * (arrIndex.value + 1);
});

// Images used by Attacking Pandas:
const walkImages: Record<string, string> = {
  walk1: walk1Image,
  walk2: walk2Image,
};

// Create an object of Images (needed to show images faster to the user)
const walkAnimation: Record<string, HTMLImageElement> = loadImages(walkImages);

// Default image to show to user
const currentImage = ref<HTMLImageElement>(walkAnimation.walk1);

// Variable to track which frame from walkAnimation to show:
const frameIndex = ref<number>(0);

// Run the following on each screen refresh:
watch(
  () => gameStateStore.loopSignal,
  () => {
    if (gameStateStore.loopSignal) {
      // Show walking animation
      [currentImage.value, frameIndex.value] = animate(
        walkAnimation,
        frameIndex.value
      );

      // Check whether Panda was defeated by Player, if so, remove it
      if (
        findDirectionVector(currentPosition.value, PLAYER_POSITION).every(
          (coordinate, index) => coordinate === attackStore.attackVector[index]
        ) &&
        currentPosition.value.every(
          (coordinate, index) =>
            Math.abs(coordinate - PLAYER_POSITION[index]) < ATTACK_RANGE
        )
      ) {
        emit('remove-panda', props.id);
        scoreStore.score += 1;
      }

      // Update currentPosition
      currentPosition.value = move(currentPosition.value, PLAYER_POSITION);

      // Check whether panda reached player position, if so, game is over
      if (
        currentPosition.value.every(
          (coordinate, index) => coordinate === PLAYER_POSITION[index]
        )
      ) {
        scoreStore.saveScore();
        gameStateStore.gameState = 'gameOver';
      }
    }
  }
);
</script>

<template>
  <div class="attacking-panda">
    <div
      id="image-container"
      :style="[{ backgroundImage: `url(${currentImage.src})` }]"
    ></div>
  </div>
</template>

<style scoped>
.attacking-panda {
  position: absolute;
  top: v-bind("currentPosition[1] +'%'");
  left: v-bind("currentPosition[0] + '%'");
  transform: translate(-50%, -50%);
  z-index: v-bind(zIndex);
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
