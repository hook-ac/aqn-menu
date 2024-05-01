import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { createMenu } from "./src/menuBox";
import { fetchData, profile, supabase } from "./db";
import { loginWithDiscord } from "hook-login";
import { Colors } from "./src/colors";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { fetchImageAsBase64 } from "./src/primitives/helpers";
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

export async function loadMenu(game: "stable" | "lazer") {
  const user = await loginWithDiscord(supabase);
  await fetchData();

  let avatar_base64 = readFileSync(
    path.join(__dirname, "icons", "guest.png"),
    "base64"
  );
  if (user?.user_metadata.avatar_url) {
    avatar_base64 = await fetchImageAsBase64(user?.user_metadata.avatar_url);
  }

  // Make some variable accessble globally, to be consumable;
  // TODO: Maybe make another package to manage config separately?
  global.profile = profile;

  // They have different renderers and arch
  if (game == "stable") {
    Dugtrio.init("opengl", "x32");
  }

  if (game == "lazer") {
    Dugtrio.init("dx11", "x64");
  }

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
