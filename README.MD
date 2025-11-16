We will build a simple course tree search application.
At Top Hat students are assigned homework items, these are organized into folders and
subfolders. We would like to develop an application that will search within the course tree and
outputs structured items & their subitems.

● The API will return a course tree as a flat list of items
● show all items so that child items appear immediately after their parent in the list
● Nested items should be indented with hyphens
● The number of hyphens should correspond to the depth level of the item
● Items with “0” parent id are at the top of the hierarchy
Key Features:
● A text box where students can enter their search string.
● A submit button, that submits the data to a
https://coursetreesearch-service-sandbox.dev.tophat.com/?query={SEARCH_TERM} and returns a result as a flat tree structure.
● A container to display course hierarchy.
● Catch any network errors and display an error message to the user to try again.
○ Tip: You can search for the “error” keyword, this will return an empty result.

Example:
A student is searching for the keyword “Lab” in a Chemistry course. A course tree will return as
below
items = [
  {"id": 5, "name": "Chemical Kinetics", "parent_id": 6},
  {"id": 3, "name": "Surface Chemistry", "parent_id": 1},
  {"id": 1, "name": "Lab Experiment 1", "parent_id": 0},
  {"id": 4, "name": "Lab 1 Summary", "parent_id": 1},
  {"id": 2, "name": "Colloidal Solution (sol) of Starch", "parent_id": 3},
  {"id": 6, "name": "Lab Experiment 2", "parent_id": 0},
  {"id": 7, "name": "Colloidal Solution of Gum", "parent_id": 3}
]
Your resulting tree will be
Lab Experiment 1
- Surface Chemistry
- - Colloidal Solution (sol) of Starch
- - Colloidal Solution of Gum
- Lab 1 Summary
Lab Experiment 2
- Chemical Kinetics

Other notes:
● You can choose to work with any front-end library, or framework that you feel
comfortable with.
● Please provide us with a compressed file of your code and an instruction on how to
execute this code.


---

## How to Execute This Code

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The application will be available at `http://localhost:5173` (or the port shown in the terminal)
   - Vite will automatically open the browser, or you can navigate to the URL manually


### Usage

1. Enter a search term in the text box (e.g. "Lab")
2. Click the "Search" button
3. The course tree hierarchy will be displayed with proper indentation using hyphens
4. If an error occurs, an error message will be displayed with instructions to try again

### Running Tests

The project includes comprehensive test coverage using Vitest and React Testing Library.

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm test
```
(Press `a` to run all tests, or `u` to update snapshots)

**Run tests with UI:**
```bash
npm run test:ui
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

The test suite includes:
- Unit tests for the tree building algorithm
- API service tests with mocked fetch
- Component tests for all React components
- Integration tests for the main App component

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

### Project Structure

- `src/components/` - React components (SearchForm, CourseTree, ErrorMessage)
- `src/services/` - API service for fetching course tree data
- `src/utils/` - Utility functions (tree building algorithm)
- `src/types/` - TypeScript type definitions
- `src/__tests__/` - Test files organized by feature
- `src/styles/` - CSS stylesheets
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point