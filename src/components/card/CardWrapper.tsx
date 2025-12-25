'use client';
import React from 'react';
import { CardCustom } from './CardCustom';
import { CustomButton } from '../button/CustomButton';
import { Label } from '../label/Label';
import { InputCustom } from '../input/InputCustom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/Select';
import { Bell } from 'lucide-react';
import { Switch } from '@radix-ui/react-switch';
import { CardDescription, CardTitle } from './card';

function CardWrapper() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Basic Card */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
          <span className="text-lg">◆</span> Card
        </h2>
        <CardCustom
          header={
            <>
              <CardTitle>Title Text</CardTitle>
              <CardDescription>This is a card description.</CardDescription>
            </>
          }
          footer={
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" size="sm">
                Cancel
              </CustomButton>
              <CustomButton size="sm">Deploy</CustomButton>
            </div>
          }
        >
          <div className="bg-purple-50 rounded-md p-4 text-center border border-dashed border-purple-200">
            Slot (swap it with your content)
          </div>
        </CardCustom>
      </div>

      {/* Card Header */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
          <span className="text-lg">◆</span> Card / Header
        </h2>
        <CardCustom
          header={
            <>
              <CardTitle>Title Text</CardTitle>
              <CardDescription>This is a card description.</CardDescription>
            </>
          }
        />
      </div>

      {/* Card Footer */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
          <span className="text-lg">◆</span> Card / Footer
        </h2>
        <CardCustom
          footer={
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" size="sm">
                Cancel
              </CustomButton>
              <CustomButton size="sm">Deploy</CustomButton>
            </div>
          }
        >
          <CustomButton className="w-full" size="sm">
            Deploy
          </CustomButton>
        </CardCustom>
      </div>

      {/* Card Notification */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
          <span className="text-lg">◆</span> Card / Notification
        </h2>
        <CardCustom>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">This is a notification description.</p>
            </div>
          </div>
        </CardCustom>
      </div>

      {/* Card Example Content */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
          <span className="text-lg">◆</span> Card / Example Content
        </h2>
        <CardCustom>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm">Label</Label>
              <InputCustom placeholder="Placeholder" className="max-w-none" id="1" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Label</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Placeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option">Option</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send notifications to device.</p>
                </div>
              </div>
              <Switch />
            </div>

            <div className="space-y-4 border-t pt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a notification description.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardCustom>
      </div>
    </div>
  );
}

export default CardWrapper;
