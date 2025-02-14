# Migration Guide: Material UI to Shadcn/Tailwind

This document outlines the mapping of Material UI components used in the codebase to their Shadcn/Tailwind equivalents. Use this as a guide when refactoring Material-react-table components.

## Component Mapping

| Material UI Component | Shadcn/Tailwind Equivalent                                                             | Notes                                                        |
| --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| TableHead             | TableHeader or semantic `<thead>` with Tailwind classes                                | Use Radix UI primitives if needed                            |
| TableRow              | TableRow or semantic `<tr>` with Tailwind styling                                      | Maintain accessibility and proper ref forwarding             |
| TableCell             | TableCell (use `<th>` for header cells or `<td>` for data cells with Tailwind classes) | Consider creating a dedicated variant like "TableHeaderCell" |
| IconButton            | Button (use variant="ghost" and size="sm")                                             | Embeds icons with minimal styling                            |
| Tooltip               | Tooltip                                                                                | Similar usage with Radix UI tooltip + Tailwind styling       |
| Box                   | Native HTML elements (e.g. `<div>`, `<section>`) with Tailwind classes                 | Replace MUI Box with semantic HTML elements                  |
| Collapse              | Collapsible                                                                            | Build on Radix UI Collapsible with custom Tailwind styling   |
| Popover               | Popover                                                                                | Use Radix UI Popover with Tailwind styling                   |
| Badge                 | Badge                                                                                  | Use a custom styled component if Shadcn doesn't provide one  |

## Additional Composed Components

- **Accordion:** Material UI's Accordion → Compose your own using headless components and Tailwind.
- **Avatar:** Material UI's Avatar → Shadcn Avatar (or implement via Tailwind).
- **Button:** Material UI's Button → Shadcn Button (ensure proper variants: default, ghost, outline, etc.).
- **Form Components:** (TextField, Select, Checkbox, etc.) Replace with headless components styled with Tailwind and enhanced with proper form validation.

## Extended Component Mapping

| Material UI Component  | Shadcn/Tailwind Equivalent                                                                          | Notes                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Accordion              | Use Shadcn Accordion component                                                                      | ShadCN doesn't provide a pre-built Accordion     |
| Alert                  | Build a custom Alert component using Tailwind (or integrate with Sonner for toasts)                 | Custom implementation recommended                |
| App Bar (top)          | Build a Navbar/Header using semantic HTML and Tailwind                                              | No direct equivalent in ShadCN; compose your own |
| Autocomplete           | Use a Combobox implementation from Headless UI or Radix with Tailwind                               | ShadCN doesn't ship a complete Autocomplete      |
| Bottom Navigation      | Construct using flex and Tailwind utilities                                                         | No pre-built component                           |
| Breadcrumbs            | Build using <nav>, <ol>, and <li> elements styled with Tailwind                                     | No direct component in ShadCN                    |
| Floating Action Button | Use a Button with the 'icon' variant (from shadcn/ui/button) with fixed positioning                 | Compose using ShadCN Button                      |
| Button Group           | Group multiple ShadCN Button components using a flex container                                      | No dedicated component                           |
| Card                   | Use a Card component from shadcn/ui if available, or build using a <div> with Tailwind card classes | Check shadcn/ui/card if available                |
| Checkbox               | Use the Checkbox component from shadcn/ui (based on Radix)                                          | Direct mapping available                         |
| Chip                   | Build a custom Chip component styled with Tailwind                                                  | Not provided by default                          |
| Data Grid              | Integrate TanStack Table with custom styling using Tailwind                                         | ShadCN provides a guide; no pre-built data grid  |
| Skeleton               | Build a custom Skeleton placeholder using Tailwind animations                                       | Custom implementation needed                     |
| Slider                 | Use a Slider component from shadcn/ui (if available) or build with Headless UI                      | Check community components                       |
| Switch                 | Use the Switch component from shadcn/ui (based on Radix)                                            | Direct mapping available                         |
| Tabs                   | Use the Tabs component from shadcn/ui (based on Radix)                                              | Correct mapping                                  |
| Text Field             | Use an Input component styled with Tailwind; integrate with form libraries                          | ShadCN typically uses Input instead of TextField |
| Timeline               | Build a custom Timeline using flex or grid layouts with Tailwind                                    | No direct component                              |
| Toggle Button          | Build a custom Toggle Button using a combination of Button/Checkbox with Tailind                    | Not provided by default                          |
| Typography             | Use semantic HTML elements with Tailwind's typography classes                                       | Leverage Tailwind Typography plugin              |
| Date Pickers           | Use a third-party Date Picker (e.g., react-datepicker) styled with Tailwind                         | ShadCN doesn't provide date pickers              |
| Dialog                 | Use the Dialog component from shadcn/ui (based on Radix Dialog)                                     | Direct mapping available                         |
| Divider                | Use Separator component from shadcn/ui                                                              | Straightforward replacement                      |
| Drawer                 | Use the Drawer component from shadcn/ui                                                             | Direct mapping as per shadcn docs                |
| List                   | Build using <ul> and <li> with Tailwind spacing                                                     | No dedicated component in ShadCN                 |
| Pagination             | Use the Pagination component from shadcn/ui (as per latest changelog)                               | Direct mapping available                         |
| Paper                  | Mimic Paper using a Card component from shadcn/ui                                                   | No dedicated component                           |
| Progress               | Build a progress bar using the <progress> element styled with Tailwind                              | Custom implementation needed                     |
| Radio Group            | Use the Radio Group component from shadcn/ui (based on Radix)                                       | Direct mapping available                         |
| Rating                 | Build a custom Rating component using icons and Tailwind styles                                     | No pre-built solution in ShadCN                  |
| Select                 | Use the Select component from shadcn/ui (based on Radix)                                            | Direct mapping available                         |

## Migration Strategy

1. **Component Dependency Mapping:**
   - Replace MUI imports with Shadcn/Tailwind components. For example, change:

     ```diff
     - import TableHead from '@mui/material/TableHead';
     + import { TableHeader } from '../ui/table';
     ```

   - Convert `sx` props to Tailwind classes using a helper like `cn()`.

2. **Styling Conversion:**
   - Migrate from Material UI's sx and inline styling to Tailwind utility classes.
   - Leverage responsive utilities from Tailwind and replace theme-based properties with CSS variables where necessary.

3. **Accessibility & Semantics:**
   - Ensure interactive components have proper ARIA attributes and support for keyboard navigation.

4. **Behavior Preservation:**
   - Maintain functionalities such as virtualization, drag-and-drop column reordering, and filtering/sorting actions.
   - Keep event handlers and state management intact while replacing UI components.

5. **Testing Strategy:**
   - Visual regression tests to verify layout, spacing, and sticky header behavior.
   - Interaction tests for drag-and-drop and sort/filter feature validation.
   - Accessibility audits to ensure compliance with ARIA and semantic HTML standards.

## Next Steps

- Update individual component files following this mapping and strategy.
- Gradually remove Material UI dependencies as components are migrated.
- Validate the new implementation with Storybook and integration tests.
