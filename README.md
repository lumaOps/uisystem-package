# @vADD/ui-system

AD UI System - A comprehensive React component library and design system built with Tailwind CSS and Radix UI.

## Installation

```bash
npm install @add/ui-system
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom next-intl @tanstack/react-query
```

## Usage

### Import Components

```tsx
import { CustomButton, InputCustom, CardCustom } from '@v12/ui-system';
```

### Import Styles

In your main CSS file (e.g., `globals.css` or `app.css`):

```css
@import '@add/ui-system/styles';
```

Or in your Tailwind config, make sure to include the package in your content paths:

```js
module.exports = {
  content: [
    './node_modules/@v12/ui-system/dist/**/*.{js,ts,jsx,tsx}',
    // ... your other paths
  ],
}
```

### Import Utilities

```tsx
import { cn } from '@v12/ui-system/utils';
```

### Import Types

```tsx
import type { CustomButtonProps } from '@v12/ui-system';
```

## Components

This package includes a comprehensive set of React components:

### Form Components
- `InputCustom`, `InputPhoneNumber`, `InputCreditCard`, `NumberInput`
- `SelectCustom`, `ComboboxCustom`, `MultipleSelectCustom`
- `CheckboxCustom`, `RadioGroupCustom`, `SwitchCustom`
- `TextareaCustom`, `DatePickerCustom`, `DateTimePicker`
- `ColorInput`, `OtpInput`, `DropzoneCustom`
- `FormsReader` (Dynamic forms)

### Layout Components
- `CardCustom`, `CardWrapper`, `Separator`
- `AccordionCustom`, `AccordionForm`, `Stepper`
- `BadgeCustom`, `BadgeStatusCustom`

### Navigation Components
- `BreadCrumbCustom`, `DynamicBreadCrumb`
- `Navbar`, `Sidebar`

### Data Display
- `TableCustom`, `PaginationCustom`
- `Chart`, `Skeleton`, `EmptyData`

### Feedback Components
- `AlertCustom`, `AlertDialogCustom`
- `DialogCustom`, `ConfirmationModal`
- `ToastCustom`, `LoadingCustom`

### Editor
- `EditorXCustom` (Rich text editor with Lexical)

### Other Components
- `CalendarCustom`, `DaySelector`, `TimeSelector`
- `QrCodeCustom`, `ProgressCustom`
- `Tooltip`, `PopoverCustom`, `SheetCustom`
- `TabsCustom`, `CarouselImage`
- `DynamicIconLucide`

## Design System

The package includes a complete design system with:

- Custom color palette (HSL-based CSS variables)
- Typography system
- Spacing and layout tokens
- Animation utilities
- Dark mode support
- Custom gradients and shadows

## Development

### Building the Package

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

## Notes

- Some components (like `FormsReader`) may require additional setup for API services
- The package uses Tailwind CSS v4 - ensure your project is compatible
- All components are built with TypeScript and include full type definitions
- The design system CSS variables are included and can be customized

## License

MIT

