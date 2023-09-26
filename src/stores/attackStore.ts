import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { ATTACK_COOLDOWN } from '@/constants';

const useAttackStore = defineStore('attack', () => {
  // Variable will get updates either from
  // Player Character or Mobile Controls
  const attackDirection = ref<string | null>(null);

  const attackVectors = {
    up: [0, 1],
    left: [1, 0],
    right: [-1, 0],
    down: [0, -1],
    null: [0, 0],
  };

  // Based on attackDirection return one of the values from above object.
  // Will be used by Attacking Panda to check whether the user is attacking correct direction.
  const attackVector = computed<number[]>(() => {
    const direction = attackDirection.value as keyof typeof attackVectors;
    return attackVectors[direction] || attackVectors.null;
  });

  // Add attack cooldown so that user couldn't spam buttons
  watch(attackDirection, () => {
    if (attackDirection.value !== null) {
      setTimeout(() => {
        attackDirection.value = null;
      }, ATTACK_COOLDOWN);
    }
  });

  return { attackDirection, attackVector };
});

export default useAttackStore;
