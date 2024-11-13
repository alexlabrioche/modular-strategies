import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { Category, GameScreen, Player } from "@/types/game";
import { INTERVAL_OPTIONS } from "@/constants/game";
import { strategies } from "@/assets/strategies";

interface GameState {
  // Base state
  screen: GameScreen;
  players: Player[];
  timer: number;
  isPlaying: boolean;
  currentStrategy: string | null;
  category: Category | null;
  isPreparationPhase: boolean;
  usedStrategies: Set<string>;
  drawInterval: number;
  intervalId: number | null;
  selectedPlayers: Player[]; // Store selected players for current round

  // Actions
  setScreen: (screen: GameScreen) => void;
  addPlayer: () => void;
  removePlayer: (id: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  drawStrategy: () => void;
  updateTimer: () => void;
  setDrawInterval: (interval: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newTime?: number) => void;
  selectPlayersForRound: () => void;
  cleanup: () => void;

  // Utility
  formatTime: (seconds: number) => string;
}

const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        screen: "setup",
        players: [{ id: 1, name: "" }],
        timer: 0,
        isPlaying: false,
        currentStrategy: null,
        category: null,
        isPreparationPhase: true,
        usedStrategies: new Set<string>(),
        drawInterval: INTERVAL_OPTIONS[0].value,
        intervalId: null,
        selectedPlayers: [],

        // Actions
        setScreen: (screen) => set({ screen }),

        startTimer: () => {
          const state = get();
          if (state.intervalId) {
            window.clearInterval(state.intervalId);
          }

          const newIntervalId = window.setInterval(() => {
            const currentState = get();
            if (!currentState.isPlaying) return;

            const newTime = currentState.timer - 1;

            if (newTime <= 0) {
              get().pauseTimer();

              if (currentState.isPreparationPhase) {
                set({ isPreparationPhase: false });
              }
              get().selectPlayersForRound();
              const state = get();
              const playTime =
                state.drawInterval * state.selectedPlayers.length;

              set({
                isPreparationPhase: false,
                timer: playTime,
                isPlaying: false,
              });

              get().drawStrategy();
              get().startTimer();
              return;
            }

            set({ timer: newTime });
          }, 1000);

          set({
            isPlaying: true,
            intervalId: newIntervalId,
          });
        },

        selectPlayersForRound: () => {
          const state = get();
          const playerCount = Math.floor(
            Math.random() * state.players.length + 1
          );

          // Shuffle players and select random count
          const shuffled = [...state.players]
            .sort(() => Math.random() - 0.5)
            .slice(0, playerCount);

          set({ selectedPlayers: shuffled });
        },

        startGame: () => {
          const state = get();
          if (state.players.some((player) => !player.name.trim())) {
            return;
          }

          set({
            timer: state.drawInterval,
            screen: "play",
            isPreparationPhase: true,
            usedStrategies: new Set(),
            currentStrategy: null,
            category: null,
            isPlaying: false,
            intervalId: null,
            selectedPlayers: [],
          });

          get().drawStrategy();
          get().startTimer();
        },

        formatTime: (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, "0")}`;
        },

        pauseTimer: () => {
          const state = get();
          // Clear interval if it exists
          if (state.intervalId) {
            window.clearInterval(state.intervalId);
          }

          set({
            isPlaying: false,
            intervalId: null,
          });
        },

        resetTimer: (newTime?: number) => {
          const state = get();
          // Clear existing interval
          if (state.intervalId) {
            window.clearInterval(state.intervalId);
          }

          set({
            timer: newTime ?? state.drawInterval,
            isPlaying: false,
            intervalId: null,
          });
        },

        // Cleanup function for unmounting
        cleanup: () => {
          const state = get();
          if (state.intervalId) {
            window.clearInterval(state.intervalId);
          }
        },

        setDrawInterval: (interval: number) => {
          set({ drawInterval: interval });
          // If game is in progress, reset timer with new interval
          const state = get();
          if (state.isPlaying) {
            state.resetTimer(interval);
            state.startTimer();
          }
        },

        addPlayer: () =>
          set((state) => ({
            players: [
              ...state.players,
              { id: Math.max(...state.players.map((p) => p.id)) + 1, name: "" },
            ],
          })),

        removePlayer: (id) =>
          set((state) => ({
            players: state.players.filter((player) => player.id !== id),
          })),

        updatePlayerName: (id, name) =>
          set((state) => ({
            players: state.players.map((player) =>
              player.id === id ? { ...player, name } : player
            ),
          })),

        pauseGame: () => set({ isPlaying: false }),

        resumeGame: () => set({ isPlaying: true }),

        resetGame: () => {
          get().cleanup();
          set({
            screen: "setup",
            timer: 0,
            isPlaying: false,
            currentStrategy: null,
            category: null,
            isPreparationPhase: true,
            usedStrategies: new Set<string>(),
          });
        },

        drawStrategy: () => {
          const categories = Object.keys(strategies) as Category[];
          const state = get();

          const availableStrategies = categories
            .flatMap((cat) =>
              strategies[cat].map((strategy) => ({ category: cat, strategy }))
            )
            .filter(
              (item) =>
                !state.usedStrategies.has(`${item.category}-${item.strategy}`)
            );

          if (availableStrategies.length === 0) {
            set({ usedStrategies: new Set() });
            get().drawStrategy();
            return;
          }

          const randomIndex = Math.floor(
            Math.random() * availableStrategies.length
          );
          const chosen = availableStrategies[randomIndex];

          set((state) => ({
            usedStrategies: new Set(state.usedStrategies).add(
              `${chosen.category}-${chosen.strategy}`
            ),
            currentStrategy: chosen.strategy,
            category: chosen.category,
          }));
        },

        updateTimer: () => {
          const state = get();
          const newTimer = state.timer - 1;

          if (newTimer < 0) {
            if (state.isPreparationPhase) {
              set({
                isPreparationPhase: false,
              });
              state.resetTimer(state.drawInterval);
              state.startTimer();
              return;
            }

            state.drawStrategy();
            state.resetTimer(state.drawInterval);
            state.startTimer();
            return;
          }

          set({ timer: newTimer });
        },
      }),
      {
        name: "strategy-game-storage",
        partialize: (state) => ({
          players: state.players,
          usedStrategies: Array.from(state.usedStrategies),
          drawInterval: state.drawInterval,
        }),
      }
    )
  )
);

// Optional: Cleanup on app unmount
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    useGameStore.getState().cleanup();
  });
}

export default useGameStore;
