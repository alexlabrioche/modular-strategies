import { Setup } from "@/screens/Setup";
import { Game } from "@/screens/Game";
import useGameStore from "./hooks/useGameStore";

const StrategyGame: React.FC = () => {
  const { screen } = useGameStore();

  if (screen === "setup") {
    return <Setup />;
  }

  return <Game />;
};

export default StrategyGame;
