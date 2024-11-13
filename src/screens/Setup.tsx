import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Timer } from "lucide-react";
import { INTERVAL_OPTIONS, MAX_PLAYERS, MIN_PLAYERS } from "@/constants/game";
import { Player } from "@/types/game";

interface SetupProps {
  players: Player[];
  updatePlayerName: (id: number, name: string) => void;
  removePlayer: (id: number) => void;
  startGame: () => void;
  addPlayer: () => void;
  drawInterval: number;
  setDrawInterval: (interval: number) => void;
}

export const Setup: React.FC<SetupProps> = ({
  players,
  updatePlayerName,
  removePlayer,
  startGame,
  addPlayer,
  drawInterval,
  setDrawInterval,
}) => (
  <div className="w-full max-w-2xl mx-auto p-4 space-y-4 bg-gray-950">
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-100">
          Configuration des Joueurs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Draw Interval Selection */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400 flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Intervalle de tirage
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {INTERVAL_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={drawInterval === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDrawInterval(option.value)}
                className={`${
                  drawInterval === option.value
                    ? "bg-gray-700 text-gray-100"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                placeholder={`Joueur ${player.id}`}
                className="flex-1 p-2 rounded bg-gray-800 border-gray-700 text-gray-100"
              />
              {players.length > MIN_PLAYERS && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlayer(player.id)}
                  className="text-gray-400 hover:text-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          {players.length < MAX_PLAYERS && (
            <Button
              variant="outline"
              onClick={addPlayer}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Ajouter un joueur
            </Button>
          )}
        </div>

        <Button
          onClick={startGame}
          disabled={players.some((player) => !player.name.trim())}
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          Commencer
        </Button>
      </CardContent>
    </Card>
  </div>
);
