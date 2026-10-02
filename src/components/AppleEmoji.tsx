"use client";

import { Emoji, init } from "emoji-mart";
import data from "@emoji-mart/data";

let initialized = false;

function ensureEmojiMartInitialized() {
  if (!initialized) {
    init({ data });
    initialized = true;
  }
}

export type AppleEmojiName = "cookie" | "coffee" | "desktop_computer";

export default function AppleEmoji({
  name,
  size = 22,
  className = "",
}: {
  name: AppleEmojiName;
  size?: number;
  className?: string;
}) {
  ensureEmojiMartInitialized();

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{ display: "inline-flex", width: size, height: size, verticalAlign: "middle" }}
    >
      <Emoji emoji={name} set="apple" size={size} />
    </span>
  );
}
