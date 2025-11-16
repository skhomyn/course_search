import { describe, it, expect } from 'vitest';
import { buildTree } from '../../utils/treeBuilder';
import { CourseItem } from '../../types/course';

describe('buildTree', () => {
  it('should return empty array for empty input', () => {
    const result = buildTree([]);
    expect(result).toEqual([]);
  });

  it('should handle single root item', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root Item', parent_id: 0 }
    ];
    const result = buildTree(items);
    expect(result).toEqual([
      { id: 1, name: 'Root Item', depth: 0 }
    ]);
  });

  it('should handle example from README (Lab search)', () => {
    const items: CourseItem[] = [
      { id: 5, name: 'Chemical Kinetics', parent_id: 6 },
      { id: 3, name: 'Surface Chemistry', parent_id: 1 },
      { id: 1, name: 'Lab Experiment 1', parent_id: 0 },
      { id: 4, name: 'Lab 1 Summary', parent_id: 1 },
      { id: 2, name: 'Colloidal Solution (sol) of Starch', parent_id: 3 },
      { id: 6, name: 'Lab Experiment 2', parent_id: 0 },
      { id: 7, name: 'Colloidal Solution of Gum', parent_id: 3 }
    ];

    const result = buildTree(items);

    // Expected order based on README example
    expect(result).toEqual([
      { id: 1, name: 'Lab Experiment 1', depth: 0 },
      { id: 3, name: 'Surface Chemistry', depth: 1 },
      { id: 2, name: 'Colloidal Solution (sol) of Starch', depth: 2 },
      { id: 7, name: 'Colloidal Solution of Gum', depth: 2 },
      { id: 4, name: 'Lab 1 Summary', depth: 1 },
      { id: 6, name: 'Lab Experiment 2', depth: 0 },
      { id: 5, name: 'Chemical Kinetics', depth: 1 }
    ]);
  });

  it('should handle multiple root items', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root 1', parent_id: 0 },
      { id: 2, name: 'Root 2', parent_id: 0 },
      { id: 3, name: 'Child of Root 1', parent_id: 1 },
      { id: 4, name: 'Child of Root 2', parent_id: 2 }
    ];

    const result = buildTree(items);

    expect(result).toEqual([
      { id: 1, name: 'Root 1', depth: 0 },
      { id: 3, name: 'Child of Root 1', depth: 1 },
      { id: 2, name: 'Root 2', depth: 0 },
      { id: 4, name: 'Child of Root 2', depth: 1 }
    ]);
  });

  it('should handle deep nesting (3+ levels)', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Level 0', parent_id: 0 },
      { id: 2, name: 'Level 1', parent_id: 1 },
      { id: 3, name: 'Level 2', parent_id: 2 },
      { id: 4, name: 'Level 3', parent_id: 3 },
      { id: 5, name: 'Level 4', parent_id: 4 }
    ];

    const result = buildTree(items);

    expect(result).toEqual([
      { id: 1, name: 'Level 0', depth: 0 },
      { id: 2, name: 'Level 1', depth: 1 },
      { id: 3, name: 'Level 2', depth: 2 },
      { id: 4, name: 'Level 3', depth: 3 },
      { id: 5, name: 'Level 4', depth: 4 }
    ]);
  });

  it('should handle orphaned items (parent_id that does not exist)', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root', parent_id: 0 },
      { id: 2, name: 'Orphan', parent_id: 999 } // parent_id 999 doesn't exist
    ];

    const result = buildTree(items);

    // Orphaned item should not appear in results (no parent to attach to)
    expect(result).toEqual([
      { id: 1, name: 'Root', depth: 0 }
    ]);
  });

  it('should verify children appear immediately after parent', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Parent', parent_id: 0 },
      { id: 2, name: 'Child 1', parent_id: 1 },
      { id: 3, name: 'Child 2', parent_id: 1 },
      { id: 4, name: 'Grandchild', parent_id: 2 }
    ];

    const result = buildTree(items);

    // Verify order: Parent, then its children, then grandchildren
    const parentIndex = result.findIndex(item => item.id === 1);
    const child1Index = result.findIndex(item => item.id === 2);
    const child2Index = result.findIndex(item => item.id === 3);
    const grandchildIndex = result.findIndex(item => item.id === 4);

    expect(parentIndex).toBeLessThan(child1Index);
    expect(child1Index).toBeLessThan(grandchildIndex);
    expect(grandchildIndex).toBeLessThan(child2Index);
  });

  it('should calculate correct depth for each item', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root', parent_id: 0 },
      { id: 2, name: 'Level 1', parent_id: 1 },
      { id: 3, name: 'Level 2', parent_id: 2 },
      { id: 4, name: 'Another Level 1', parent_id: 1 }
    ];

    const result = buildTree(items);

    expect(result.find(item => item.id === 1)?.depth).toBe(0);
    expect(result.find(item => item.id === 2)?.depth).toBe(1);
    expect(result.find(item => item.id === 3)?.depth).toBe(2);
    expect(result.find(item => item.id === 4)?.depth).toBe(1);
  });

  it('should handle items with same name but different IDs', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Duplicate Name', parent_id: 0 },
      { id: 2, name: 'Duplicate Name', parent_id: 0 },
      { id: 3, name: 'Child', parent_id: 1 }
    ];

    const result = buildTree(items);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('Duplicate Name');
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(2);
    expect(result[2].name).toBe('Duplicate Name');
  });

  it('should handle complex tree with multiple branches', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root A', parent_id: 0 },
      { id: 2, name: 'Root B', parent_id: 0 },
      { id: 3, name: 'Child A1', parent_id: 1 },
      { id: 4, name: 'Child A2', parent_id: 1 },
      { id: 5, name: 'Child B1', parent_id: 2 },
      { id: 6, name: 'Grandchild A1-1', parent_id: 3 },
      { id: 7, name: 'Grandchild A1-2', parent_id: 3 }
    ];

    const result = buildTree(items);

    // Verify structure
    expect(result[0].id).toBe(1); // Root A
    expect(result[1].id).toBe(3); // Child A1 (immediately after Root A)
    expect(result[2].id).toBe(6); // Grandchild A1-1
    expect(result[3].id).toBe(7); // Grandchild A1-2
    expect(result[4].id).toBe(4); // Child A2
    expect(result[5].id).toBe(2); // Root B
    expect(result[6].id).toBe(5); // Child B1
  });
});

