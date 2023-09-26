<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { PLAYER_POSITION, MAMA_PANDAS_POSITION } from '@/constants';

import useScoreStore from '@/stores/scoreStore';

import PlayerComponent from '@/components/characters/PlayerComponent.vue';
import MamaPandaComponent from '@/components/characters/MamaPandaComponent.vue';
import AttackingPandaComponent from '@/components/characters/AttackingPandaComponent.vue';

import { findDirectionVector } from '@/components/commonFunctionality';

const scoreStore = useScoreStore();

type Position = {
  position: [number, number];
  id?: number;
};

// Get chosen difficulty from App.vue
const props = defineProps<{
  difficulty: number;
}>();

// Game starts with four Mama Pandas at the edges of the screen
const mamaPandas = ref<Position[]>([
  { position: MAMA_PANDAS_POSITION.top },
  { position: MAMA_PANDAS_POSITION.left },
  { position: MAMA_PANDAS_POSITION.right },
  { position: MAMA_PANDAS_POSITION.bottom },
]);

// During the gameplay, Attacking Pandas will be added or removed.
// Because of this, array index cannot be used reliably - introduce
// id variable to track each individual Panda

const attackingPandas = ref<Position[]>([]);

let id: number = 0;

let pandaSpawner: ReturnType<typeof setInterval>;

onMounted(() => {
  // Run below at an interval based on chosen difficulty
  pandaSpawner = setInterval(() => {
    // Select random Mama Panda
    const randomPandaIndex = Math.floor(
      Math.random() * mamaPandas.value.length
    );

    // Add Attacking Panda at the same position
    // as Mama and increment the id
    attackingPandas.value.push({
      position: mamaPandas.value[randomPandaIndex].position,
      id,
    });

    id += 1;

    // Move selected mamaPanda off screen
    const offScreenPosition: [number, number] = findDirectionVector(
      mamaPandas.value[randomPandaIndex].position,
      PLAYER_POSITION
    ).map((coordinate) => -60 * coordinate + 50) as [number, number];

    mamaPandas.value[randomPandaIndex].position = offScreenPosition;
  }, props.difficulty);
});

// Clear Interval once game is over:
onUnmounted(() => {
  clearInterval(pandaSpawner);
});

// Update Mama Panda position based on information received from MamaPandaComponent
function onPositionUpdate(
  index: number,
  updatedPosition: [number, number]
): void {
  mamaPandas.value[index].position = updatedPosition;
}

// If Player defeats a panda, remove it from the array
function removePanda(pandaID: number): void {
  attackingPandas.value = attackingPandas.value.filter(
    (panda) => panda.id !== pandaID
  );
}
</script>

<template>
  <div id="main-game">
    <div id="score">{{ scoreStore.score }}</div>
    <MamaPandaComponent
      v-for="(panda, index) in mamaPandas"
      :key="index"
      v-model:position="panda.position"
      @update:modelValuePosition="onPositionUpdate(index, $event)"
    />
    <AttackingPandaComponent
      v-for="(panda, index) in attackingPandas"
      :key="panda.id"
      :position="panda.position"
      :id="panda.id"
      :arrindex="index"
      @remove-panda="removePanda"
    />
    <PlayerComponent />
  </div>
</template>

<style scoped>
#main-game {
  position: relative;
  z-index: -1000;
  background-image: url('../assets/gamebackground.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#score {
  position: relative;
  top: 19%;
  left: 17.5%;
  width: 15%;
  height: 6%;
  font-size: 3.5vmin;
  font-family: Takeaway, sans-serif;
  text-align: center;
}
</style>
