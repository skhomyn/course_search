export interface CourseItem {
  id: number;
  name: string;
  parent_id: number;
}

export interface TreeNode extends CourseItem {
  children: TreeNode[];
}

export interface DisplayItem {
  id: number;
  name: string;
  depth: number;
}

