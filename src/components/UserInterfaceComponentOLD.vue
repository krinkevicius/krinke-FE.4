<script setup lang="ts">
import { ref, onMounted } from 'vue';

import MainGame from '@/components/MainGame.vue';
import useGameStateStore from '@/stores/gameStateStore';
import useAttackStore from '@/stores/attackStore';
import useScoreStore from '@/stores/scoreStore';

const gameStateStore = useGameStateStore();
const attackStore = useAttackStore();
const scoreStore = useScoreStore();

// By default dificulty is set to medium (pandas will attack every 3000ms)
const difficulty = ref(3000);

function chooseDifficulty(selectedDifficulty: number): void {
  // Set the selected difficulty, reset score and start the game
  difficulty.value = selectedDifficulty;
  scoreStore.score = 0;
  gameStateStore.gameState = 'gameStarted';
}

const areMobileControlsNeeded = ref(window.innerWidth <= 500);

const updateScreenSize = () => {
  areMobileControlsNeeded.value = window.innerWidth <= 500;
};

function controlPlayerAttack(direction: string) {
  if (attackStore.attackDirection === null) {
    attackStore.attackDirection = direction;
  }
}

onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
});
</script>

<template>
  <div id="game-screen">
    <MainGame
      v-if="gameStateStore.gameState === 'gameStarted'"
      :difficulty="difficulty"
    />
    <div
      class="game-menu"
      id="main-menu"
      v-else-if="gameStateStore.gameState === 'mainMenu'"
    >
      <h1>Evil Pandas</h1>
      <div class="button-wrapper">
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'chooseDifficulty'"
        >
          Play
        </button>
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'howToPlay'"
        >
          How to Play
        </button>
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'scores'"
        >
          High Scores
        </button>
      </div>
    </div>
    <div
      class="game-menu"
      id="how-to-play"
      v-else-if="gameStateStore.gameState === 'howToPlay'"
    >
      <h2>How to Play</h2>
      <p id="instructions">
        Pandas will be attacking you from different directions. Press the
        corresponding arrow keys to defend yourself. Pandas will atack more
        frequently based on difficulty.
        <br /><br />
        No real pandas were harmed in the making of this game.
      </p>
      <div class="button-wrapper">
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'mainMenu'"
        >
          Back
        </button>
      </div>
    </div>
    <div
      class="game-menu"
      id="scores"
      v-else-if="gameStateStore.gameState === 'scores'"
    >
      <h2>High Scores</h2>
      <div>
        <p v-for="(score, index) in scoreStore.getHighScores(3)" :key="score">
          {{ index + 1 }}. {{ score }}
        </p>
      </div>
      <div class="button-wrapper">
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'mainMenu'"
        >
          Back
        </button>
      </div>
    </div>
    <div
      class="game-menu"
      id="choose-difficulty"
      v-else-if="gameStateStore.gameState === 'chooseDifficulty'"
    >
      <h2>Choose Difficulty</h2>
      <div class="button-wrapper">
        <button
          type="button"
          class="menu-button"
          @click="chooseDifficulty(4000)"
        >
          Easy
        </button>
        <button
          type="button"
          class="menu-button"
          @click="chooseDifficulty(3000)"
        >
          Medium
        </button>
        <button
          type="button"
          class="menu-button"
          @click="chooseDifficulty(2000)"
        >
          Hard
        </button>
      </div>
    </div>
    <div
      class="game-menu"
      id="game-over"
      v-else-if="gameStateStore.gameState === 'gameOver'"
    >
      <h2>Game Over!</h2>
      <p>
        Your score: {{ scoreStore.score }}
        <br />
        Your highest score: {{ scoreStore.getHighScores(1)[0] }}
      </p>
      <div class="button-wrapper">
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'chooseDifficulty'"
        >
          Play again?
        </button>
        <button
          type="button"
          class="menu-button"
          @click="gameStateStore.gameState = 'mainMenu'"
        >
          Main menu
        </button>
      </div>
    </div>
  </div>
  <div id="mobile-controls" v-if="areMobileControlsNeeded">
    <button type="button" class="button up" @click="controlPlayerAttack('up')">
      ▲
    </button>
    <button
      type="button"
      class="button left"
      @click="controlPlayerAttack('left')"
    >
      ◄
    </button>
    <button
      type="button"
      class="button right"
      @click="controlPlayerAttack('right')"
    >
      ►
    </button>
    <button
      type="button"
      class="button down"
      @click="controlPlayerAttack('down')"
    >
      ▼
    </button>
  </div>
</template>

<style scoped>
#game-screen {
  border: 1rem solid black;
  border-image: url('../assets/border.png') 36%;
  border-image-repeat: round;
  width: 90vmin;
  height: 90vmin;
  overflow: hidden;
}

h1,
h2 {
  margin: 0;
  font-family: Takeaway, sans-serif;
  text-align: center;
}

h1 {
  font-size: 20vmin;
}

h2 {
  font-size: 12vmin;
}

p {
  padding: 10px;
  font-size: 4vmin;
}

.game-menu {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  background-color: #8bc046;
  padding-top: 10px;
  width: 100%;
  height: 100%;
  text-align: center;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 3vmin;
}

.menu-button {
  cursor: pointer;
  box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 20%);
  border: 2px solid black;
  width: 50%;
  min-width: 16vmin;
  height: 8vmin;
  font-size: 100%;
}

#mobile-controls {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin: 0 auto;
  width: 150px;
}

.button {
  cursor: pointer;
  border: 1px solid black;
  border-radius: 50%;
  background-color: rgb(220 220 220 / 70%);
  width: 40px;
  height: 40px;
  color: black;
}

.up {
  grid-area: 1 / 2;
}

.left {
  grid-area: 2 / 1;
}

.right {
  grid-area: 2 / 3;
}

.down {
  grid-area: 3 / 2;
}
</style>
