import { Interactable } from "dugtrio-node/src/interactable";
import { BooleanField } from "../../types";
import { DrawingContext } from "dugtrio-node";
import { mouseOver } from "dugtrio-node/plugins/mouseOver";
import { Colors } from "../colors";
import { onClick } from "dugtrio-node/plugins/onClick";
import { getConfigValue, updateField } from "./helpers";

export function createBooleanInteractable(field: BooleanField) {
  const interactable = new Interactable();
  let alpha = 0;

  let value = getConfigValue(field.name, field.value);
  interactable.draw = (self) => {
    if (self.parent) {
      interactable.size = { x: self.parent.size.x, y: 40 };
    }
    if (self.properties.mouseOver) {
      alpha += (0.4 - alpha) * 0.06;
    } else {
      alpha += (0 - alpha) * 0.06;
    }

    DrawingContext.color({ ...Colors.BLUE_DIMMED, alpha });

    DrawingContext.rect({
      fill: true,
      position: self.position,
      size: self.size,
    });
    DrawingContext.color(Colors.BLUE);
    DrawingContext.thickness({ value: 2 });

    DrawingContext.circle({
      fill: value,
      position: {
        y: self.position.y + self.size.y / 2,
        x: self.position.x + 35,
      },
      radius: 10,
    });
    DrawingContext.color(Colors.WHITE);

    DrawingContext.fontSize({
      value: 28,
    });
    DrawingContext.text({
      position: {
        x: self.position.x + 65,
        y: self.position.y - 15 + self.size.y / 2,
      },
      text: field.name,
    });
  };

  interactable.addPlugin(mouseOver());
  interactable.addPlugin(
    onClick({
      onPress: (self) => {
        updateField(field.name, !value);
        value = !value;
      },
      onRelease: (self) => {},
    })
  );
  return interactable;
}
