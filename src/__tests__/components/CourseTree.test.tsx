import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CourseTree } from '../../components/CourseTree';
import { CourseItem } from '../../types/course';

describe('CourseTree', () => {
  it('should render empty state when no items', () => {
    render(<CourseTree items={[]} />);
    
    expect(screen.getByText('No items to display.')).toBeInTheDocument();
  });

  it('should render tree with correct indentation', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root', parent_id: 0 },
      { id: 2, name: 'Child', parent_id: 1 },
      { id: 3, name: 'Grandchild', parent_id: 2 }
    ];

    render(<CourseTree items={items} />);

    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('- Child')).toBeInTheDocument();
    expect(screen.getByText('- - Grandchild')).toBeInTheDocument();
  });

  it('should display items in correct order (parent before children)', () => {
    const items: CourseItem[] = [
      { id: 2, name: 'Child', parent_id: 1 },
      { id: 1, name: 'Parent', parent_id: 0 }
    ];

    render(<CourseTree items={items} />);

    const treeElement = screen.getByRole('tree');
    const textContent = treeElement.textContent || '';
    const parentIndex = textContent.indexOf('Parent');
    const childIndex = textContent.indexOf('- Child');

    expect(parentIndex).toBeLessThan(childIndex);
  });

  it('should show correct hyphen count for each depth level', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Level 0', parent_id: 0 },
      { id: 2, name: 'Level 1', parent_id: 1 },
      { id: 3, name: 'Level 2', parent_id: 2 },
      { id: 4, name: 'Level 3', parent_id: 3 }
    ];

    render(<CourseTree items={items} />);

    expect(screen.getByText('Level 0')).toBeInTheDocument();
    expect(screen.getByText('- Level 1')).toBeInTheDocument();
    expect(screen.getByText('- - Level 2')).toBeInTheDocument();
    expect(screen.getByText('- - - Level 3')).toBeInTheDocument();
  });

  it('should handle single item', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Single Item', parent_id: 0 }
    ];

    render(<CourseTree items={items} />);

    expect(screen.getByText('Single Item')).toBeInTheDocument();
    expect(screen.queryByText(/-/)).not.toBeInTheDocument();
  });

  it('should handle multiple root items', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Root 1', parent_id: 0 },
      { id: 2, name: 'Root 2', parent_id: 0 },
      { id: 3, name: 'Child of Root 1', parent_id: 1 }
    ];

    render(<CourseTree items={items} />);

    expect(screen.getByText('Root 1')).toBeInTheDocument();
    expect(screen.getByText('- Child of Root 1')).toBeInTheDocument();
    expect(screen.getByText('Root 2')).toBeInTheDocument();
  });

  it('should handle example from README correctly', () => {
    const items: CourseItem[] = [
      { id: 5, name: 'Chemical Kinetics', parent_id: 6 },
      { id: 3, name: 'Surface Chemistry', parent_id: 1 },
      { id: 1, name: 'Lab Experiment 1', parent_id: 0 },
      { id: 4, name: 'Lab 1 Summary', parent_id: 1 },
      { id: 2, name: 'Colloidal Solution (sol) of Starch', parent_id: 3 },
      { id: 6, name: 'Lab Experiment 2', parent_id: 0 },
      { id: 7, name: 'Colloidal Solution of Gum', parent_id: 3 }
    ];

    render(<CourseTree items={items} />);

    // Verify all items are displayed
    expect(screen.getByText('Lab Experiment 1')).toBeInTheDocument();
    expect(screen.getByText('- Surface Chemistry')).toBeInTheDocument();
    expect(screen.getByText('- - Colloidal Solution (sol) of Starch')).toBeInTheDocument();
    expect(screen.getByText('- - Colloidal Solution of Gum')).toBeInTheDocument();
    expect(screen.getByText('- Lab 1 Summary')).toBeInTheDocument();
    expect(screen.getByText('Lab Experiment 2')).toBeInTheDocument();
    expect(screen.getByText('- Chemical Kinetics')).toBeInTheDocument();
  });

  it('should handle very long item names', () => {
    const longName = 'A'.repeat(200);
    const items: CourseItem[] = [
      { id: 1, name: longName, parent_id: 0 }
    ];

    render(<CourseTree items={items} />);

    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('should have proper tree role', () => {
    const items: CourseItem[] = [
      { id: 1, name: 'Test', parent_id: 0 }
    ];

    render(<CourseTree items={items} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
});

