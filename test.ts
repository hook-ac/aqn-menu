import { Dugtrio } from "dugtrio-node";
import { loadMenu } from ".";

async function main() {
  const render = await loadMenu("lazer");

  setInterval(() => {
    render();
    Dugtrio.draw();
  });
}

main();
