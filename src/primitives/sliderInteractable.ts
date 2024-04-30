import { Interactable } from "dugtrio-node/src/interactable";
import { BooleanField, NumberField, StringField } from "../../types";
import { DrawingContext } from "dugtrio-node";
import { mouseOver } from "dugtrio-node/plugins/mouseOver";
import { Colors } from "../colors";
import { onClick } from "dugtrio-node/plugins/onClick";
import { draggable } from "dugtrio-node/plugins/draggable";
import { clamp, getConfigValue, updateField } from "./helpers";

export function createSliderInteractable(field: NumberField) {
  const interactable = new Interactable();
  const grabber = new Interactable();
  let alpha = 0;

  let value = getConfigValue(field.name, field.value);
  interactable.draw = (self) => {
    if (self.parent) {
      interactable.size = { x: self.parent.size.x, y: 40 };
    }

    DrawingContext.color(Colors.BLUE_FOREGROUND);
    DrawingContext.rect({
      fill: true,
      position: { x: self.position.x + 25, y: self.position.y + 6 },
      size: { x: 250, y: self.size.y - 12 },
    });
    DrawingContext.fontSize({
      value: 28,
    });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: {
        x: self.position.x + 295,
        y: self.position.y - 15 + self.size.y / 2,
      },
      text: `${field.name}: ${value}`,
    });
  };

  let lastDragging = false;
  grabber.draw = (self) => {
    if (self.parent) {
      self.position.y = self.parent.position.y + 6;
      self.position.x = clamp(
        self.position.x,
        self.parent.position.x + 25,
        self.parent.position.x + 255
      );
      if (self.properties.isDragging) {
        const rate = (self.position.x - (self.parent.position.x + 25)) / 230;
        value =
          Math.round((rate * field.max + field.min) * (field.float ? 10 : 1)) /
          (field.float ? 10 : 1);
      }

      // Revert back - for existent values.
      self.position.x =
        self.parent.position.x +
        25 +
        (230 * (value - field.min)) / (field.max - field.min);

      self.size = { y: self.parent.size.y - 12, x: 20 };
    }
    if (lastDragging !== self.properties.isDragging) {
      lastDragging = self.properties.isDragging;
      if (!lastDragging) {
        updateField(field.name, value);
      }
    }
    DrawingContext.color(Colors.BLUE);
    DrawingContext.rect({
      fill: true,
      position: self.position,
      size: self.size,
    });
  };

  grabber.addPlugin(mouseOver());
  grabber.addPlugin(draggable());
  interactable.child(grabber);
  return interactable;
}
