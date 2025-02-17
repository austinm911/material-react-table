# Shadcn React Table (WIP)

This is a fork of [Material React Table](https://www.material-react-table.com/) that uses [Shadcn UI](https://ui.shadcn.com/) components.

It is in progress, feel free to help!

> **📢 Note:** Components are being migrated to `SRT_*` components and hooks/utilities to `*.shadcn.ts` files for now, in order to refer back to the original `MRT_*` components and hooks to check compatibility.

## Migration

We need to do the following:

- [ ] Migrate MUI components to Shadcn / Tailwind equivalents. Note that migration efforts will vary: some components are very complex and require extensive rewriting, while others are simpler and mainly need final touchups.
- [ ] Adjust the theming to ensure a consistent Shadcn/Tailwind look.
- [ ] Confirm that props and overall functionality match those of Material/Mantine React Table.

### Migration Status

- ❌ - Not Started
- 🚧 - In Progress; Needs more work (i.e. larger amount of prop migration, type errors, issues with other component dependencies, etc.)
- 🟧 - Mostly Migrated; Needs final confirmation and minor adjustments
- ✅ - Completed

### Components

#### MUI to Shadcn/Tailwind Equivalents

- `Alert` ➡️ `Alert`
- `Autocomplete` ➡️ `Command`
- `Badge` ➡️ `Badge`
- `Box` ➡️ `div`
- `Button` ➡️ `Button`
- `Checkbox` ➡️ `Checkbox`
- `Chip` ➡️ `Badge`
- `CircularProgress` ➡️ `Spinner`
- `Dialog` ➡️ `Dialog`
- `DatePicker/DateTimePicker/TimePicker` ➡️ `DatePicker`, `Popover`, `Calendar` (plus custom components for `DateTimePicker` and `TimePicker`)
- `IconButton` ➡️ `Button` (with `variant="ghost"`)
- `LinearProgress` ➡️ `Progress`
- `Pagination` ➡️ `Pagination`
- `Paper` ➡️ `Card`
- `Radio` ➡️ `RadioGroup`, `RadioGroupItem`
- `Select` ➡️ `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Skeleton` ➡️ (Custom implementation using Tailwind CSS)
- `Slider` ➡️ `Slider`
- `Table` ➡️ `Table` (Shadcn `Table` component)
- `TableBody` ➡️ `TableBody`
- `TableCell` ➡️ `TableCell`
- `TableContainer` ➡️ `Table` (Shadcn `Table` component includes container)
- `TableFooter` ➡️ `TableFooter`
- `TableHead` ➡️ `TableHead`
- `TableHeader` ➡️ `TableHeader`
- `TableRow` ➡️ `TableRow`
- `TextField` ➡️ `Input`

MRT is made up of the following groups of components:

#### Table Header

| Component                           | Status |
| ----------------------------------- | ------ |
| SRT_TableHead                       | 🚧      |
| SRT_TableHeadCell                   | 🚧      |
| SRT_TableHeadCellColumnActionButton | 🟧      |
| SRT_TableHeadCellFilterContainer    | 🟧      |
| SRT_TableHeadCellFilterLabel        | 🟧      |
| SRT_TableHeadCellGrabHandle         | 🟧      |
| SRT_TableHeadCellResizeHandle       | 🟧      |
| SRT_TableHeadCellSortLabel          | 🟧      |
| SRT_TableHeadRow                    | 🟧      |

#### Table Body

| Component            | Status  |
| -------------------- | ------- |
| SRT_Table            | Unknown |
| SRT_TableBody        | Unknown |
| SRT_TableBodyRow     | Unknown |
| SRT_TableEmptyRow    | Unknown |
| SRT_FilterOptionMenu | Unknown |
| SRT_FilterTextField  | Unknown |

#### Table Footer

| Component       | Status  |
| --------------- | ------- |
| SRT_TableFooter | Unknown |

#### Inputs

#### Menus

#### Buttons

#### Modals

#### Toolbar

### Hooks

<hr/>

View [Documentation](https://www.material-react-table.com/)

<a href="https://npmjs.com/package/material-react-table" target="_blank">
  <img alt="" src="https://badgen.net/npm/v/material-react-table?color=blue" />
</a>
<a href="https://npmtrends.com/material-react-table" target="_blank">
  <img alt="" src="https://badgen.net/npm/dt/material-react-table?label=installs&icon=npm&color=blue" />
</a>
<a href="https://bundlephobia.com/result?p=material-react-table" target="_blank">
  <img alt="" src="https://badgen.net/bundlephobia/minzip/material-react-table@latest?color=blue" />
</a>
<a href="https://star-history.com/#kevinvandy/material-react-table&Date" target="_blank">
  <img alt="" src="https://badgen.net/github/stars/KevinVandy/material-react-table?color=blue" />
</a>
<a href="https://github.com/KevinVandy/material-react-table/blob/v3/LICENSE" target="_blank">
  <img alt="" src="https://badgen.net/github/license/KevinVandy/material-react-table?color=blue" />
</a>
 <a
  href="https://github.com/sponsors/kevinvandy"
  target="_blank"
  rel="noopener"
>
  <img alt="" src="https://img.shields.io/badge/sponsor-violet" />
</a>
<a
  href="https://discord.gg/5wqyRx6fnm"
  target="_blank"
  rel="noopener"
>
  <img alt="" src="https://dcbadge.vercel.app/api/server/5wqyRx6fnm?style=flat">
</a>

## About

### _Quickly Create React Data Tables with Material Design_

### **Built with [Material UI <sup>V6</sup>](https://mui.com) and [TanStack Table <sup>V8</sup>](https://tanstack.com/table/v8)**

<img src="https://material-react-table.com/banner.png" alt="MRT" height="50" />

> Want to use Mantine instead of Material UI? Check out [Mantine React Table](https://www.mantine-react-table.com)

## Learn More

- Join the [Discord](https://discord.gg/5wqyRx6fnm) server to join in on the development discussion or ask questions
- View the [Docs Website](https://www.material-react-table.com/)
- See all [Props, Options, APIs, Components, and Hooks](https://www.material-react-table.com/docs/api)

## Contributors

PRs are Welcome, but please discuss in [GitHub Discussions](https://github.com/KevinVandy/material-react-table/discussions) or the [Discord Server](https://discord.gg/5wqyRx6fnm) first if it is a large change!

Read the [Contributing Guide](https://github.com/KevinVandy/material-react-table/blob/v3/CONTRIBUTING.md) to learn how to run this project locally.

<!-- Use the FORCE, Luke! -->
