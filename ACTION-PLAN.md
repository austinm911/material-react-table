# Action Plan: Material-React-Table Refactor (MUI to Shadcn/Tailwind)

This plan prioritizes the simplest, most isolated changes first, focusing on a gradual transition.

## Phase 1: Foundation and Minimal MUI Removal

1. **Introduce `cn` and Tailwind Utilities:**

    * **Goal:**  Set up the basic Tailwind configuration and introduce the `cn` utility (from the `clsx` and `tailwind-merge` libraries) for conditional class name management. This is a foundational step that doesn't change any UI but prepares for Tailwind integration.
    * **Steps:**
        * Install `clsx`, `tailwind-merge`, and `tailwindcss-animate`.

        ```bash
        pnpm add clsx tailwind-merge tailwindcss-animate
        ```

        * Create a `utils` file for the `cn` function.

        ````typescript:packages/material-react-table/src/lib/utils.ts
        import { clsx, type ClassValue } from 'clsx';
        import { twMerge } from 'tailwind-merge';

        export function cn(...inputs: ClassValue[]) {
          return twMerge(clsx(inputs));
        }

        ````

        * Start using `cn` in a very simple component, like `MRT_TablePaper`, to replace any existing `className` logic.  This is a low-risk way to test the utility.

        ````diff:packages/material-react-table/src/components/table/MRT_TablePaper.tsx
        + import { cn } from '../../lib/utils';

          // ...existing code

          return (
        -   <Paper
        +   <div
        -     ref={tablePaperRef}
              {...tablePaperProps}
        -     sx=[
        +      className={cn(
                {
                  'mrt-table-paper': !disablePaperProps,
                  'mrt-table-paper-rounded':
                    !disablePaperProps && rounded,
                },
        +       tablePaperProps?.className,
        +     )}
        +     sx={{
                ...(typeof tablePaperProps?.sx === 'function'
                  ? tablePaperProps.sx(theme)
                  : tablePaperProps?.sx),
        -       {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? darken(baseBackgroundColor, 0.05)
                      : lighten(baseBackgroundColor, 0.05),
                  borderRadius: rounded ? '8px' : '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
        -       },
        -       ...(typeof tablePaperProps?.sx === 'function'
        -         ? tablePaperProps.sx(theme)
        -         : tablePaperProps?.sx),
        -     ]}
        -   >
        +     }}
            >
              {tableContent}
        -   </Paper>
        +   </div>
          );
        };
        ````

    * **Testing:**  Visually inspect in Storybook.  Ensure no visual changes.  Unit tests for the `cn` utility itself are less critical here.

