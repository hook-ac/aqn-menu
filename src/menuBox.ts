import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { window } from "..";
import { Colors } from "./colors";
import { profile } from "../db";

export function createMenu() {
  const state = profile.getState();
  const menuBox = new Interactable();

  menuBox.draw = (self) => {
    menuBox.size = { x: 650, y: Dugtrio.getWindowSize().y };
    menuBox.position = { x: Dugtrio.getWindowSize().x - menuBox.size.x, y: 0 };
    DrawingContext.fontAlign({ value: 0 });

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

    DrawingContext.color(Colors.BLUE_DIMMED);
    DrawingContext.rect({
      position: { ...self.position, x: self.position.x + self.size.x - 150 },
      fill: true,
      size: { x: 150, y: 150 },
    });

    DrawingContext.color(Colors.BLACK);
    DrawingContext.rect({
      position: {
        x: self.position.x + self.size.x - 130 - 10,
        y: self.position.y + 10,
      },
      fill: true,
      size: { x: 130, y: 130 },
    });

    // Vertical Bar
    DrawingContext.color(Colors.BLUE);
    DrawingContext.rect({
      position: self.position,
      fill: true,
      size: { ...self.size, x: 8 },
    });

    DrawingContext.rounding({
      value: 24,
    });
    DrawingContext.color(Colors.BLUE);
    DrawingContext.rect({
      position: { x: self.position.x - 12, y: self.position.y + 128 },
      fill: true,
      size: { y: 100, x: 18 },
    });

    DrawingContext.fontSize({ value: 32 });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: { x: self.position.x + 40, y: self.position.y + 25 },
      text: `Feature name`,
    });

    DrawingContext.fontAlign({ value: 1 });
    DrawingContext.fontSize({ value: 32 });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: {
        x: self.position.x + self.size.x - 158,
        y: self.position.y + 25,
      },
      text: `User`,
    });

    DrawingContext.fontSize({ value: 24 });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: {
        x: self.position.x + self.size.x - 158,
        y: self.position.y + 50,
      },
      text: state.user?.user_metadata.full_name
        ? state.user?.user_metadata.full_name
        : "name",
    });
  };

  window.child(menuBox);
}
