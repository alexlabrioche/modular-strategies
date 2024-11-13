import { useState, useEffect } from "react";
import { Category, GameScreen, Player } from "./types/game";
import {
  DRAW_INTERVAL,
  INTERVAL_OPTIONS,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from "./constants/game";
import { strategies } from "./assets/strategies";
import { Setup } from "@/screens/Setup";
import { Game } from "@/screens/Game";

const StrategyGame: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>("setup");
  const [players, setPlayers] = useState<Player[]>([{ id: 1, name: "" }]);
  const [timer, setTimer] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStrategy, setCurrentStrategy] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [usedStrategies, setUsedStrategies] = useState<Set<string>>(new Set());
  const [isPreparationPhase, setIsPreparationPhase] = useState<boolean>(true);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(-1); // -1 for prep phase
  const [drawInterval, setDrawInterval] = useState<number>(
    INTERVAL_OPTIONS[0].value
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => {
          const newTime = t - 1;

          if (newTime === 0) {
            setIsPlaying(false);
            setScreen("setup");
            return 0;
          }

          if (isPreparationPhase && t === players.length * drawInterval) {
            setIsPreparationPhase(false);
            setCurrentPlayerIndex(0);
            drawStrategy();
          } else if (!isPreparationPhase && t % DRAW_INTERVAL === 0) {
            const nextPlayerIndex = currentPlayerIndex + 1;
            if (nextPlayerIndex < players.length) {
              setCurrentPlayerIndex(nextPlayerIndex);
              drawStrategy();
            }
          }
          return newTime;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsPlaying(false);
      setScreen("setup");
      setCurrentStrategy(null);
      setCategory(null);
      setUsedStrategies(new Set());
      setIsPreparationPhase(true);
      setCurrentPlayerIndex(-1);
      setCurrentPlayer(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPlaying,
    timer,
    isPreparationPhase,
    currentPlayerIndex,
    players.length,
  ]);

  useEffect(() => {
    if (currentPlayerIndex >= 0 && currentPlayerIndex < players.length) {
      setCurrentPlayer(players[currentPlayerIndex]);
    } else {
      setCurrentPlayer(null);
    }
  }, [currentPlayerIndex, players]);

  const drawStrategy = () => {
    const categories = Object.keys(strategies) as Category[];
    const availableStrategies = categories
      .flatMap((cat) =>
        strategies[cat].map((strategy) => ({ category: cat, strategy }))
      )
      .filter(
        (item) => !usedStrategies.has(`${item.category}-${item.strategy}`)
      );

    if (availableStrategies.length === 0) {
      setUsedStrategies(new Set());
      drawStrategy();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableStrategies.length);
    const chosen = availableStrategies[randomIndex];

    setUsedStrategies((prev) =>
      new Set(prev).add(`${chosen.category}-${chosen.strategy}`)
    );
    setCurrentStrategy(chosen.strategy);
    setCategory(chosen.category);
  };

  const startGame = () => {
    if (players.some((player) => !player.name.trim())) {
      return;
    }
    const totalTime = drawInterval * (players.length + 1);
    setTimer(totalTime);
    setScreen("play");
    setIsPreparationPhase(true);
    setCurrentPlayerIndex(-1);
    setUsedStrategies(new Set());
    drawStrategy();
    setIsPlaying(true);
  };

  const addPlayer = () => {
    if (players.length < MAX_PLAYERS) {
      setPlayers([...players, { id: players.length + 1, name: "" }]);
    }
  };

  const removePlayer = (id: number) => {
    if (players.length > MIN_PLAYERS) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(
      players.map((player) => (player.id === id ? { ...player, name } : player))
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const redrawCard = () => {
    drawStrategy();
  };

  if (screen === "setup") {
    return (
      <Setup
        players={players}
        updatePlayerName={updatePlayerName}
        removePlayer={removePlayer}
        startGame={startGame}
        addPlayer={addPlayer}
        drawInterval={drawInterval}
        setDrawInterval={setDrawInterval}
      />
    );
  }

  return (
    <Game
      timer={timer}
      isPlaying={isPlaying}
      isPreparationPhase={isPreparationPhase}
      currentPlayer={currentPlayer}
      setScreen={setScreen}
      currentStrategy={currentStrategy}
      category={category}
      redrawCard={redrawCard}
      formatTime={formatTime}
    />
  );
};

export default StrategyGame;