2. **Replace Simple MUI Icons:**

    * **Goal:**  Begin removing `@mui/icons-material` dependency by replacing simple icons with their `lucide-react` equivalents.  Focus on icons used in isolation (not deeply nested within MUI components).
    * **Steps:**
        * Identify easy-to-replace icons, such as those in `MRT_ExpandAllButton`, `MRT_ExpandButton`, and potentially some in the toolbar components.
        * Install `lucide-react`:

          ```bash
          pnpm add lucide-react
          ```

        * Replace the imports and usage. For example:

            ````diff:packages/material-react-table/src/components/buttons/MRT_ExpandButton.tsx
            - import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
            - import Tooltip from '@mui/material/Tooltip';
            - import { useTheme } from '@mui/material/styles';
            + import { type IconButtonProps } from '@mui/material/IconButton';
            + import Tooltip from '@mui/material/Tooltip';
            + import { useTheme } from '@mui/material/styles';
            + import { ChevronDown } from 'lucide-react';
              //...
              options: {
            -   icons: { ExpandMoreIcon },
            +   icons: {},
                localization,
                muiExpandButtonProps,
                positionExpandColumn,
                renderDetailPanel,
              },
            } = table;

            //...

            {iconButtonProps?.children ?? (
            -  <ExpandMoreIcon
            + <ChevronDown
                style={{
                  transform: `rotate(${
                    !canExpand && !renderDetailPanel
            ````

        * Repeat for other simple icon replacements.
    * **Testing:**  Visually inspect in Storybook.  Ensure icons appear and function correctly.

3. **Replace `MRT_TablePaper` with a `div` and Tailwind:**

    * **Goal:**  Remove the `Paper` component from `@mui/material` and style the main table container with Tailwind. This is a good starting point because `MRT_TablePaper` is a relatively simple wrapper.
    * **Steps:**
        * In `MRT_TablePaper`, replace the `<Paper>` component with a `<div>`.
        * Apply Tailwind classes to achieve the same visual effect (background color, border radius, box shadow, etc.) as the original `Paper` component.  Use the `cn` utility.  Reference the existing `sx` prop values to guide the Tailwind classes.
        * Update any relevant styles in `globals.css` to target the new classes.
    * **Testing:**  Visually inspect in Storybook across various table configurations (different densities, enabled features).  Ensure the table container looks and behaves as before.

4. **Replace Simple MUI Components in `MRT_ToolbarAlertBanner` and `MRT_ToolbarDropZone`:**

      * **Goal:** Target components within the toolbar that use basic MUI elements like `Alert`, `Typography`, and `Box`. Replace these with simple HTML elements and Tailwind classes.
      * **Steps:**
          * Identify the MUI components used in `MRT_ToolbarAlertBanner` and `MRT_ToolbarDropZone`.
          * Replace `Alert` with a `div` and use Tailwind classes for styling (background colors, padding, border, etc.).
          * Replace `Typography` with appropriate HTML elements (e.g., `<div>`, `<p>`, `<span>`) and Tailwind text styling classes.
          * Replace `Box` with `div` and apply Tailwind layout classes.
          * Adjust any necessary logic to accommodate the removal of MUI props.
      * **Testing:** Visually inspect in Storybook. Ensure the toolbar alert banner and drop zone maintain their appearance and functionality.

**Phase 2: Introduce Shadcn UI Components and Headless Structure**

5. **Create a `Table` Component in `components/ui`:**

    * **Goal:**  Begin establishing the Shadcn UI component structure.  Start with the core `Table` component, even if it's initially just a wrapper.
    * **Steps:**
        * Create a new file: `packages/material-react-table/src/components/ui/table.tsx`.
        * Create a basic `Table` component that renders a `<table>` element.  This will be the foundation for the headless structure.

        ````typescript:packages/material-react-table/src/components/ui/table.tsx
        import { forwardRef } from 'react';
        import { cn } from '../../lib/utils';

        export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

        const Table = forwardRef<HTMLTableElement, TableProps>(
          ({ className, ...props }, ref) => (
            <div className={cn('relative w-full overflow-auto', className)}>
              <table ref={ref} {...props} />
            </div>
          ),
        );
        Table.displayName = 'Table';

        export { Table };

        ````

    * **Testing:** No visual changes expected yet. This is a structural change.

6. **Create `TableHeader`, `TableRow`, `TableCell`, `TableBody`, `TableFooter` Components:**

    * **Goal:**  Create simple, headless versions of the core table structure components, mirroring Shadcn UI's `Table` component structure.
    * **Steps:**
        * Create files for `TableHeader`, `TableRow`, `TableCell`, `TableBody`, and `TableFooter` in the `components/ui` directory.
        * Each component should:
            * Accept a `className` prop and forward it using `cn`.
            * Render the appropriate HTML element (e.g., `<thead>`, `<tr>`, `<td>`, `<tbody>`, `<tfoot>`).
            * Forward any additional props to the underlying HTML element.
            * Use `forwardRef` for proper ref handling.

        ````typescript:packages/material-react-table/src/components/ui/table-header.tsx
        import { forwardRef } from 'react';
        import { cn } from '../../lib/utils';

        export interface TableHeaderProps
          extends React.HTMLAttributes<HTMLTableSectionElement> {}

        const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
          ({ className, ...props }, ref) => (
            <thead ref={ref} className={cn(className)} {...props} />
          ),
        );
        TableHeader.displayName = 'TableHeader';

        export { TableHeader };
        ````

        ````typescript:packages/material-react-table/src/components/ui/table-row.tsx
        import { forwardRef } from 'react';
        import { cn } from '../../lib/utils';

        export interface TableRowProps
          extends React.HTMLAttributes<HTMLTableRowElement> {}

        const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
          ({ className, ...props }, ref) => (
            <tr ref={ref} className={cn(className)} {...props} />
          ),
        );
        TableRow.displayName = 'TableRow';

        export { TableRow };
        ````

        ````typescript:packages/material-react-table/src/components/ui/table-cell.tsx
        import { forwardRef } from 'react';
        import { cn } from '../../lib/utils';

        export interface TableCellProps
          extends React.HTMLAttributes<HTMLTableCellElement> {}

        const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
          ({ className, ...props }, ref) => (
            <td ref={ref} className={cn(className)} {...props} />
          ),
        );
        TableCell.displayName = 'TableCell';

        export { TableCell };
        ````

        ````typescript:packages/material-react-table/src/components/ui/table-body.tsx
        import { forwardRef } from 'react';
        import { cn } from '../../lib/utils';

        export interface TableBodyProps
          extends React.HTMLAttributes<HTMLTableSectionElement> {}

        const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
          ({ className, ...props }, ref) => (
            <tbody ref={ref} className={cn(className)} {...props} />
          ),
        );
        TableBody.displayName = 'TableBody';

        export { TableBody };
        ````

        ````typescript:packages/material-react-table/src/components/ui/table-footer.tsx
        import { forwardRef } from 'react';
        import { cn } from '../../lib/utils';

        export interface TableFooterProps
          extends React.HTMLAttributes<HTMLTableSectionElement> {}

        const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
          ({ className, ...props }, ref) => (
            <tfoot ref={ref} className={cn(className)} {...props} />
          ),
        );
        TableFooter.displayName = 'TableFooter';

        export { TableFooter };
        ````

7. **Refactor `MRT_TableBody` to use new headless components:**

    * **Goal:**  Migrate the existing `MRT_TableBody` component to use the new headless `TableBody`, `TableRow`, and `TableCell` components.
    * **Steps:**
        * Import the new headless components into `MRT_TableBody`.
        * Replace the MUI `<TableBody>`, `<TableRow>`, and `<TableCell>` components with their headless counterparts.
        * Pass the necessary props (including `className`, `style`, and event handlers) to the headless components.  This is where `cn` will be heavily used.
        * Remove the imports of the MUI components that were replaced.

        ````diff:packages/material-react-table/src/components/body/MRT_TableBody.tsx
        - import TableBody, { type TableBodyProps } from '@mui/material/TableBody';
        - import Typography from '@mui/material/Typography';
        + import {
        +   TableBody,
        +   TableCell,
        +   TableRow,
        + } from '../ui/table';
        + import { Typography } from '../ui/typography';
        ````

        ````diff:packages/material-react-table/src/components/body/MRT_TableBodyCell.tsx
        - import Skeleton from '@mui/material/Skeleton';
        - import TableCell, { type TableCellProps } from '@mui/material/TableCell';
        - import { useTheme } from '@mui/material/styles';
        + import { Skeleton } from '../ui/skeleton';
        + import { TableCell, type TableCellProps } from '../ui/table';
        + import { useTheme } from '~/src/hooks/useTheme';
        ````

        ````diff:packages/material-react-table/src/components/body/MRT_TableBodyRow.tsx
        - import TableRow, { type TableRowProps } from '@mui/material/TableRow';
        + import { TableCell, TableRow, type TableRowProps } from '../ui/table';
        ````

    * **Testing:**  Thoroughly test in Storybook.  Verify that all table body functionality (rendering data, row selection, virtualization, etc.) works as expected.  Pay close attention to styling and layout.

8. **Refactor `MRT_TableHead` and `MRT_TableFooter` Similarly:** Follow the same pattern as step 7, migrating `MRT_TableHead` and `MRT_TableFooter` to use the headless components.

9. **Introduce Shadcn UI `Button` (gradually):**

    * **Goal:**  Start replacing MUI `IconButton` and `Button` components with Shadcn UI's `Button` component in a controlled manner.
    * **Steps:**
        * Create the `Button` component in the `components/ui` folder.

        ````typescript:packages/material-react-table/src/components/ui/button.tsx
        import { forwardRef } from 'react';
        import { Slot } from '@radix-ui/react-slot';
        import { cva, type VariantProps } from 'class-variance-authority';

        import { cn } from '../../lib/utils';

        const buttonVariants = cva(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            variants: {
              variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive:
                  'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                  'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary:
                  'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
              },
              size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
              },
            },
            defaultVariants: {
              variant: 'default',
              size: 'default',
            },
          },
        );

        export interface ButtonProps
          extends React.ButtonHTMLAttributes<HTMLButtonElement>,
            VariantProps<typeof buttonVariants> {
          asChild?: boolean;
        }

        const Button = forwardRef<HTMLButtonElement, ButtonProps>(
          ({ className, variant, size, asChild = false, ...props }, ref) => {
            const Comp = asChild ? Slot : 'button';
            return (
              <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
              />
            );
          },
        );
        Button.displayName = 'Button';

        export { Button, buttonVariants };
        ````

        * Start with simple buttons, like those in `MRT_ExpandAllButton` or `MRT_ToggleFullScreenButton`.
        * Replace the MUI `IconButton` or `Button` with the Shadcn UI `Button`.
        * Map the necessary props (e.g., `onClick`, `disabled`, `aria-label`) to the Shadcn UI `Button`.
        * Use the `variant="ghost"` or `variant="outline"` prop on the Shadcn UI `Button` to match the existing icon button styles initially.  You can customize the appearance later using Tailwind classes.

        ````diff:packages/material-react-table/src/components/buttons/MRT_ExpandAllButton.tsx
        - import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
        - import Tooltip from '@mui/material/Tooltip';
        + import { type IconButtonProps } from '@mui/material/IconButton';
        + import Tooltip from '@mui/material/Tooltip';
        + import { Button } from '../ui/button';
        ````

    * **Testing:**  Visually inspect each replaced button in Storybook.  Ensure it looks and functions correctly.

10. **Replace Tooltips:**
    * **Goal:** Replace the MUI `Tooltip` with the Shadcn-UI `Tooltip`.
    * **Steps:**
        * Create the `Tooltip`, `TooltipContent`, `TooltipProvider`, and `TooltipTrigger` components in the `components/ui` folder.

        ````typescript:packages/material-react-table/src/components/ui/tooltip.tsx
        import * as React from 'react';
        import * as TooltipPrimitive from '@radix-ui/react-tooltip';

        import { cn } from '../../lib/utils';

        const TooltipProvider = TooltipPrimitive.Provider;

        const Tooltip = TooltipPrimitive.Root;

        const TooltipTrigger = TooltipPrimitive.Trigger;

        const TooltipContent = React.forwardRef<
          React.ElementRef<typeof TooltipPrimitive.Content>,
          React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
        >(({ className, sideOffset = 4, ...props }, ref) => (
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
              'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-50 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              className,
            )}
            {...props}
          />
        ));
        TooltipContent.displayName = TooltipPrimitive.Content.displayName;

        export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

        ````

        * Replace the MUI `Tooltip` with the Shadcn UI `Tooltip` components.

        ````diff:packages/material-react-table/src/components/buttons/MRT_ExpandAllButton.tsx
        - import Tooltip from '@mui/material/Tooltip';
        + import {
        +   Tooltip,
        +   TooltipContent,
        +   TooltipProvider,
        +   TooltipTrigger,
        + } from '@components/ui/tooltip';

        //...

        return (
        + <TooltipProvider>
        +   <Tooltip>
        +    <TooltipTrigger asChild>
              <span>
                <IconButton
        //...
                </IconButton>
              </span>
        +   </TooltipTrigger>
        +   <TooltipContent>
        +       <p>
                  {iconButtonProps?.title ??
                    (isAllRowsExpanded
                      ? localization.collapseAll
                      : localization.expandAll)}
        +       </p>
        +   </TooltipContent>
        +    </Tooltip>
        + </TooltipProvider>

        );

        ````

**Phase 3: Advanced Components and Styling**

11. **Address More Complex MUI Components:**

    * Tackle components that use more intricate MUI features, such as:
        * **`MRT_TablePagination`:**  This will likely involve replacing the MUI `Pagination` component with a custom implementation or a combination of Shadcn UI's `Select` and `Button` components.
        * **`MRT_GlobalFilterTextInput` and Column Filters:**  Replace the MUI `TextField` with a custom input or Shadcn UI's `Input` component, and manage filter logic more directly.
        * **`MRT_EditCellTextField`:** Similar to above, replace the MUI `TextField` and handle edit state management.
    * For each component, follow a similar process:
        * Identify the specific MUI components and their props.
        * Determine the best approach for replacement (custom implementation, Shadcn UI components, or a combination).
        * Implement the replacement, carefully managing state and event handling.
        * Thoroughly test in Storybook.

12. **Refine Styling with Tailwind:**

    * **Goal:**  Ensure consistent styling across the table using Tailwind classes.  This includes colors, spacing, typography, and other visual aspects.
    * **Steps:**
        * Review the existing styles (both inline `sx` props and any CSS files).
        * Identify common style patterns and create reusable Tailwind utility classes (potentially in `globals.css` or a dedicated Tailwind configuration file).
        * Replace inline styles and MUI-specific styling with Tailwind classes.
        * Leverage the `theme` object (if applicable) to maintain consistency with the user's overall application theme.

13. **Headless Component Customization:**

    * **Goal:**  Provide clear and easy ways for **users** to customize the table's appearance using their own Tailwind classes.
    * **Steps:**
        * Ensure all headless components accept and correctly apply `className` props.
        * Document how users can override the default styles using Tailwind.
        * Consider providing "slots" or render props for more advanced customization scenarios.

14. **Remove Remaining MUI Dependencies:**

    * **Goal:**  Completely eliminate dependencies on `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, and `@emotion/*`.
    * **Steps:**
        * After all components have been refactored, remove the MUI dependencies from `package.json`.
        * Run thorough tests (including any existing unit tests and visual checks in Storybook) to ensure no lingering MUI dependencies are causing issues.
        * Update documentation and examples to reflect the removal of MUI.

**Ongoing:**

* **Documentation:**  Continuously update the documentation to reflect the changes, including clear instructions on how to use the new headless components and customize styling with Tailwind.
* **Examples:**  Create new Storybook examples showcasing the Shadcn UI components and various customization options.
* **Testing:**  Maintain a robust testing strategy, including unit tests and visual regression testing (if possible), to catch any regressions during the refactor.
* **Performance:**  Monitor performance throughout the refactor and optimize as needed. The switch to headless components and Tailwind *should* improve performance, but it's important to verify.

This action plan provides a structured approach to the refactor, prioritizing minimal disruption and gradual changes. Remember to commit frequently and test thoroughly after each step. Good luck!
