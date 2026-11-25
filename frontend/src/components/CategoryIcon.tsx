import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  Braces,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Globe,
  Layers,
  Lock,
  Network,
  Palette,
  Server,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  FileCode2,
  Palette,
  Braces,
  Atom,
  Code2,
  Server,
  ShieldCheck,
  Network,
  Database,
  Cloud,
  Cpu,
  Globe,
  Lock,
  Terminal,
  Layers,
};

export const CategoryIcon: React.FC<{
  name?: string;
  size?: number;
  color?: string;
}> = ({ name = 'Layers', size = 20, color = '#38bdf8' }) => {
  const IconComp = ICON_MAP[name] || Layers;
  return <IconComp size={size} color={color} />;
};
