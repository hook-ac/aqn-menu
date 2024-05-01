import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { createMenu } from "./src/menuBox";
import { fetchData, supabase } from "./db";
import { loginGuest, loginWithDiscord } from "hook-login";
import { Colors, changeColor } from "./src/colors";
import { readdirSync, readFileSync } from "fs";
import path from "path";
export let window: Interactable;

function loadAssets() {
  const assets = readdirSync(__dirname + "/icons");
  for (const asset of assets) {
    DrawingContext.loadTexture({
      textureName: asset,
      data: readFileSync(path.join(__dirname, "icons", asset), "base64"),
    });
  }
}

async function main() {
  const user = await loginGuest(supabase);
  await fetchData();

  const avatar_base64 = readFileSync(
    path.join(__dirname, "icons", "guest.png"),
    "base64"
  );
  if (user?.user_metadata.avatar_url) {
  }
  Dugtrio.init("opengl", "x32");

  window = new Interactable();
  window.size = Dugtrio.getWindowSize();
  window.draw = (self) => {};

  createMenu();
  Dugtrio.onReady(() => {
    setInterval(() => {
      if (!Dugtrio.getWindowSize().x) {
        loadAssets();
        DrawingContext.loadTexture({
          textureName: "user",
          data: avatar_base64,
        });
      }
      if (!Dugtrio.isMenuActive()) {
        DrawingContext.rounding({
          value: 24,
        });
        DrawingContext.color(Colors.ACCENT);
        DrawingContext.rect({
          position: { x: Dugtrio.getWindowSize().x - 18, y: 170 },
          fill: true,
          size: { y: 100, x: 25 },
        });
      } else {
        window.render();
      }
      Dugtrio.draw();
    }, 4);
  });
}

main();
