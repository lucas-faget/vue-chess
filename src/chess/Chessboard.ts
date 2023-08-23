import type { Position } from "./coordinates/Position";
import type { PlayerColor } from "./enums/PlayerColor";
import { PieceName } from "./enums/PieceName";
import { Square } from "./Square";
import type { JsonData } from "./types/JsonData";

export class Chessboard
{
    ranks: string[];
    files: string[];
    reversedRanks: string[];
    reversedFiles: string[];
    squares: Map<string, Square> = new Map();

    constructor(json: JsonData)
    {
        this.ranks = json.ranks;
        this.files = json.files;

        this.reversedRanks = [...this.ranks].reverse();
        this.reversedFiles = [...this.files].reverse();

        // Fill the chessboard
        for (const [rankIndex, rank] of this.ranks.entries()) {
            for (const [fileIndex, file] of this.files.entries())
            {
                let square: Square = new Square(
                    file + rank, 
                    { x: rankIndex, y: fileIndex }
                );

                if (json.pieces[square.name]) {
                    let pieceName : PieceName = json.pieces[square.name].name;
                    let playerColor: PlayerColor = json.pieces[square.name].color;
                    square.setPiece(pieceName, playerColor);
                }

                this.squares.set(square.name, square);
            }
        }

        if (json.voidSquares) {
            for (const squareName of json.voidSquares) {
                this.squares.delete(squareName);
            }
        }
    }

    getSquareByName(squareName: string): Square|null
    {
        return this.squares.get(squareName) ?? null;
    }

    getSquareByPosition(position: Position): Square|null
    {
        if (position.x < 0 || position.y < 0 || position.x >= this.ranks.length || position.y >= this.files.length) {
            return null;
        }

        return this.squares.get(this.files[position.y] + this.ranks[position.x])!;
    }

    getNextSquare(square: Square, direction: Position, gap: number = 1): Square|null
    {
        return this.getSquareByPosition({
            x: square.position.x + gap * direction.x,
            y: square.position.y + gap * direction.y,
        });
    }

    searchKingSquare(color: PlayerColor): Square|null
    {
        for (const square of this.squares.values()) {
            if (square.isOccupiedByPieceName(PieceName.King) && square.isOccupiedByAlly(color)) {
                return square;
            }
        }

        return null;
    }
}
