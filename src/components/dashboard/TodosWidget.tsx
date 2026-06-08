"use client";

import { useState, useTransition } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { Check, RefreshCw, GripVertical, X, Pencil, Plus } from "lucide-react";
import { AreaTag } from "@/components/ui/AreaTag";
import { AREA_BORDER } from "@/lib/constants";
import type { Todo } from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
  addTodo,
  deleteTodo,
  regenerateTodos,
  setTodoCompleted,
  updateTodoText,
} from "@/app/actions/todos";

function TodoRow({
  todo,
  onToggle,
  onEdit,
  onRemove,
}: {
  todo: Todo;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const commit = () => {
    onEdit(draft.trim() || todo.text);
    setEditing(false);
  };

  return (
    <Reorder.Item
      value={todo}
      id={todo.id}
      className={cn(
        "card group flex items-center gap-4 p-5 transition-colors",
        todo.completed ? "bg-accent/[0.04]" : "card-hover"
      )}
      style={{ borderLeft: `3px solid ${AREA_BORDER[todo.area]}` }}
      animate={{ scale: todo.completed ? 1.012 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      whileDrag={{ scale: 1.02 }}
    >
      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />

      <button
        onClick={onToggle}
        aria-label="Marcar completado"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          todo.completed
            ? "border-accent bg-accent text-bg-primary"
            : "border-border hover:border-accent"
        )}
      >
        <AnimatePresence>
          {todo.completed && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full bg-transparent text-sm outline-none"
          />
        ) : (
          <button
            onClick={onToggle}
            className={cn(
              "block w-full truncate text-left text-sm transition-colors",
              todo.completed
                ? "text-accent line-through decoration-accent/70"
                : "text-text-primary"
            )}
          >
            {todo.text}
          </button>
        )}
      </div>

      <AreaTag area={todo.area} />
      {todo.aiGenerated && (
        <span className="hidden text-[10px] text-text-muted sm:inline">IA</span>
      )}

      <button
        onClick={() => setEditing(true)}
        aria-label="Editar"
        className="opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={onRemove}
        aria-label="Eliminar"
        className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </Reorder.Item>
  );
}

export function TodosWidget({ initial }: { initial: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initial);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const patchLocal = (id: string, patch: Partial<Todo>) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const toggle = (id: string) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    const next = !current.completed;
    patchLocal(id, { completed: next });
    startTransition(() => {
      void setTodoCompleted(id, next);
    });
  };

  const edit = (id: string, text: string) => {
    patchLocal(id, { text });
    startTransition(() => {
      void updateTodoText(id, text);
    });
  };

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    startTransition(() => {
      void deleteTodo(id);
    });
  };

  const add = async () => {
    const created = await addTodo("Nueva tarea");
    if (created) setTodos((prev) => [...prev, created]);
  };

  const regenerate = async () => {
    setLoading(true);
    try {
      const next = await regenerateTodos();
      if (next.length > 0) setTodos(next);
    } finally {
      setLoading(false);
    }
  };

  const doneCount = todos.filter((t) => t.completed).length;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-secondary">
          Los 3 del día{" "}
          <span className="mono text-text-muted">
            · {doneCount}/{todos.length}
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={add}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir
          </button>
          <button
            onClick={regenerate}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Regenerar
          </button>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={setTodos}
        className="space-y-3.5"
      >
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TodoRow
                todo={todo}
                onToggle={() => toggle(todo.id)}
                onEdit={(text) => edit(todo.id, text)}
                onRemove={() => remove(todo.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {todos.length === 0 && (
        <p className="card p-6 text-center text-sm text-text-muted">
          Sin tareas. Pulsa <span className="text-accent">Regenerar</span> para
          que la IA proponga 3.
        </p>
      )}
    </section>
  );
}
