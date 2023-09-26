import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MAX_SPEED } from '@/constants';

const useScoreStore = defineStore('score', () => {
  const score = ref<number>(0);

  // Calculate the speed for Pandas to move forward Player based on score
  const speed = computed(() => {
    if (score.value / 100 + 0.2 > MAX_SPEED) return MAX_SPEED;
    return score.value / 100 + 0.2;
  });

  function saveScore() {
    // Get the scores from local storage
    const storedData = localStorage.getItem('scores');
    const scores = storedData ? (JSON.parse(storedData) as number[]) : [];

    // Add the last score and save it back to local storage
    scores.push(score.value);
    localStorage.setItem('scores', JSON.stringify(scores));
  }

  function getHighScores(n: number): number[] {
    // Get the scores from local storage
    const storedData = localStorage.getItem('scores');

    if (storedData) {
      // Parse the stored scores into an array and sort them in descending order
      const scores: number[] = JSON.parse(storedData);

      scores.sort((a, b) => b - a);

      // Return the top n scores, or all scores if n is larger than the array length
      return scores.slice(0, n > scores.length ? scores.length : n);
    }
    // Return a zero if 'scores' is not found in localStorage
    return [0];
  }

  return { score, speed, saveScore, getHighScores };
});

export default useScoreStore;
