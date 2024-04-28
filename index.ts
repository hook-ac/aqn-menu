import { Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { createMenu } from "./src/menuBox";

Dugtrio.init();

export const window = new Interactable();
window.size = Dugtrio.getWindowSize();
window.draw = (self) => {};

createMenu();
setInterval(() => {
  window.render();
  Dugtrio.draw();
}, 4);
