import { truncateText } from '@/utils/helpers/helperFunctions';

export function getTitleVinBlock(
  title: string,
  vin: string,
  uuid: string,
  onNavigate: (uuid: string) => void
) {
  return (
    <div className="cursor-pointer" onClick={() => onNavigate(uuid)}>
      <div className="font-medium">{truncateText(title, 20)}</div>
      <div className="text-sm font-normal text-muted-foreground">{vin}</div>
    </div>
  );
}
