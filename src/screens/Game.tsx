import { Button } from "@/components/ui/button";
import { Dices, RefreshCcw } from "lucide-react";
import useGameStore from "@/hooks/useGameStore";
import { formatTime } from "@/utils/formatTime";

const categoryNames = {
  philosophical: "Philosophique",
  soundscape: "Technique",
  compositional: "Composition",
  experimental: "Expérimental",
  performance: "Performance",
};

const categoryColors = {
  philosophical: "from-blue-900 to-blue-950",
  soundscape: "from-green-900 to-green-950",
  compositional: "from-purple-900 to-purple-950",
  experimental: "from-orange-900 to-orange-950",
  performance: "from-pink-900 to-pink-950",
};

export const Game: React.FC = () => {
  const {
    timer,
    drawStrategy,
    isPreparationPhase,
    resetGame,
    currentStrategy,
    category,
    selectedPlayers,
    players,
    usedStrategies,
  } = useGameStore();

  const last = Array.from(usedStrategies)
    .slice(-6, -1)
    .map((strategyKey) => {
      const [category, strategy] = strategyKey.split("___");
      return { category, strategy };
    });

  return (
    <div className="h-dvh relative flex flex-col justify-between">
      <div className="h-full flex flex-col justify-between">
        <div className=" container grid place-items-center">
          <h1 className="pt-4 text-8xl text-neutral-100 text-center font-black font-mono">
            {formatTime(timer)}
          </h1>
        </div>
      </div>
      {currentStrategy && category && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container space-y-1 pb-4">
            {last.map((item, index) => (
              <div
                key={`${item.category}-${item.strategy}`}
                className={`text-sm truncate whitespace-nowrap overflow-hidden ${
                  index === 0
                    ? "opacity-20"
                    : index === 1
                    ? "opacity-30"
                    : index === 2
                    ? "opacity-40"
                    : index === 3
                    ? "opacity-50"
                    : "opacity-60"
                }`}
              >
                {item.strategy}
              </div>
            ))}
          </div>
          <div
            className={`container rounded-3xl rounded-b-none bg-gradient-to-br ${categoryColors[category]}`}
            key={`${category}-${currentStrategy}`}
          >
            <div className="text-4xl font-medium text-center text-neutral-100 h-72 flex items-center justify-center leading-normal">
              {currentStrategy}
            </div>
            {category && (
              <div className="text-sm text-neutral-400">
                {categoryNames[category]}
              </div>
            )}
            {category && (
              <div className="text-3xl text-neutral-300 font-semibold pb-4">
                {isPreparationPhase
                  ? "Tous les joueurs"
                  : selectedPlayers.length === players.length
                  ? "Tous les joueurs"
                  : selectedPlayers.map((player) => player.name).join(", ")}
              </div>
            )}
            <div className="flex gap-2 justify-between pb-2">
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
        </div>
      )}
    </div>
  );
};
