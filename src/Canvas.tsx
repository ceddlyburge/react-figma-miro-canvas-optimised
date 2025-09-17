import { DndContext, useDroppable } from "@dnd-kit/core";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import { select } from "d3-selection";
import { ZoomTransform, zoom } from "d3-zoom";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Card } from "./App";
import { Draggable } from "./Draggable";
import { Cover } from "./Cover";
import { AllCards } from "./AllCards";

export const Canvas = memo(({
  cards,
  setCards,
  transform,
  setTransform,
}: {
  cards: Card[];
  setCards: (cards: Card[]) => void;
  transform: ZoomTransform;
  setTransform(transform: ZoomTransform): void;
}) => {
  const [disableMouseEnter, setDisableMouseEnter] = useState(false);

  const [hoverCard, setHoverCard] = useState<Card | undefined>(undefined)


  const setDragging = useCallback(() => {
    setDisableMouseEnter(true);
    console.log('startDragging');
    performance.clearMarks();
    performance.clearMeasures();
    performance.mark('startDraggingStart');
  }, [setDisableMouseEnter])

  const updateDraggedCardPosition = useCallback(({ delta, active }: DragEndEvent) => {
    setDisableMouseEnter(false);

    if (!delta.x && !delta.y) return;

    console.log('endDragging');
    performance.clearMarks();
    performance.clearMeasures();
    performance.mark('endDraggingStart');

    setCards(
      cards.map((card) => {
        if (card.id === active.id) {

          const newCard = {
            ...card,
            coordinates: {
              x: card.coordinates.x + delta.x / (transform.k ?? 1),
              y: card.coordinates.y + delta.y / (transform.k ?? 1),
            },
          };

          setHoverCard(newCard);
          return newCard;
        }
        return card;
      })
    );

  }, [cards, setCards, transform]);

  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  useEffect(() => {
    try {
      performance.mark('onMouseEnterEnd');
      performance.measure('onMouseEnter', 'onMouseEnterStart', 'onMouseEnterEnd');
      const onMouseEnterMeasure = performance.getEntriesByName('onMouseEnter')?.[0];
      console.log('onMouseEnter', onMouseEnterMeasure?.duration);
    } catch { }

    try {
      performance.mark('startDraggingEnd');
      performance.measure('startDragging', 'startDraggingStart', 'startDraggingEnd');
      const startDraggingMeasure = performance.getEntriesByName('startDragging')?.[0];
      console.log('startDragging', startDraggingMeasure?.duration);
    } catch { }

    try {
      performance.mark('endDraggingEnd');
      performance.measure('endDragging', 'endDraggingStart', 'endDraggingEnd');
      const endDraggingMeasure = performance.getEntriesByName('endDragging')?.[0];
      console.log('endDragging', endDraggingMeasure?.duration);
    } catch { }

    performance.clearMarks();
    performance.clearMeasures();
  })

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const updateAndForwardRef = (div: HTMLDivElement) => {
    canvasRef.current = div;
    setNodeRef(div);
  };

  // create the d3 zoom object, and useMemo to retain it for rerenders
  const zoomBehavior = useMemo(() => zoom<HTMLDivElement, unknown>(), []);

  // update the transform when d3 zoom notifies of a change
  const updateTransform = useCallback(
    ({ transform }: { transform: ZoomTransform }) => {

      try {
        performance.mark('zoomingOrPanningEnd');
        performance.measure('zoomingOrPanning', 'zoomingOrPanningStart', 'zoomingOrPanningEnd');
        const zoomingOrPanningMeasure = performance.getEntriesByName('zoomingOrPanning')?.[0];
        console.log('zoomingOrPanning', zoomingOrPanningMeasure?.duration);
      } catch { }
      performance.clearMarks();
      performance.clearMeasures();
      performance.mark('zoomingOrPanningStart');

      setTransform(transform);
    },
    [setTransform]
  );
  useEffect(() => {
    try {
      performance.mark('zoomingOrPanningEnd');
      performance.measure('zoomingOrPanning', 'zoomingOrPanningStart', 'zoomingOrPanningEnd');
      const zoomingOrPanningMeasure = performance.getEntriesByName('zoomingOrPanning')?.[0];
      console.log('zoomingOrPanning', zoomingOrPanningMeasure?.duration);
    } catch { }
    performance.clearMarks();
    performance.clearMeasures();
  });

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    // get transform change notifications from d3 zoom
    zoomBehavior.on("zoom", updateTransform);
    zoomBehavior.on("start", () => {
      console.log('zoomingOrPanning');
      performance.clearMarks();
      performance.clearMeasures();
      performance.mark('zoomingOrPanningStart');

      setDisableMouseEnter(true);
    }
    );
    zoomBehavior.on("end", () => {
      setDisableMouseEnter(false);
    });

    // attach d3 zoom to the canvas div element, which will handle
    // mousewheel, gesture and drag events automatically for pan / zoom
    select<HTMLDivElement, unknown>(canvasRef.current).call(zoomBehavior);
  }, [zoomBehavior, canvasRef, updateTransform]);

  return (
    <div ref={updateAndForwardRef} className="canvasWindow">
      <div
        id="canvas"
        className="canvas"
        style={{
          // apply the transform from d3
          transformOrigin: "top left",
          transform: `translateX(${transform.x}px) translateY(${transform.y}px) scale(${transform.k})`,
          position: "relative",
          height: "600px",
        }}
      >
        <div
          // otherise onMouseEnter gets triggered when dragging a card if you move the mouse fast 
          // and it outpaces the card, which ends up in setHoverCard being called for a different
          // card.
          id="canvasInner"
          style={{ pointerEvents: disableMouseEnter ? "none" : "auto" }}
        >
          <AllCards cards={cards} setHoverCard={setHoverCard} />
        </div>
        <DndContext onDragEnd={updateDraggedCardPosition} onDragStart={setDragging}>
          <Cover card={hoverCard} />
          <Draggable card={hoverCard} canvasTransform={transform} />
        </DndContext>
      </div>
    </div>
  );
});
Canvas.displayName = 'Canvas';