import { CourseItem, TreeNode, DisplayItem } from '../types/course';

/**
 * Builds a hierarchical tree structure from a flat list of course items
 * and returns them in display order (depth-first traversal)
 */
export function buildTree(items: CourseItem[]): DisplayItem[] {
  if (items.length === 0) {
    return [];
  }

  const itemMap = new Map<number, TreeNode>();
  
  // Initialize all items as tree nodes
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Build tree structure by linking children to parents
  const rootNodes: TreeNode[] = [];
  
  items.forEach(item => {
    const node = itemMap.get(item.id)!;
    
    if (item.parent_id === 0) {
      // Root node
      rootNodes.push(node);
    } else {
      // Child node - add to parent's children array
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  // Ensure consistent display order
  rootNodes.sort((a, b) => a.id - b.id);
  function sortChildren(node: TreeNode): void {
    node.children.sort((a, b) => a.id - b.id);
    node.children.forEach(sortChildren);
  }
  rootNodes.forEach(sortChildren);

  // Flatten tree to display order (depth-first traversal)
  const displayItems: DisplayItem[] = [];
  
  function traverse(node: TreeNode, depth: number): void {
    displayItems.push({
      id: node.id,
      name: node.name,
      depth: depth
    });
    
    node.children.forEach(child => {
      traverse(child, depth + 1);
    });
  }
  
  // Traverse all root nodes
  rootNodes.forEach(root => {
    traverse(root, 0);
  });
  
  return displayItems;
}

