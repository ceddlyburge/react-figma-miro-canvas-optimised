import { useDraggable } from "@dnd-kit/core";
import { Card } from "./App";
import { ZoomTransform } from "d3-zoom";
import { RefObject } from "react";

export const Draggable = ({
  card,
  transformRef
}: {
  card: Card | undefined;
  transformRef: RefObject<ZoomTransform>
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
            transform: `translateX(${transform.x / (transformRef.current?.k ?? 1)}px) translateY(${transform.y / (transformRef.current?.k ?? 1)}px)`,
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
