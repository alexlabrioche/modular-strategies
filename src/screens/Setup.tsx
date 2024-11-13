import { Button } from "@/components/ui/button";
import { X, Timer, Plus } from "lucide-react";
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
  } = useGameStore();

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Configuration des Joueurs</h1>
      <label className="text-sm text-neutral-400 flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4" />
        Intervalle de tirage
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
        {INTERVAL_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="sm"
            onClick={() => setDrawInterval(option.value)}
            className={`${
              drawInterval === option.value
                ? "bg-neutral-700 text-neutral-100"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            {option.label}
          </Button>
        ))}
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
        <Button variant="ghost" className="w-full mb-4" onClick={addPlayer}>
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
