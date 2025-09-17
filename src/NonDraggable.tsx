import { memo, useCallback } from "react";
import { Card } from "./App";

export const NonDraggable = memo(({
    card, setHoverCard,
}: {
    card: Card;
    setHoverCard(card: Card): void;
}) => {
    const onMouseEnter = useCallback(() => {
        console.log('onMouseEnter', card.id);
        performance.clearMarks();
        performance.clearMeasures();
        performance.mark('onMouseEnterStart');
        setHoverCard(card);
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                transformOrigin: "top left",
                top: `${card.coordinates.y}px`,
                left: `${card.coordinates.x}px`,
            }}
            id={card.id.toString()}
            className="card"
            onMouseEnter={onMouseEnter}
        >
            {card.text}
        </div>
    );
});
NonDraggable.displayName = 'NonDraggable'
