import { Button } from "@/components/ui/button";
import { Dices, RefreshCcw } from "lucide-react";
import useGameStore from "@/hooks/useGameStore";

const categoryNames = {
  philosophical: "Philosophique",
  soundscape: "Technique",
  compositional: "Composition",
  experimental: "Expérimental",
  performance: "Performance",
};

const categoryColors = {
  philosophical: "bg-blue-950",
  soundscape: "bg-green-950",
  compositional: "bg-purple-950",
  experimental: "bg-orange-950",
  performance: "bg-pink-950",
};

export const Game: React.FC = () => {
  const {
    timer,
    drawStrategy,
    isPreparationPhase,
    resetGame,
    currentStrategy,
    category,
    formatTime,
    selectedPlayers,
    players,
  } = useGameStore();

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="container">
        <h1 className="text-8xl text-neutral-100 text-center font-black font-mono pt-24">
          {formatTime(timer)}
        </h1>
      </div>

      {currentStrategy && category && (
        <div
          className={`p-2 rounded-3xl rounded-b-none ${categoryColors[category]}`}
          key={`${category}-${currentStrategy}`}
        >
          <div className="text-4xl font-medium text-center text-neutral-100 py-28">
            {currentStrategy}
          </div>
          {category && (
            <div className="text-sm text-neutral-400">
              {categoryNames[category]}
            </div>
          )}
          {category && (
            <div className="text-3xl text-neutral-300 font-semibold mb-8">
              {isPreparationPhase
                ? "Tous les joueurs"
                : selectedPlayers.length === players.length
                ? "Tous les joueurs"
                : selectedPlayers.map((player) => player.name).join(", ")}
            </div>
          )}
          <div className="flex gap-2 justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400"
              onClick={drawStrategy}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Nouveau tirage
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400"
              onClick={resetGame}
            >
              Nouvelle Partie
              <Dices className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
