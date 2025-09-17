import { useDraggable } from "@dnd-kit/core";
import { Card } from "./App";
import { ZoomTransform } from "d3-zoom";

export const Draggable = ({
  card,
  canvasTransform
}: {
  card: Card | undefined;
  canvasTransform: ZoomTransform
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    id: card?.id ?? 0,
  });

  return (
    <div
      id="draggable"
      className="card"
      style={{
        position: "absolute",
        transformOrigin: "top left",
        top: `${card?.coordinates.y ?? 0}px`,
        left: `${card?.coordinates.x ?? 0}px`,
        display: card === undefined ? "none" : "block",
        ...(transform
          ? {
            // temporary change to this position when dragging
            transform: `translateX(${transform.x / (canvasTransform.k)}px) translateY(${transform.y / (canvasTransform.k)}px)`,
          }
          : {}),
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      // this stops the event bubbling up and triggering the canvas drag
      onPointerDown={(e) => {
        listeners?.onPointerDown?.(e);
        e.preventDefault();
      }}
    >
      {card?.text ?? ""}
    </div>
  );
};
