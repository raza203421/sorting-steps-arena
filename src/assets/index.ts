import { Icons } from '../components/icons';
import type { IconCmp } from '../components/icons';

/**
 * No raster assets ship with this build — every glyph is a lucide SVG
 * (rule #21, one icon library per project), so nothing can go missing.
 */
export type SpriteKey = 'sprite1' | 'sprite2' | 'sprite3' | 'sprite4' | 'sprite5';

/** Per-algorithm glyph, keyed by the same `spriteKey` the algo metadata carries. */
export const sprites: Record<SpriteKey, IconCmp> = {
  sprite1: Icons.ArrowLeftRight,
  sprite2: Icons.Target,
  sprite3: Icons.ListOrdered,
  sprite4: Icons.Zap,
  sprite5: Icons.BarChart3,
};
