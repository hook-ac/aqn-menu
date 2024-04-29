import { Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { createMenu } from "./src/menuBox";
import { loginWithDiscord, supabase } from "./db";

export let window: Interactable;

async function main() {
  await loginWithDiscord();
  Dugtrio.init("opengl", "x32");

  window = new Interactable();
  window.size = Dugtrio.getWindowSize();
  window.draw = (self) => {};

  createMenu();
  setInterval(() => {
    window.render();
    Dugtrio.draw();
  }, 4);
}

main();
