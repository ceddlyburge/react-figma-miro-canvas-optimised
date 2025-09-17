import { memo } from "react";
import { Card } from "./App";
import { NonDraggable } from "./NonDraggable";

// Always display all the cards, even when one becomes draggable, which makes it performant with memo
// When the mouse is over a card, a Draggable is placed over the top of the NonDraggable one and hides it.
export const AllCards = memo(({
    cards, setHoverCard,
}: {
    cards: Card[];
    setHoverCard(card: Card): void;
}) => {
    return (<>
        {cards.map((card) => {
            return (<NonDraggable card={card} key={card.id} setHoverCard={setHoverCard} />);
        })}
    </>);
});
AllCards.displayName = 'AllCards';
