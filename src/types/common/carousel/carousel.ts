export interface CarouslType {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  orientation?: 'vertical' | 'horizontal';
  carouselContentClassName?: string;
  slideCountClassName?: string;
  slideContent?: React.ReactNode[];
}
