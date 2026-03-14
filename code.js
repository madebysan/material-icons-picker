figma.showUI(__html__, { width: 380, height: 620, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'copy-icon-name') {
    figma.notify(`Copied: ${msg.name}`, { timeout: 2000 });
  }
  if (msg.type === 'insert-svg') {
    try {
      const node = figma.createNodeFromSvg(msg.svg);
      node.name = msg.name;
      // Place at center of viewport
      const viewport = figma.viewport.center;
      node.x = viewport.x - node.width / 2;
      node.y = viewport.y - node.height / 2;
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
      figma.notify(`Inserted: ${msg.name}`, { timeout: 2000 });
    } catch (err) {
      figma.notify(`Failed to insert icon`, { error: true });
    }
  }
  if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
  }

  // Persistence via figma.clientStorage
  if (msg.type === 'save-preference') {
    await figma.clientStorage.setAsync(msg.key, msg.value);
  }
  if (msg.type === 'load-preference') {
    const value = await figma.clientStorage.getAsync(msg.key);
    figma.ui.postMessage({ type: 'preference-loaded', key: msg.key, value });
  }
};
