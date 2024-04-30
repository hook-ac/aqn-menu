import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { createMenu } from "./src/menuBox";
import { fetchData, supabase } from "./db";
import { loginGuest, loginWithDiscord } from "hook-login";
import { Colors } from "./src/colors";

export let window: Interactable;

async function main() {
  await loginGuest(supabase);
  await fetchData();
  Dugtrio.init("opengl", "x32");

  window = new Interactable();
  window.size = Dugtrio.getWindowSize();
  window.draw = (self) => {};

  createMenu();
  setInterval(() => {
    window.render();
    if (!Dugtrio.isMenuActive()) {
      DrawingContext.rounding({
        value: 24,
      });
      DrawingContext.color(Colors.BLUE);
      DrawingContext.rect({
        position: { x: Dugtrio.getWindowSize().x - 18, y: 170 },
        fill: true,
        size: { y: 100, x: 25 },
      });
    }
    Dugtrio.draw();
  }, 4);
}

main();
