'use client';

type GameStatusProps = {
    playerScore: number;
    computerScore: number;
};

export default function GameStatus({ playerScore, computerScore }: GameStatusProps) {
    return (
        <div className="text-center mt-4 space-y-2 text-white text-lg font-semibold">
            Your score: {playerScore} | Stoopid score: {computerScore}
        </div>
    );
}