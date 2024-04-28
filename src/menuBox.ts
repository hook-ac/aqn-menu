import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { window } from "..";
import { Colors } from "./colors";

export function createMenu() {
  const menuBox = new Interactable();

  menuBox.draw = (self) => {
    menuBox.size = { x: 600, y: Dugtrio.getWindowSize().y };
    menuBox.position = { x: Dugtrio.getWindowSize().x - 600, y: 0 };

    // Main Bar
    DrawingContext.color(Colors.BLACK_DIMMED);
    DrawingContext.rect({
      position: self.position,
      fill: true,
      size: self.size,
    });

    // Top Dimmed Bar
    DrawingContext.color(Colors.BLUE_DIMMED);
    DrawingContext.rect({
      position: self.position,
      fill: true,
      size: { ...self.size, y: 80 },
    });

    // Vertical Bar
    DrawingContext.color(Colors.BLUE);
    DrawingContext.rect({
      position: self.position,
      fill: true,
      size: { ...self.size, x: 8 },
    });

    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: { x: self.position.x + 30, y: self.position.y + 30 },
      text: "Some cool feature",
    });
  };

  window.child(menuBox);
}
