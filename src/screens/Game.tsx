import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category, Player } from "@/types/game";
import { RefreshCcw } from "lucide-react";

const categoryNames = {
  philosophical: "Philosophique",
  soundscape: "Technique",
  compositional: "Composition",
  experimental: "Expérimental",
  performance: "Performance",
};

const categoryColors = {
  philosophical: "bg-blue-950 border-blue-800",
  soundscape: "bg-green-950 border-green-800",
  compositional: "bg-purple-950 border-purple-800",
  experimental: "bg-red-950 border-red-800",
  performance: "bg-amber-950 border-amber-800",
};

interface GameProps {
  timer: number;
  isPlaying: boolean;
  isPreparationPhase: boolean;
  currentPlayer: Player | null;
  setScreen: (screen: "setup" | "play") => void;
  currentStrategy: string | null;
  category: Category | null;
  formatTime: (seconds: number) => string;
  redrawCard: () => void;
}

export const Game = ({
  timer,
  redrawCard,
  isPreparationPhase,
  currentPlayer,
  setScreen,
  currentStrategy,
  category,
  formatTime,
}: GameProps) => (
  <div className="w-full max-w-2xl mx-auto p-4 space-y-4 bg-gray-950">
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-100">
            Temps Restant: {formatTime(timer)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={redrawCard}
              className="text-gray-400 hover:text-gray-100"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Nouveau tirage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScreen("setup")}
              className="border-gray-700 hover:bg-gray-800 text-gray-300"
            >
              Nouvelle Partie
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStrategy && category ? (
          <div
            className={`p-8 rounded-lg border-2 ${categoryColors[category]} bg-gray-800 transition-all`}
            key={`${category}-${currentStrategy}`}
          >
            <div className="flex w-full justify-between">
              <div className="text-sm text-gray-400 mb-2">
                {isPreparationPhase
                  ? "Phase de préparation"
                  : categoryNames[category]}
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {isPreparationPhase
                  ? "Tous les joueurs"
                  : `Tour de ${currentPlayer?.name}`}
              </div>
            </div>
            <div className="text-xl font-medium text-center text-gray-100">
              {currentStrategy}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
            Tirage de la première carte...
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);
