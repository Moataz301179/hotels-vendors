'use client'
import HotelOrderingMatrix from './HotelOrderingMatrix';
import { ThemeProvider } from './ThemeProvider';

export default function SandboxPage() {
  return (
    <ThemeProvider>
      <HotelOrderingMatrix />
    </ThemeProvider>
  );
}
