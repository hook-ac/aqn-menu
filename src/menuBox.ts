import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { onClick } from "dugtrio-node/plugins/onClick";
import { pin } from "dugtrio-node/plugins/pin";
import { mouseOver } from "dugtrio-node/plugins/mouseOver";
import { window } from "..";
import { Colors, TabColors, changeColor, rgbToHsl } from "./colors";
import { profile } from "../db";
import { FeatureDefinition } from "../types";
import { createBooleanInteractable } from "./primitives/booleanInteractable";
import { createSliderInteractable } from "./primitives/sliderInteractable";

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
    DrawingContext.color(Colors.ACCENT_DIMMED);
    DrawingContext.rect({
      position: self.position,
      fill: true,
      size: { ...self.size, y: 80 },
    });

    DrawingContext.color(Colors.ACCENT_DIMMED);
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
    DrawingContext.texture({
      textureId: "user",
      position: {
        x: self.position.x + self.size.x - 130 - 10,
        y: self.position.y + 10,
      },
      size: { x: 130, y: 130 },
    });

    // Vertical Bar
    DrawingContext.color(Colors.ACCENT);
    DrawingContext.rect({
      position: self.position,
      fill: true,
      size: { ...self.size, x: 8 },
    });

    DrawingContext.rounding({
      value: 24,
    });
    DrawingContext.color(Colors.ACCENT);
    DrawingContext.rect({
      position: { x: self.position.x - 18, y: self.position.y + 170 },
      fill: true,
      size: { y: 100, x: 25 },
    });
    DrawingContext.rounding({
      value: 0,
    });
    DrawingContext.rect({
      position: { x: self.position.x - 8, y: self.position.y + 170 },
      fill: true,
      size: { y: 100, x: 10 },
    });

    DrawingContext.fontAlign({ value: 1 });
    DrawingContext.fontSize({ value: 32 });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: {
        x: self.position.x + self.size.x - 158,
        y: self.position.y + 20,
      },
      text: `User`,
    });

    DrawingContext.fontSize({ value: 24 });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: {
        x: self.position.x + self.size.x - 158,
        y: self.position.y + 45,
      },
      text: state.user?.user_metadata.full_name
        ? state.user?.user_metadata.full_name
        : "name",
    });
  };

  let featureInteractable = createFeature(menuBox);

  profile.subscribe((current, previous) => {
    if (current.selectedProfile !== previous.selectedProfile) {
      featureInteractable.purge();
      featureInteractable = createFeature(menuBox);
    }
  });

  window.child(menuBox);
}

function createFeature(parent: Interactable) {
  const state = profile.getState();

  const selectedFeature = state.features![state.selectedProfile];

  const featureInteractable = new Interactable();

  const buttons = createFeatureButtons();

  featureInteractable.draw = (self) => {
    featureInteractable.size = parent.size;
    featureInteractable.position = parent.position;

    DrawingContext.fontAlign({ value: 0 });
    DrawingContext.fontSize({ value: 32 });
    DrawingContext.color(Colors.WHITE);
    DrawingContext.text({
      position: { x: self.position.x + 40, y: self.position.y + 25 },
      text: selectedFeature.name!,
    });
  };

  const definition =
    selectedFeature.defaultDefinition as any as FeatureDefinition;

  let index = 0;
  for (const field of definition.fields) {
    let interactable: Interactable;

    switch (field.type) {
      case "boolean":
        interactable = createBooleanInteractable(field);
        break;
      case "string":
        interactable = new Interactable();
        break;
      case "number":
        interactable = createSliderInteractable(field);
        break;
      case "choose":
        interactable = new Interactable();
        break;
    }

    interactable.addPlugin(pin());
    interactable.properties.offset.x = 8;
    interactable.properties.offset.y = 190 + 50 * index;

    featureInteractable.child(interactable);
    index++;
  }

  for (const button of buttons) {
    featureInteractable.child(button);
  }
  parent.child(featureInteractable);
  return featureInteractable;
}

function createFeatureButtons(): Interactable[] {
  const state = profile.getState();
  const featureButtonInteractables: Interactable[] = [];

  let index = 0;
  let row = 0;
  for (const feature of state.features!.sort(
    (a, b) => b.priority! - a.priority!
  )) {
    const featureIndex = index;
    const button = new Interactable();
    button.size = { x: 74, y: 30 };

    // Hardcoded (very ui related)
    let icon = "";
    switch (feature.name) {
      case "General":
        icon = "settings.png";
        break;
      case "Aim Assist":
        icon = "assist.png";
        break;
      case "Enlighten":
        icon = "enlighten.png";
        break;
      case "Replay Bot":
        icon = "player.png";
        break;
      case "Relax":
        icon = "relax.png";
        break;
      case "Editor":
        icon = "editor.png";
        break;
    }
    const tabColor = TabColors[icon ? icon : "misc.png"];

    button.draw = (self) => {
      DrawingContext.rounding({ value: 9 });
      DrawingContext.color(tabColor);
      DrawingContext.rect({
        position: self.position,
        fill: true,
        size: self.size,
      });
      if (icon) {
        DrawingContext.texture({
          textureId: icon,
          position: { x: self.position.x + 17, y: self.position.y - 5 },
          size: { x: 40, y: 40 },
        });
      }
    };
    button.addPlugin(mouseOver());
    button.addPlugin(
      onClick({
        onPress: (self) => {
          const hslVal = rgbToHsl(tabColor.red, tabColor.green, tabColor.blue);
          changeColor(hslVal[0]);
          profile.setState(() => ({ selectedProfile: featureIndex }));
        },
        onRelease: (self) => {},
      })
    );
    if (index % 4 == 0 && index !== 0) {
      row++;
    }
    button.addPlugin(pin());
    button.properties.offset.x = (index % 4) * (button.size.x + 50) + 30;
    button.properties.offset.y = row * (button.size.y + 10) + 95;
    featureButtonInteractables.push(button);

    index++;
  }

  return featureButtonInteractables;
}
