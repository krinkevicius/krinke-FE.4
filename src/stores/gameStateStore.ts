import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const useGameStateStore = defineStore('state', () => {
  const gameState = ref('mainMenu');
  const loopSignal = ref(false);

  // While the game is running, request a screen refresh
  // and tell character Components to run their taks via loopSignal
  watch(gameState, () => {
    if (gameState.value === 'gameStarted') {
      const loop = () => {
        requestAnimationFrame(() => {
          loopSignal.value = true;
          setTimeout(() => {
            loopSignal.value = false;
          }, 10);
          if (gameState.value === 'gameStarted') {
            loop();
          } else {
            loopSignal.value = false;
          }
        });
      };

      // Call loop initially
      loop();
    }
  });

  return { gameState, loopSignal };
});

export default useGameStateStore;
