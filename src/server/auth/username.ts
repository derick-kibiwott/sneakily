// @/server/auth/username.ts
"use server";
import "server-only";
import { randomInt } from "node:crypto";
import { db } from "@/db";
import { user } from "@/db/schema";
import { inArray } from "drizzle-orm";

const ADJECTIVES = [
  "amber",
  "brave",
  "calm",
  "clever",
  "cosmic",
  "crimson",
  "dusty",
  "eager",
  "frosty",
  "gentle",
  "golden",
  "happy",
  "hidden",
  "hollow",
  "ivory",
  "jolly",
  "keen",
  "lively",
  "lucky",
  "lunar",
  "misty",
  "mellow",
  "nimble",
  "noble",
  "olive",
  "quiet",
  "rapid",
  "rustic",
  "shadow",
  "silent",
  "silver",
  "sleepy",
  "solar",
  "steady",
  "sunny",
  "swift",
  "velvet",
  "wandering",
  "wild",
  "witty",
];

const NOUNS = [
  "acorn",
  "badger",
  "beacon",
  "birch",
  "breeze",
  "canyon",
  "cedar",
  "comet",
  "coral",
  "cricket",
  "delta",
  "ember",
  "falcon",
  "fern",
  "fjord",
  "fox",
  "glacier",
  "harbor",
  "heron",
  "island",
  "juniper",
  "lantern",
  "lynx",
  "maple",
  "meadow",
  "otter",
  "orbit",
  "pebble",
  "pine",
  "raven",
  "reef",
  "river",
  "sparrow",
  "summit",
  "tiger",
  "tundra",
  "valley",
  "willow",
  "wolf",
  "zephyr",
];

const pick = (list: string[]) => list[randomInt(list.length)];

export function generateUsername() {
  const adjective = pick(ADJECTIVES);
  const noun = pick(NOUNS);

  const words = randomInt(2) === 0 ? [adjective, noun] : [noun, adjective];

  return `${words.join("-")}-${randomInt(1000, 10000)}`;
}

/**
 * Generates a memorable username that isn't taken. Checks a batch of
 * usernames with a single query.
 *
 * "Free right now" isn't a reservation: sign-up still handles the rare case
 * where someone claims it first.
 */

export async function generateUniqueUsername() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const usernames = Array.from({ length: 5 }, generateUsername);

    const takenUsernames = await db
      .select({ username: user.username })
      .from(user)
      .where(inArray(user.username, usernames));

    const takenUsernameSet = new Set(takenUsernames.map((row) => row.username));
    const freeUsername = usernames.find(
      (username) => !takenUsernameSet.has(username),
    );
    if (freeUsername) return freeUsername;
  }
  return null;
}