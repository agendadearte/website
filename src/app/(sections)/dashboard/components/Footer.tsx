"use client";

import { Button } from "@/components";

type FooterProps = {
  isDirty: boolean;
  isUpdating: boolean;
  onReset: () => void;
  onUpdate: () => void;
};

const getFooterMessage = (isDirty: boolean) =>
  isDirty ? "You have unsaved changes." : "No local changes.";

export const Footer = ({
  isDirty,
  isUpdating,
  onReset,
  onUpdate,
}: FooterProps) => (
  <footer className="dashboard__footer">
    <p>{getFooterMessage(isDirty)}</p>
    <Button onClick={onReset} text="Reset" disabled={!isDirty || isUpdating} />
    <Button
      onClick={onUpdate}
      text="Update"
      disabled={!isDirty || isUpdating}
    />
  </footer>
);
