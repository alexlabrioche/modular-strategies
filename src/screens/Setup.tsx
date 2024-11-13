import { Button } from "@/components/ui/button";
import { X, Timer, Plus, Pyramid, TimerReset } from "lucide-react";
import { INTERVAL_OPTIONS, MAX_PLAYERS, MIN_PLAYERS } from "@/constants/game";
import useGameStore from "@/hooks/useGameStore";

export const Setup: React.FC = () => {
  const {
    players,
    updatePlayerName,
    removePlayer,
    startGame,
    addPlayer,
    drawInterval,
    setDrawInterval,
    setPreparationTime,
    preparationTime,
  } = useGameStore();

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold my-4 flex items-center">
          <Pyramid className="w-6 h-6 mr-4" />
          Modular Strategies
        </h1>
        <label className="text-sm text-neutral-400 flex items-center gap-2 mb-2">
          <Timer className="w-4 h-4" />
          Phase de préparation
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
          {INTERVAL_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant="ghost"
              onClick={() => setPreparationTime(option.value)}
              className={`${
                preparationTime === option.value
                  ? "bg-green-900 text-neutral-100"
                  : "bg-transparent text-neutral-300"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <label className="text-sm text-neutral-400 flex items-center gap-2 mb-2">
          <TimerReset className="w-4 h-4" />
          Intervalle de tirage
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-2">
          {INTERVAL_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant="ghost"
              onClick={() => setDrawInterval(option.value)}
              className={`${
                drawInterval === option.value
                  ? "bg-green-900 text-neutral-100"
                  : "bg-transparent text-neutral-300"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-neutral-400">
          La phase de préparation est commune à tout le monde et dure le temps
          indiqué, les phases de tirages choisiront aléatoirement les différents
          joueurs parmis tous les joueurs présent et multiplieront l'intervalle
          par le nombre de joueurs séléctionnés.
        </p>
      </div>
      {players.map((player) => (
        <div key={player.id} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={player.name}
            onChange={(e) => updatePlayerName(player.id, e.target.value)}
            placeholder="Ajouter un joueur"
            className="flex-1 p-2 rounded bg-neutral-800 border-neutral-700 text-neutral-100"
          />
          {players.length > MIN_PLAYERS && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removePlayer(player.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      {players.length < MAX_PLAYERS && (
        <Button variant="ghost" className="w-full mb-12" onClick={addPlayer}>
          Ajouter un joueur
          <Plus className="w-4 h-4" />
        </Button>
      )}
      <Button
        onClick={startGame}
        disabled={players.some((player) => !player.name.trim())}
        className="w-full bg-green-700 hover:bg-green-600 text-green-100"
      >
        Commencer
      </Button>
    </div>
  );
};
