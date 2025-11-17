import { CourseItem } from '../types/course';
import { buildTree } from '../utils/treeBuilder';
import '../styles/CourseTree.css';

interface CourseTreeProps {
  items: CourseItem[];
}

/**
 * Renders a hierarchical tree view of course items with proper indentation.
 * 
 * Takes a flat array of CourseItem objects and displays them as a nested tree
 * structure using visual indentation (dashes and padding). Each item's depth
 * in the hierarchy determines its indentation level.
 * 
 * @param items - Array of CourseItem objects to display in tree format
 * @returns JSX element containing the rendered course tree
 */
export function CourseTree({ items }: CourseTreeProps) {
  const displayItems = buildTree(items);
  if (displayItems.length === 0) {
    return <div className="course-tree-empty">No results found for your search.</div>;
  }

  return (
    <div className="course-tree" role="tree">
      {displayItems.map((item) => {
        const indent = '- '.repeat(item.depth);
        const displayName = item.depth > 0 ? `${indent}${item.name}` : item.name;
        
        return (
          <div
            key={item.id}
            className="course-tree-item"
            style={{ paddingLeft: `${item.depth * 1.5}rem` }}
          >
            {displayName}
          </div>
        );
      })}
    </div>
  );
}

