'use client';

import { QRCodeCanvas } from 'qrcode.react';

export function QRCode({ value, size = 180 }: { value: string; size?: number }) {
  return <QRCodeCanvas value={value} size={size} />;
}
