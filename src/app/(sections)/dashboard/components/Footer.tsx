"use client";

import { Button } from "@/components";

type FooterProps = {
  isDirty: boolean;
  onReset: () => void;
  onUpdate: () => void;
};

const getFooterMessage = (isDirty: boolean) =>
  isDirty ? "You have unsaved changes." : "No local changes.";

export const Footer = ({ isDirty, onReset, onUpdate }: FooterProps) => (
  <footer className="dashboard__footer">
    <p>{getFooterMessage(isDirty)}</p>
    <Button onClick={onReset} text="Reset" disabled={!isDirty} />
    <Button onClick={onUpdate} text="Update" disabled={!isDirty} />
  </footer>
);
