"use client";

import { GripVertical } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

/**
 * Linktree-style reorderable list for the dashboard sections.
 *
 * `SortableSection` owns the DndContext and reports the reordered indices, so
 * a form can simply `useFieldArray().move(from, to)`. `SortableItem` renders
 * the grip handle and the displaced-during-drag transform; the wrapped card
 * itself stays untouched.
 */
export function SortableSection({
  ids,
  onReorder,
  children,
}: {
  ids: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  children: ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) {
      return;
    }

    onReorder(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 30 : undefined,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-1.5">
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        title="Drag to reorder"
        className="self-center inline-flex h-8 w-6 shrink-0 touch-none items-center justify-center rounded-md text-(--lf-muted) cursor-grab active:cursor-grabbing hover:text-(--lf-ink) hover:bg-(--lf-surface) transition-colors duration-150"
      >
        <GripVertical size={14} />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
