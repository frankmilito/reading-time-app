'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Book, Settings, Timer } from 'lucide-react';
import { calculateReadingTime } from '@/lib/calculate-reading-time';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function ReadingTimeEstimator() {
  const [pageCount, setPageCount] = useState<number | undefined>(undefined);
  const [readingSpeed, setReadingSpeed] = useState<number>(30);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState<number | null>(
    null
  );

  // Calculate reading time whenever inputs change
  useEffect(() => {
    if (pageCount && pageCount > 0 && readingSpeed > 0) {
      const minutes = calculateReadingTime(pageCount, readingSpeed);
      setReadingTimeMinutes(minutes);
    } else {
      setReadingTimeMinutes(null);
    }
  }, [pageCount, readingSpeed]);

  const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setPageCount(value === '' ? undefined : Number.parseInt(value));
    }
  };

  const handleSliderChange = (value: number[]) => {
    setReadingSpeed(value[0]);
  };

  // Prevent non-numeric input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and numeric keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      /^\d$/.test(e.key)
    ) {
      // Do nothing
      return;
    }

    // Block any other keys
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageCount" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Page Count
              </Label>
              <Input
                id="pageCount"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                placeholder="Enter number of pages"
                value={pageCount || ''}
                onChange={handlePageCountChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="readingSpeed" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Reading Speed: {readingSpeed} pages per hour
              </Label>
              <Slider
                id="readingSpeed"
                min={1}
                max={100}
                step={1}
                value={[readingSpeed]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {readingSpeed < 20
                  ? 'Slow'
                  : readingSpeed < 40
                  ? 'Average'
                  : readingSpeed < 60
                  ? 'Fast'
                  : 'Very Fast'}{' '}
                reading pace
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {pageCount && pageCount > 0 && readingTimeMinutes !== null && (
        <div className="p-6 bg-primary/10 rounded-lg border border-primary/20 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Timer className="h-6 w-6 text-primary" />
            Reading Time Estimate:
          </h3>
          <p className="text-3xl font-bold text-primary">
            {readingTimeMinutes} minute{readingTimeMinutes !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Based on {pageCount} pages at {readingSpeed} pages per hour
          </p>
        </div>
      )}
    </div>
  );
}
