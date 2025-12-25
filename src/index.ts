// Main exports for @v12/ui-system package

// Utils
export { cn } from './utils';

// Components - Buttons
export { CustomButton, customButtonVariants } from './components/button/CustomButton';
export type { IconPosition, CustomButtonProps } from './components/button/CustomButton';

// Components - Inputs
export { InputCustom } from './components/input/InputCustom';
export { InputPhoneNumber } from './components/input/InputPhoneNumber';
export { InputCreditCard } from './components/input/InputCreditCard';
export { NumberInput } from './components/input/NumberInput';
export { InputSelectCustom } from './components/input/InputSelectCustom';
export { InputButtonCustom } from './components/input/InputButtonCustom';

// Components - Forms
export { SelectCustom } from './components/select/SelectCustom';
export { CheckboxCustom } from './components/checkbox/CheckboxCustom';
export { RadioGroupCustom } from './components/radio-group/RadioGroupCustom';
export { TextareaCustom } from './components/textarea/TextareaCustom';
export { DatePickerCustom } from './components/date-picker/DatePickerCustom';
export { SwitchCustom } from './components/switch/SwitchCustom';
export { ComboboxCustom } from './components/combobox/ComboboxCustom';
export { MultipleSelectCustom } from './components/multiple-select/MultipleSelectCustom';
export { MultiSelectCheckboxCustom } from './components/multi-select/MultiSelectCheckboxCustom';
export { default as ColorInput } from './components/color-input/ColorInput';
export { OtpInput } from './components/otp-input/OtpInput';
export { default as DropzoneCustom } from './components/dropzone/DropzoneCustom';
export { default as DropzonePdf } from './components/dropzone/DropzonePdf';
export { FormField } from './components/form/form';

// Components - Layout
export { CardCustom } from './components/card/CardCustom';
export { default as CardWrapper } from './components/card/CardWrapper';
export { Separator } from './components/separator/separator';
export { AccordionCustom } from './components/accordion/AccordionCustom';
export { default as AccordionForm } from './components/accordion/AccordionForm';
export { default as HorizontalStepper } from './components/stepper/HorizontalStepper';
export { default as MobileStepper } from './components/stepper/MobileStepper';
export { BadgeCustom } from './components/badge/BadgeCustom';
export { BadgeStatusCustom } from './components/badge/BadgeStatusCustom';

// Components - Navigation
export { BreadCrumbCustom } from './components/breadcrumb/BreadCrumbCustom';
export { default as DynamicBreadCrumb } from './components/breadcrumb/DynamicBreadCrumb';
export { default as Navbar } from './components/layouts/navbar';
export { Sidebar } from './components/sidebar/sidebar';

// Components - Data Display
export { TableCustom } from './components/table/TableCustom';
export { PaginationCustom } from './components/pagination/PaginationCustom';
export { Skeleton } from './components/skeleton/skeleton';
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from './components/chart/chart';
export { default as EmptyData } from './components/empty-data/EmptyData';

// Components - Feedback
export { AlertCustom } from './components/alert/AlertCustom';
export { CustomAlertDialog as AlertDialogCustom } from './components/alert-dialog/AlertDialogCustom';
export { DialogCustom } from './components/dialog/DialogCustom';
export { default as ConfirmationModal } from './components/dialog/ConfirmationModal';
export { CustomToast as ToastCustom } from './components/toast/ToastCustom';
export { SonnerToast } from './components/sonner/sonnerToast';
export { Toaster } from './components/toast/toaster';
export { default as ToasterDefault } from './components/toast/toaster';
export { LoadingCustom } from './components/loading/LoadingCustom';

// Components - Editor
export { default as EditorXCustom } from './components/editor/EditorXCustom';

// Components - Dynamic Forms
export { default as FormsReader } from './components/dynamic-form/forms-read/FormsReader';
export { getComponent as ComponentReturn } from './components/dynamic-form/options/ComponentReturn';
export { buildZodSchemaFromJson as DynamicZodSchema } from './components/dynamic-form/schema/DynamicZodSchema';

// Components - Other
export { CalendarCustom } from './components/calendar/CalendarCustom';
export { DateTimePicker } from './components/date-time-picker/DateTimePicker';
export { DaySelector } from './components/day-selector/DaySelector';
export { default as TimeSelector } from './components/time-selector/TimeSelector';
export { QRCodeCustom as QrCodeCustom } from './components/qr-code/QrCodeCustom';
export { ProgressCustom } from './components/progress/ProgressCustom';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/tooltip/tooltip';
export { PopoverCustom } from './components/popover/popoverCustom';
export { CustomSheet as SheetCustom } from './components/sheet/SheetCustom';
export { TabsCustom } from './components/tabs/TabsCustom';
export { CarouselImage } from './components/carousel/CarouselImage';
export { default as DynamicIconLucide } from './components/dynamic-icon-lucide/DynamicIconLucide';

// Re-export Radix UI primitives that are commonly used
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
export { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
export { Checkbox } from '@radix-ui/react-checkbox';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
export { Label } from '@radix-ui/react-label';
export { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
export { Progress } from '@radix-ui/react-progress';
export { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
export { ScrollArea, Scrollbar as ScrollBar } from '@radix-ui/react-scroll-area';
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
export { Separator as SeparatorPrimitive } from '@radix-ui/react-separator';
export { Slider } from '@radix-ui/react-slider';
export { Switch } from '@radix-ui/react-switch';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
export { Toast, ToastProvider } from '@radix-ui/react-toast';
export { Toggle } from '@radix-ui/react-toggle';
export { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
export { Tooltip as TooltipPrimitive } from '@radix-ui/react-tooltip';

// Export types - individual type exports can be added here as needed
// Note: Types are exported from individual component files

