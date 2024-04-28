import { DrawingContext, Dugtrio } from "dugtrio-node";
import { Interactable } from "dugtrio-node/src/interactable";
import { onClick } from "dugtrio-node/plugins/onClick";
import { pin } from "dugtrio-node/plugins/pin";
import { mouseOver } from "dugtrio-node/plugins/mouseOver";
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
  for (const feature of state.features!) {
    const featureIndex = index;
    const button = new Interactable();
    button.size = { x: 90, y: 30 };
    button.draw = (self) => {
      DrawingContext.rounding({ value: 10 });
      DrawingContext.color(Colors.BLUE_DIMMED);
      DrawingContext.rect({
        position: self.position,
        fill: true,
        size: self.size,
      });
    };
    button.addPlugin(mouseOver());
    button.addPlugin(
      onClick({
        onPress: (self) => {
          profile.setState(() => ({ selectedProfile: featureIndex }));
        },
        onRelease: (self) => {},
      })
    );
    button.addPlugin(pin());
    button.properties.offset.x = (index % 4) * (button.size.x + 30) + 40;
    button.properties.offset.y = row * (button.size.y + 10) + 100;
    featureButtonInteractables.push(button);
    if (index % 4 == 0 && index !== 0) {
      row++;
    }
    index++;
  }

  return featureButtonInteractables;
}
