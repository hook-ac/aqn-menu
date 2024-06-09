import { Interactable } from "dugtrio-node/src/interactable";
import { NumberField } from "../../types";
import { DrawingContext } from "dugtrio-node";
import { mouseOver } from "dugtrio-node/plugins/mouseOver";
import { Colors } from "../colors";
import { draggable } from "dugtrio-node/plugins/draggable";
import { clamp, getConfigValue, updateField } from "./helpers";
import { onClick } from "dugtrio-node/plugins/onClick";

export function createSliderInteractable(field: NumberField) {
  const interactable = new Interactable();
  const grabber = new Interactable();

  const add = new Interactable();
  const subtract = new Interactable();

  let value = getConfigValue(field.name, field.value);
  interactable.draw = (self) => {
    if (self.parent) {
      interactable.size = { x: self.parent.size.x, y: 40 };
    }

    DrawingContext.color(Colors.ACCENT_VERY_DIMMED);
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
    DrawingContext.color(Colors.ACCENT);
    DrawingContext.rect({
      fill: true,
      position: self.position,
      size: self.size,
    });
  };

  grabber.addPlugin(mouseOver());
  grabber.addPlugin(draggable());
  add.addPlugin(mouseOver());
  subtract.addPlugin(mouseOver());

  add.addPlugin(
    onClick({
      onPress: (self) => {
        value = clamp(value + 1, field.min, field.max);
      },
      onRelease: (self) => {},
    })
  );

  subtract.addPlugin(
    onClick({
      onPress: (self) => {
        value = clamp(value - 1, field.min, field.max);
      },
      onRelease: (self) => {},
    })
  );

  add.draw = (self) => {
    self.position.x = interactable.position.x + interactable.size.x / 2 + 155;
    self.position.y = interactable.position.y + 8;
    self.size = { x: 25, y: 25 };
    DrawingContext.color(Colors.ACCENT_VERY_DIMMED);
    DrawingContext.rounding({
      value: 4,
    });
    DrawingContext.rect({
      fill: true,
      position: self.position,
      size: self.size,
    });
    DrawingContext.color(Colors.ACCENT);

    DrawingContext.fontAlign({
      value: 2,
    });
    DrawingContext.text({
      position: {
        x: self.position.x + 13,
        y: self.position.y - 2,
      },
      text: "+",
    });
  };

  subtract.draw = (self) => {
    self.position.x = interactable.position.x + interactable.size.x / 2 + 120;
    self.position.y = interactable.position.y + 8;
    self.size = { x: 25, y: 25 };
    DrawingContext.color(Colors.ACCENT_VERY_DIMMED);
    DrawingContext.rounding({
      value: 4,
    });
    DrawingContext.rect({
      fill: true,
      position: self.position,
      size: self.size,
    });
    DrawingContext.color(Colors.ACCENT);

    DrawingContext.fontAlign({
      value: 2,
    });
    DrawingContext.text({
      position: {
        x: self.position.x + 13,
        y: self.position.y - 2,
      },
      text: "-",
    });
  };

  interactable.child(grabber);
  interactable.child(add);
  interactable.child(subtract);
  return interactable;
}
