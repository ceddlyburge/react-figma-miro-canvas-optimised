import { Card } from "./App";

export const Cover = ({
    card,
}: {
    card: Card | undefined;
}) => (
    <div
        id="cover"
        className="card cardCover"
        style={{
            position: "absolute",
            transformOrigin: "top left",
            top: `${card?.coordinates.y ?? 0}px`,
            left: `${card?.coordinates.x ?? 0}px`,
            display: card === undefined ? "none" : "block",
        }}
    >
        {card?.text ?? ""}
    </div>);
