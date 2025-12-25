declare module 'qrcode.react' {
  import { FC } from 'react';
  
  export interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    bgColor?: string;
    fgColor?: string;
    includeMargin?: boolean;
    marginSize?: number;
    imageSettings?: {
      src: string;
      height: number;
      width: number;
      excavate: boolean;
    };
  }
  
  export const QRCodeSVG: FC<QRCodeProps>;
  const QRCode: FC<QRCodeProps>;
  export default QRCode;
}

